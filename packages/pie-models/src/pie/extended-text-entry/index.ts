import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { DefaultFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';


/**
 * NOTE: teacherInstructions, studentInstructions, equationEditor & multipleParts
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 * NOTE2: mathInput does not have a functionality as well
 */

/**
* Model for the @pie-elements/extended-text-entry Interaction
* @additionalProperties false
*/
export interface ExtendedTextEntryPie extends PieModel {
  /** Indicates if equation editor is enabled */
  equationEditor: boolean;

  /** Feedback configuration */
  feedback?: DefaultFeedbackType;

  /**
   * Height the editor should take. USE CSS-style definition.
   * @TJS-examples ["500px", "100%"]
   */
  height?: string;

  /**
   * Whether a control to allow insertion of math forumulas should be displayed
   * @default false
   */
  mathInput: boolean;

  /** Indicates if multiple parts are enabled */
  multiple: boolean;

  /** The question prompt */
  prompt?: string;

  /** Indicates if student instructions are enabled */
  studentInstructions: boolean;

  /** Indicates if teacher instructions are enabled */
  teacherInstructions: boolean;

  /**
   * Width the editor should take. USE CSS-style definition.
   * @TJS-examples ["500px", "100%"]
   */
  width?: string;
}

/**
 * Config Object for @pie-elements/extended-text-entry
 * @additionalProperties false
 */
export interface ExtendedTextEntryConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Equation Editor configuration
   */
  equationEditor?: ConfigureProp;

  /**
   * Height configuration
   */
  height?: ConfigureProp;

  /**
   * Math Input configuration
   */
  mathInput?: ConfigureProp;

  /**
   * Multiple Parts configuration
   */
  multiple?: ConfigureProp;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;

  /**
   * Width configuration
   */
  width?: ConfigureProp;

}