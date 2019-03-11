/**
 * The type of feedback to use:
 *   `default` = a standard feedback message
 *   `custom` = a customized feedback message
 */

export interface Feedback {
  /** @default default */
  type: 'default' | 'custom' | 'none';

  /** Value for feedback */
  value?: string;

  /** Custom value for feedback */
  custom?: string;

  /** Default value for feedback */
  default?: string;
}