import moment from 'moment';
import {Competence} from '../types/competence';
import {Question} from '../types/question';
import {Session} from '../types/session';
import {SessionActivity} from '../types/session-activity';
import {ChecklistItem, Documentation} from '../types/checklist';
import {ObservationNote} from '../types/observation-note';
import {DiagnosticEntry, Pdp, PdpObjective, PdpRuleSet} from '../types/pdp';
import {getAnswerCode} from './pdp.helper';
import {NOT_APPLICABLE} from './answer.helper';

export type ReportSignature = {
  signer_name?: string | null;
  svg?: string | null;
  refusal_reason?: string | null;
  absence_reason?: string | null;
};

// Everything the two documents show, read from the device (see ReportService)
export type ReportData = {
  session: Session;
  teacher: {name: string; subject?: string | null};
  school: {name: string};
  observer: {
    name: string;
    phone?: string | null;
    email?: string | null;
    sex?: string | null;
    // Label of the function, e.g. Inspecteur.trice
    function?: string | null;
    duty_station?: string | null;
    postal_box?: string | null;
  };
  activities: SessionActivity[];
  competencies: Competence[];
  answers: {[questionId: string]: number};
  scores: {[competenceId: string]: number | undefined};
  checklist: ChecklistItem[];
  documentations: {[checklistItemId: string]: Documentation};
  notes: ObservationNote[];
  signatures: {[role: string]: ReportSignature};
  pdp?: {
    pdp: Pdp;
    objectives: PdpObjective[];
    ruleSet?: PdpRuleSet;
    diagnostic: DiagnosticEntry[];
  };
};

// The documents follow the paper tool of annex B, which is in French.
const escape = (value?: string | number | null) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const date = (value?: string | Date | null) =>
  value ? moment(value).format('DD/MM/YYYY') : '';

const time = (value?: string | Date | null) =>
  value ? moment(value).format('HH:mm') : '';

// Appreciation of an observation, in the words of the paper tool (B11)
const APPRECIATION_LABELS: {[code: string]: string} = {
  VERY_GOOD: 'très bien',
  GOOD: 'bien',
  FAIRLY_GOOD: 'assez bien',
  INSUFFICIENT: 'insuffisant',
  WEAK: 'faible',
};

const STYLE = `
  @page { size: A4; margin: 12mm 12mm 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Noto Sans", Arial, sans-serif; font-size: 10.5px; color: #000; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .footer { display: flex; justify-content: space-between; margin-top: 10px; font-size: 8.5px; color: #666; }
  .top { display: flex; gap: 10px; align-items: flex-start; }
  .ministry { width: 170px; flex: none; display: flex; flex-direction: column; align-items: center; text-align: center; font-size: 9.5px; line-height: 1.4; }
  .ministry.center { width: auto; margin-bottom: 8px; }
  .fields { flex: 1; border-collapse: collapse; }
  .fields td { padding: 2px 4px; border-bottom: 1px dotted #999; }
  .copies { list-style: none; margin: 0; padding: 4px 8px; border: 1px solid #000; font-size: 8.5px; line-height: 1.5; }
  h2 { margin: 14px 0 8px; text-align: center; font-size: 12.5px; text-transform: uppercase; }
  h3 { margin: 14px 0 6px; font-size: 11.5px; text-transform: uppercase; }
  .subtitle { margin: -2px 0 12px; text-align: center; font-style: italic; }
  table.t { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  table.t th, table.t td { border: 1px solid #000; padding: 3px 4px; vertical-align: top; }
  table.t th { background: #eee; font-size: 9.5px; }
  .c { text-align: center; }
  .small { font-size: 9px; }
  .nowrap { white-space: nowrap; }
  .grid td { font-size: 9.5px; }
  .domain td { background: #ddd; font-weight: 700; text-transform: uppercase; }
  .sub td { background: #f2f2f2; font-weight: 700; }
  .grid td.opt { width: 24px; text-align: center; vertical-align: middle; color: #999; font-size: 8.5px; }
  .grid td.na { background: #f2f2f2; }
  .grid td.mark { color: #000; font-size: 13px; font-weight: 700; }
  .scores { display: flex; justify-content: space-around; }
  .scores span { display: inline-block; width: 18px; height: 18px; line-height: 15px; text-align: center; }
  .scores .circled { border: 2px solid #000; border-radius: 50%; }
  .identity th { width: 18%; text-align: left; }
  .line { margin: 7px 0; line-height: 1.5; }
  .signatures { display: flex; gap: 14px; margin-top: 18px; text-align: center; }
  .signatures > div { flex: 1; }
  .sign-box { height: 70px; display: flex; align-items: center; justify-content: center; margin: 6px 0; border-bottom: 1px solid #000; }
  .sign-box svg { max-height: 66px; max-width: 100%; }
  .sign-box em { font-size: 9.5px; }
`;

const page = (content: string, number: number, total: number) => `
  <div class="page">
    ${content}
    <div class="footer">
      <span>Coach Digital RDC · document généré le ${date(new Date())}</span>
      <span>Page ${number}/${total}</span>
    </div>
  </div>`;

const html = (title: string, pages: string[]) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" /><title>${escape(
  title,
)}</title><style>${STYLE}</style></head>
<body>${pages.join('')}</body></html>`;

// Signature drawn on the device (SVG), or the reason given instead
const signatureBox = (label: string, signature?: ReportSignature) => `
  <div>
    <strong>${label}</strong>
    <div class="sign-box">${
      signature?.svg
        ? signature.svg
        : signature?.refusal_reason
        ? `<em>Refus de signer : ${escape(signature.refusal_reason)}</em>`
        : signature?.absence_reason
        ? `<em>Absent.e : ${escape(signature.absence_reason)}</em>`
        : ''
    }</div>
    <span>${escape(signature?.signer_name)}</span>
  </div>`;

const COLUMNS: {label: string; code: string}[] = [
  {label: 'N/A', code: 'NA'},
  {label: 'O', code: 'YES'},
  {label: 'N', code: 'NO'},
  {label: 'F', code: 'LOW'},
  {label: 'M', code: 'MEDIUM'},
  {label: 'E', code: 'HIGH'},
];

const allowedCodes = (question: Question) => [
  ...(question.type === 'YES_NO' ? ['YES', 'NO'] : ['LOW', 'MEDIUM', 'HIGH']),
  ...(question.allow_na ? ['NA'] : []),
];

const scoreCells = (score: number | undefined, show: boolean) =>
  show
    ? `<td colspan="6"><span class="scores">${[1, 2, 3, 4, 5]
        .map(n => `<span class="${score === n ? 'circled' : ''}">${n}</span>`)
        .join('')}</span></td>`
    : '<td colspan="6"></td>';

// Rows of the grid for some sub-domains, laid out like the paper tool
const gridTable = (data: ReportData, codes: string[]) => {
  const competencies = data.competencies.filter(competence =>
    codes.includes(competence.code || ''),
  );
  const rows = competencies.map((competence, index) => {
    const previous = competencies[index - 1];
    const domain =
      index === 0 || previous.domain_code !== competence.domain_code
        ? `<tr class="domain"><td colspan="8">${escape(
            competence.domain_title,
          )}</td></tr>`
        : '';
    // I and IV are both domain and sub-domain: their title is the domain row
    const single = !(competence.code || '').includes('.');
    const sub =
      single && !competence.has_global_score
        ? ''
        : `<tr class="sub"><td colspan="2">${
            single
              ? ''
              : `${escape(competence.code)}. ${escape(competence.title)}`
          }</td>${scoreCells(
            data.scores[competence.id],
            !!competence.has_global_score,
          )}</tr>`;
    const behaviours = competence.questions
      .map(question => {
        const value = data.answers[question.id];
        const answer =
          value === NOT_APPLICABLE ? 'NA' : getAnswerCode(question, value);
        const allowed = allowedCodes(question);
        return `<tr><td class="c nowrap">${escape(
          question.code,
        )}</td><td>${escape(question.title)}</td>${COLUMNS.map(column =>
          !allowed.includes(column.code)
            ? '<td class="opt na"></td>'
            : answer === column.code
            ? '<td class="opt mark">✕</td>'
            : `<td class="opt">${column.label}</td>`,
        ).join('')}</tr>`;
      })
      .join('');
    return domain + sub + behaviours;
  });
  return `<table class="t grid"><tbody>${rows.join('')}</tbody></table>`;
};

// Observation sheet (B24): header, observed activity, scored grid and global scores,
// document checklist, times, advice and signatures; chronological notes in annex.
export const observationReportHtml = (data: ReportData) => {
  const {session, observer, activities} = data;
  const total = 4;
  const copies = [
    'Intéressé',
    'Établissement',
    'IGE',
    'IPP',
    'Pool',
    'Proved',
    'Gestionnaire',
    'A.T./Bourgm.',
    'S/Proved',
    'Classement',
  ];

  const first = `
    <div class="top">
      <div class="ministry">
        <strong>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</strong>
        <span>Ministère de l'Éducation Nationale</span>
        <span>et Nouvelle Citoyenneté</span>
        <strong>INSPECTION GÉNÉRALE</strong>
      </div>
      <table class="fields"><tbody>
        <tr><td>01. Observateur : ${escape(
          observer.name,
        )}</td><td>Sexe : ${escape(observer.sex)}</td></tr>
        <tr><td colspan="2">02. Niveau / Discipline(s) : Secondaire · ${escape(
          session.subject,
        )}</td></tr>
        <tr><td colspan="2">03. Poste d'attache : ${escape(
          [observer.function, observer.duty_station]
            .filter(Boolean)
            .join(' · '),
        )}</td></tr>
        <tr><td colspan="2">04. B.P. : ${escape(observer.postal_box)}</td></tr>
        <tr><td colspan="2">05. Téléphone : ${escape(
          observer.phone,
        )} · e-mail : ${escape(observer.email)}</td></tr>
        <tr><td colspan="2">06. Établissement : ${escape(
          data.school.name,
        )}</td></tr>
        <tr><td colspan="2">07. Enseignant.e : ${escape(
          data.teacher.name,
        )}</td></tr>
        <tr><td colspan="2">08. Dernière observation : date : ${
          date(session.last_observation_date) || '—'
        } · appr. : ${
    escape(APPRECIATION_LABELS[session.last_observation_rating || '']) || '—'
  }</td></tr>
        <tr><td>09. Charge hebdomadaire : ${escape(
          session.teacher_weekly_load,
        )} h</td><td>10. Année scolaire : ${escape(
    session.school_year,
  )}</td></tr>
      </tbody></table>
      <ul class="copies">${copies.map(copy => `<li>${copy}</li>`).join('')}</ul>
    </div>
    <h2>Outil d'observation des pratiques de classe dans le développement des compétences</h2>
    <table class="t">
      <thead>
        <tr><th colspan="7">Activité(s) observée(s)</th></tr>
        <tr><th>Sous-domaine</th><th>Discipline</th><th>N° fiche / code matrice</th><th>Classe</th><th>P/I</th><th>Heure</th><th>Savoirs essentiels / sujet</th></tr>
      </thead>
      <tbody>${activities
        .map(
          activity =>
            `<tr><td>${escape(activity.sub_domain)}</td><td>${escape(
              activity.discipline,
            )}</td><td>${escape(activity.sheet_code)}</td><td>${escape(
              activity.class_name,
            )}</td><td>${escape(activity.p_i)}</td><td>${escape(
              activity.time,
            )}</td><td>${escape(activity.essential_knowledge)}</td></tr>`,
        )
        .join('')}</tbody>
    </table>
    ${gridTable(data, ['I', 'II.1', 'II.2'])}`;

  const second = gridTable(data, ['III.1', 'III.2', 'IV']);

  const head = data.signatures.SCHOOL_HEAD;
  const observerSignature = data.signatures.OBSERVER;
  const third = `
    <h3>Annexe : documents de l'enseignant.e et de l'apprenant.e</h3>
    <table class="t">
      <thead><tr><th>N°</th><th>Énoncé</th><th>Document</th><th>O</th><th>N</th><th>Proposition</th></tr></thead>
      <tbody>${data.checklist
        .map(item => {
          const entry = data.documentations[item.id];
          const answer =
            entry?.answer === null || entry?.answer === undefined
              ? undefined
              : Number(entry.answer);
          return `<tr><td class="c">${item.code}</td><td class="small">${escape(
            item.statement,
          )}</td><td>${escape(item.document_name)}</td><td class="c">${
            answer === 1 ? '✕' : ''
          }</td><td class="c">${
            answer === 0 ? '✕' : ''
          }</td><td class="small">${escape(entry?.proposal)}</td></tr>`;
        })
        .join('')}</tbody>
    </table>
    <p class="line">Heure du début de la séquence didactique : <strong>${
      escape(session.start_time) || '………'
    }</strong> · Heure de la fin : <strong>${
    escape(session.end_time) || '………'
  }</strong></p>
    <p class="line">Conseils : ${
      escape(session.advice) || '……………………………………………………………………'
    }</p>
    <p class="line">Fait à <strong>${escape(
      session.signed_place,
    )}</strong>, le <strong>${date(
    session.completed_at || new Date(),
  )}</strong></p>
    <div class="signatures">
      ${signatureBox("L'Enseignant.e", data.signatures.TEACHER)}
      ${signatureBox(
        "Le Chef d'établissement",
        // When the observer is the school head, the observer's signature fills both boxes
        session.observer_function === 'SCHOOL_HEAD' ? observerSignature : head,
      )}
      ${signatureBox("L'Observateur.trice", observerSignature)}
    </div>`;

  const start = session.observation_started_at;
  const fourth = `
    <h3>Notes chronologiques de l'observation</h3>
    ${
      data.notes.length === 0
        ? '<p class="line">Aucune note.</p>'
        : `<table class="t"><tbody>${data.notes
            .map(
              note =>
                `<tr><td class="nowrap">${time(note.noted_at)} (+${
                  start
                    ? moment(note.noted_at).diff(moment(start), 'minutes')
                    : 0
                } min)</td><td>${escape(note.content)}</td></tr>`,
            )
            .join('')}</tbody></table>`
    }`;

  return html("Fiche d'observation", [
    page(first, 1, total),
    page(second, 2, total),
    page(third, 3, total),
    page(fourth, 4, total),
  ]);
};

// PDP (B25): the coaching report handed to the teacher at the end of the observation.
export const pdpReportHtml = (data: ReportData) => {
  const {session, pdp} = data;
  const codeOf = (questionId?: string | null) =>
    data.competencies
      .flatMap(competence => competence.questions)
      .find(question => question.id === questionId)?.code;
  const count = (category: string) =>
    pdp?.diagnostic.filter(entry => entry.category === category).length || 0;
  const activity = data.activities[0];

  const content = `
    <div class="ministry center">
      <strong>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</strong>
      <span>Ministère de l'Éducation Nationale et Nouvelle Citoyenneté</span>
    </div>
    <h2>Plan de développement professionnel</h2>
    <p class="subtitle">Rapport de coaching remis à l'enseignant.e à l'issue de l'observation</p>
    <table class="t identity"><tbody>
      <tr><th>Enseignant.e</th><td>${escape(
        data.teacher.name,
      )}</td><th>Établissement</th><td>${escape(data.school.name)}</td></tr>
      <tr><th>Classe / discipline</th><td>${escape(
        [activity?.class_name, activity?.discipline || session.subject]
          .filter(Boolean)
          .join(' · '),
      )}</td><th>Observation du</th><td>${date(
    session.observation_started_at || session.created_at,
  )}</td></tr>
      <tr><th>Observateur.trice</th><td colspan="3">${escape(
        [data.observer.name, data.observer.function]
          .filter(Boolean)
          .join(' · '),
      )}</td></tr>
    </tbody></table>

    <h3>Résultats de l'observation</h3>
    <p class="line">Cotes globales : ${data.competencies
      .filter(competence => competence.has_global_score)
      .map(
        competence =>
          `${escape(competence.code)} ${data.scores[competence.id] ?? '—'}/5`,
      )
      .join(' · ')}</p>
    ${
      pdp
        ? `<p class="line small">Diagnostic (règles PDP version ${escape(
            pdp.ruleSet?.version ?? pdp.pdp.rule_set_version,
          )}) : points forts ${count('STRENGTH')}, axes à consolider ${count(
            'CONSOLIDATE',
          )}, axes prioritaires ${count('PRIORITY')}.</p>`
        : ''
    }
    <h3>Objectifs ${
      pdp?.pdp.validated_at
        ? `· validés avec l'enseignant.e le ${date(pdp.pdp.validated_at)}`
        : '· projet non validé'
    }</h3>
    ${
      pdp
        ? `<table class="t">
        <thead><tr><th>N°</th><th>Comportement</th><th>Objectif</th><th>Actions</th><th>Indicateur</th><th>Échéance</th></tr></thead>
        <tbody>${pdp.objectives
          .map(
            (objective, index) =>
              `<tr><td class="c">${index + 1}</td><td class="c">${
                escape(codeOf(objective.question_id)) || '—'
              }</td><td>${escape(
                objective.objective,
              )}</td><td class="small">${objective.actions
                .split('\n')
                .filter(action => action.trim())
                .map(action => `<div>• ${escape(action)}</div>`)
                .join('')}</td><td class="small">${escape(
                objective.indicator,
              )}</td><td class="nowrap">${
                moment(objective.due_date, 'YYYY-MM-DD').isValid()
                  ? moment(objective.due_date, 'YYYY-MM-DD').format(
                      'DD/MM/YYYY',
                    )
                  : escape(objective.due_date)
              }</td></tr>`,
          )
          .join('')}</tbody></table>`
        : '<p class="line">Le PDP sera établi après la cotation.</p>'
    }
    <div class="signatures">
      ${signatureBox("L'Enseignant.e", data.signatures.TEACHER)}
      ${signatureBox("L'Observateur.trice", data.signatures.OBSERVER)}
    </div>`;

  return html('Plan de développement professionnel', [page(content, 1, 1)]);
};
