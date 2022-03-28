import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { ConfigureProp } from '../ConfigurationProp';
import { LikertChoice } from '../../LikertChoice';

/**
 * NOTE: teacherInstruction functionality is not defined yet - the value for
 * those can belong to model or to configuration (to be moved when the
 * functionality is defined)
 */

/**
 * Model for the Likert Interaction
 * @additionalProperties false
 */
export interface LikertPie extends PieModel {
  /** Indicates the likert scale */
  likertScale?: 'likert3' | 'likert5' | 'likert7';
  /** Indicates the likert type */
  likertType?:
    | 'agreement'
    | 'frequency'
    | 'yesNo'
    | 'importance'
    | 'likelihood'
    | 'like';
  /** Indicates the likert type */
  likertOrientation?: 'horizontal' | 'vertical';
  /** The choice options for the question */
  choices: LikertChoice[];
  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;
  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;
}

/**
 * Config Object for @pie-elements/likert
 * @additionalProperties false
 */
export interface LikertConfigure extends PromptConfig {
  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;

  /**
   * Configuration for the author's spellcheck
   */
   spellCheck?: ConfigureProp;
}
