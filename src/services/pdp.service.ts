import {v4 as uuid} from 'uuid';
import {Pdp, PdpLibraryItem, PdpObjective, PdpRuleSet} from '../types/pdp';
import {getDBConnection} from './database.service';

// Professional Development Plan of the session (B23), generated on the device with the
// published rules, so that it can be set up with the teacher without connection.
export const PdpService = {
  getPublishedRuleSet: async (): Promise<PdpRuleSet | undefined> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      "SELECT * FROM pdp_rule_set WHERE status = 'PUBLISHED' ORDER BY version DESC LIMIT 1",
    );
    return result[0].rows.raw()[0];
  },

  getLibrary: async (
    ruleSetId: string,
  ): Promise<{[questionId: string]: PdpLibraryItem}> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      'SELECT * FROM pdp_library_item WHERE rule_set_id = ?',
      [ruleSetId],
    );
    return result[0].rows.raw().reduce(
      (map: {[questionId: string]: PdpLibraryItem}, item: PdpLibraryItem) => ({
        ...map,
        [item.question_id]: item,
      }),
      {},
    );
  },

  getPdp: async (
    sessionId: string,
  ): Promise<{pdp: Pdp; objectives: PdpObjective[]} | undefined> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      'SELECT * FROM pdp WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
      [sessionId],
    );
    const pdp: Pdp | undefined = result[0].rows.raw()[0];
    if (!pdp) {
      return undefined;
    }
    const objectives = await db.executeSql(
      'SELECT * FROM pdp_objective WHERE pdp_id = ? AND deleted_at IS NULL ORDER BY rank',
      [pdp.id],
    );
    return {pdp, objectives: objectives[0].rows.raw()};
  },

  // Creates the plan, or replaces the draft when the scoring has changed
  saveDraft: async (
    sessionId: string,
    ruleSet: PdpRuleSet,
    diagnostic: string,
    pdpId?: string,
  ): Promise<string> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();
    if (pdpId) {
      await db.executeSql(
        "UPDATE pdp SET diagnostic = ?, rule_set_id = ?, rule_set_version = ?, status = 'DRAFT', updated_at = ?, _status = 'pending' WHERE id = ?",
        [diagnostic, ruleSet.id, ruleSet.version, now, pdpId],
      );
      return pdpId;
    }
    const id = uuid();
    await db.executeSql(
      `
      INSERT INTO pdp(id, session_id, rule_set_id, rule_set_version, diagnostic, status, created_at, updated_at, _status)
      VALUES (?, ?, ?, ?, ?, 'DRAFT', ?, ?, 'pending')
    `,
      [id, sessionId, ruleSet.id, ruleSet.version, diagnostic, now, now],
    );
    return id;
  },

  // Saves the objectives of the plan in their order; the others are removed
  saveObjectives: async (
    pdpId: string,
    objectives: PdpObjective[],
  ): Promise<void> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();
    const kept = objectives.map(objective => objective.id);
    await db.executeSql(
      `UPDATE pdp_objective SET deleted_at = ?, updated_at = ?, _status = 'pending'
       WHERE pdp_id = ? AND deleted_at IS NULL AND id NOT IN (${kept
         .map(() => '?')
         .join(', ')})`,
      [now, now, pdpId, ...kept],
    );
    for (const [index, objective] of objectives.entries()) {
      await db.executeSql(
        `
        INSERT OR REPLACE INTO pdp_objective(id, pdp_id, question_id, category, rank, objective, actions, indicator, due_date, origin, created_at, updated_at, deleted_at, _status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM pdp_objective WHERE id = ?), ?), ?, NULL, 'pending')
      `,
        [
          objective.id,
          pdpId,
          objective.question_id || null,
          objective.category,
          index + 1,
          objective.objective,
          objective.actions,
          objective.indicator,
          objective.due_date,
          objective.origin,
          objective.id,
          now,
          now,
        ],
      );
    }
  },

  validate: async (pdpId: string): Promise<string> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();
    await db.executeSql(
      "UPDATE pdp SET status = 'VALIDATED', validated_at = ?, updated_at = ?, _status = 'pending' WHERE id = ?",
      [now, now, pdpId],
    );
    return now;
  },

  syncRules: async (
    ruleSets: PdpRuleSet[],
    library: PdpLibraryItem[],
  ): Promise<void> => {
    const db = await getDBConnection();
    for (const ruleSet of ruleSets || []) {
      await db.executeSql(
        `
        INSERT OR REPLACE INTO pdp_rule_set(id, version, status, diagnostic_config, max_objectives, published_at, _status)
        VALUES (?, ?, ?, ?, ?, ?, 'synced')
      `,
        [
          ruleSet.id,
          ruleSet.version,
          ruleSet.status,
          typeof ruleSet.diagnostic_config === 'string'
            ? ruleSet.diagnostic_config
            : JSON.stringify(ruleSet.diagnostic_config),
          ruleSet.max_objectives,
          ruleSet.published_at,
        ],
      );
    }
    // A version that is no longer published is not applied anymore
    if ((ruleSets || []).length) {
      await db.executeSql(
        `UPDATE pdp_rule_set SET status = 'ARCHIVED' WHERE id NOT IN (${ruleSets
          .map(() => '?')
          .join(', ')})`,
        ruleSets.map(ruleSet => ruleSet.id),
      );
    }
    for (const item of library || []) {
      await db.executeSql(
        `
        INSERT OR REPLACE INTO pdp_library_item(id, rule_set_id, question_id, objective, actions, indicator, _status)
        VALUES (?, ?, ?, ?, ?, ?, 'synced')
      `,
        [
          item.id,
          item.rule_set_id,
          item.question_id,
          item.objective,
          item.actions,
          item.indicator,
        ],
      );
    }
  },

  syncPdps: async (pdps: Pdp[], objectives: PdpObjective[]): Promise<void> => {
    const db = await getDBConnection();
    for (const pdp of pdps || []) {
      await db.executeSql(
        `
        INSERT OR REPLACE INTO pdp(id, session_id, rule_set_id, rule_set_version, diagnostic, status, validated_at, created_at, updated_at, _status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
      `,
        [
          pdp.id,
          pdp.session_id,
          pdp.rule_set_id,
          pdp.rule_set_version,
          pdp.diagnostic,
          pdp.status,
          pdp.validated_at,
          pdp.created_at,
          pdp.updated_at,
        ],
      );
    }
    for (const objective of objectives || []) {
      await db.executeSql(
        `
        INSERT OR REPLACE INTO pdp_objective(id, pdp_id, question_id, category, rank, objective, actions, indicator, due_date, origin, created_at, updated_at, deleted_at, _status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
      `,
        [
          objective.id,
          objective.pdp_id,
          objective.question_id,
          objective.category,
          objective.rank,
          objective.objective,
          objective.actions,
          objective.indicator,
          objective.due_date,
          objective.origin,
          objective.created_at,
          objective.updated_at,
          objective.deleted_at,
        ],
      );
    }
  },
};
