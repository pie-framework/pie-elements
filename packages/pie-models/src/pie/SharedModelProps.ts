import {ComplexFeedbackType} from "../Feedback";

export interface MostCommonPieModelProps {
  /** Feedback configuration */
  feedback?: ComplexFeedbackType;

  /** Indicates if Feedback is enabled */
  feedbackEnabled: boolean;

  /** Indicates the language of the component
   * Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX
   */
  language?: string;

  /** Indicates if partial scoring is enabled */
  partialScoring?: boolean;

  /**  The question prompt or item stem */
  prompt: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** Indicates the value for rationale */
  rationale?: string;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if Rubric is enabled */
  rubricEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';
}

