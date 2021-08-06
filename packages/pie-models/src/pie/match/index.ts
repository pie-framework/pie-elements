import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import { ComplexFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';

/**
 * One row in the match list.
 */
export interface MatchRow {
  /** Identifier for a row */
  id: string | number;
  /** Title that will be displayed for the row */
  title: string;
  /** Array of boolean values indicating which columns are selected in the row */
  values: boolean[];
}

/**
 * NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/match Interaction
 * @additionalProperties false
 */
export interface MatchPie extends PieModel {
  /** Indicates if questions can contain images */
  enableImages?: boolean;

  /** Feedback for student responses */
  feedback?: ComplexFeedbackType;

  /** Array of strings for column headers */
  headers: string[];

  /** The number of columns to be presented */
  layout: number;

  /** Indicates if the order of the rows should be randomly sorted on render */
  lockChoiceOrder?: boolean;

  /** Indicates if partial scoring should be used */
  partialScoring?: boolean;

  /** Indicates if the control for responses should be single (radio) or multiple (checkbox) */
  choiceMode?: 'radio' | 'checkbox';

  /**  The question prompt or item stem */
  prompt: string;

  /** Determines if prompt should show */
  promptEnabled?: boolean;

  /** The rows of choices to be presented.  */
  rows: MatchRow[];

  /** Indicates value for rationale */

  rationale: string;

  /** Indicates scoring type */
  scoringType?: 'auto' | 'rubric';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates if Feedback is enabled */
  feedbackEnabled: boolean;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;
}

/**
 * Config Object for @pie-elements/match
 * @additionalProperties false
 */
export interface MatchConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Configuration for enable images
   */
  enableImages?: ConfigureProp;

  /**
   * Configuration for feedback
   */
  feedback?: ConfigureProp;

  /**
   * Configuration for headers
   */
  headers?: ConfigureProp;

  /**
   * Configuration for layout
   */
  layout?: ConfigureProp;

  /**
   * Configuration for lock choice order
   */
  lockChoiceOrder?: ConfigureProp;

  /**
   * Configuration for partial scoring
   */
  partialScoring?: ConfigureProp;

  /**
   * Configuration for choice mode
   */
  choiceMode?: ConfigureProp;

  /**
   * Configuration for the prompt
   */
  prompt?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: ConfigureProp;

  /**
   * Scoring Type configuration
   */
  scoringType?: ConfigureProp;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;
}
