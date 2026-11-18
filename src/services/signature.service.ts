import {v4 as uuid} from 'uuid';
import {SessionSignature, SignerRole} from '../types/session-signature';
import {getDBConnection} from './database.service';

export type SignatureInput = {
  signer_name?: string | null;
  // SVG of the drawing; empty when the signer refuses or is absent
  svg?: string | null;
  refusal_reason?: string | null;
  absence_reason?: string | null;
};

const SVG_PREFIX = 'data:image/svg+xml;utf8,';

// Signatures of the session (B17): one per signer; the drawing is kept in the image table,
// which is already sent to the server.
export const SignatureService = {
  getSignatures: async (
    sessionId: string,
  ): Promise<{[role: string]: SessionSignature & {svg?: string}}> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      `
      SELECT s.*, i.value as image_value FROM session_signature as s
      LEFT JOIN image as i ON i.id = s.image_id
      WHERE s.session_id = ?
    `,
      [sessionId],
    );
    return result[0].rows.raw().reduce(
      (
        map: {[role: string]: SessionSignature},
        {image_value, ...row}: any,
      ) => ({
        ...map,
        [row.signer_role]: {
          ...row,
          svg: image_value?.startsWith(SVG_PREFIX)
            ? decodeURIComponent(image_value.slice(SVG_PREFIX.length))
            : undefined,
        },
      }),
      {},
    );
  },

  saveSignature: async (
    sessionId: string,
    role: SignerRole,
    signature: SignatureInput,
  ): Promise<void> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();
    const existing = (
      await db.executeSql(
        'SELECT * FROM session_signature WHERE session_id = ? AND signer_role = ?',
        [sessionId, role],
      )
    )[0].rows.raw()[0];

    let imageId: string | null = existing?.image_id || null;
    if (signature.svg) {
      const value = SVG_PREFIX + encodeURIComponent(signature.svg);
      if (imageId) {
        await db.executeSql(
          "UPDATE image SET value = ?, _status = 'pending' WHERE id = ?",
          [value, imageId],
        );
      } else {
        imageId = uuid();
        await db.executeSql(
          "INSERT INTO image(id, name, value, external_id, _status) VALUES (?, ?, ?, ?, 'pending')",
          [imageId, `signature-${role.toLowerCase()}`, value, sessionId],
        );
      }
    } else {
      // A cleared signature: its image is removed if it was never sent to the server
      if (imageId) {
        await db.executeSql(
          "DELETE FROM image WHERE id = ? AND _status != 'synced'",
          [imageId],
        );
      }
      imageId = null;
    }

    const values = [
      signature.signer_name || null,
      imageId,
      signature.svg ? existing?.signed_at || now : null,
      signature.refusal_reason ?? null,
      signature.absence_reason ?? null,
      now,
    ];
    if (existing) {
      await db.executeSql(
        `
        UPDATE session_signature
        SET signer_name = ?, image_id = ?, signed_at = ?, refusal_reason = ?, absence_reason = ?, updated_at = ?, _status = 'pending'
        WHERE id = ?
      `,
        [...values, existing.id],
      );
    } else {
      await db.executeSql(
        `
        INSERT INTO session_signature(signer_name, image_id, signed_at, refusal_reason, absence_reason, updated_at, id, session_id, signer_role, created_at, _status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `,
        [...values, uuid(), sessionId, role, now],
      );
    }
  },

  syncSignatures: async (signatures: SessionSignature[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      (signatures || []).map(signature =>
        db.executeSql(
          `
          INSERT OR REPLACE INTO session_signature(id, session_id, signer_role, signer_name, image_id, signed_at, refusal_reason, absence_reason, created_at, updated_at, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            signature.id,
            signature.session_id,
            signature.signer_role,
            signature.signer_name,
            signature.image_id,
            signature.signed_at,
            signature.refusal_reason,
            signature.absence_reason,
            signature.created_at,
            signature.updated_at,
          ],
        ),
      ),
    );
  },
};
