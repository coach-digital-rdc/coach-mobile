import {Answer} from '../types/answer';
import {Question} from '../types/question';

// Value kept in the observation form when the observer chooses "N/A".
// It is saved as an empty value with not_applicable = 1.
export const NOT_APPLICABLE = -1;

// Answer types of the DRC grid (annex B); "option" is the star rating of the other grids.
export const isChoiceQuestion = (question: Question) =>
  question.type === 'YES_NO' || question.type === 'FME';

export const getAnswerChoices = (
  question: Question,
): {value: number; label: string}[] => {
  const choices =
    question.type === 'YES_NO'
      ? [
          {value: 1, label: 'answer.yes'},
          {value: 0, label: 'answer.no'},
        ]
      : [
          {value: 1, label: 'answer.low'},
          {value: 2, label: 'answer.medium'},
          {value: 3, label: 'answer.high'},
        ];

  return question.allow_na
    ? [...choices, {value: NOT_APPLICABLE, label: 'answer.na'}]
    : choices;
};

export const getAnswerLabel = (question: Question, value?: number | null) =>
  getAnswerChoices(question).find(choice => choice.value === value)?.label;

// Answers of the form ({question_id: value}) as rows of the answer table
export const toAnswers = (answers: {
  [questionId: string]: number;
}): Partial<Answer>[] =>
  Object.keys(answers).map(question_id =>
    answers[question_id] === NOT_APPLICABLE
      ? {question_id, value: null, not_applicable: 1}
      : ({question_id, value: answers[question_id]} as any),
  );
