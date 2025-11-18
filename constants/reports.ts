// Report Question Types
export const QUESTION_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  RADIO: 'radio',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  STARS: 'stars',
  DATE: 'date',
  TIME: 'time',
  INFO: 'info',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

// Report Status
export const REPORT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];

