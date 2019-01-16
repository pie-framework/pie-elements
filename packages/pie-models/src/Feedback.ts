/**
 * The type of feedback to use:
 *   `default` = a standard feedback message
 *   `custom` = a customized feedback message
 */
export enum FeedbackType {
  default = 'default',
  custom = 'custom'
}
export interface Feedback {
  type: FeedbackType;
  value: string;
}