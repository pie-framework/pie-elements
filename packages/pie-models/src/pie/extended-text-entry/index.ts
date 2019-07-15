import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { DefaultFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';


interface Dimensions {
  /**
   * Width the editor should take. USE CSS-style definition.
   * @TJS-examples ["500px", "100%"]
   */
  width?: string;

  /**
   * Height the editor should take. USE CSS-style definition.
   * @TJS-examples ["500px", "100%"]
   */
  height?: string;
}

/**
 * NOTE: studentInstructions & multipleParts
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 */

/**
* Model for the @pie-elements/extended-text-entry Interaction
* @additionalProperties false
*/
export interface ExtendedTextEntryPie extends PieModel {
  /**
   * Dimensions the editor should take
   */
  dimensions: Dimensions;

  /** Indicates if equation editor is enabled */
  equationEditor?: 'everything' | 'statistics' | 'advanced-algebra' | 'geometry' | 'Grade 8 - HS' | 'Grade 6 - 7' | 'Grade 3 - 5' | 'Grade 1 - 2';

  /** Feedback configuration */
  feedback?: DefaultFeedbackType;

  /**
   * Whether a control to allow insertion of math forumulas should be displayed
   * @default false
   */
  mathInput?: boolean;

  /** Indicates if multiple parts are enabled */
  multiple?: boolean;

  /** The question prompt */
  prompt?: string;

  /** Indicates if student instructions are enabled */
  studentInstructions?: boolean;

  /** Indicates if teacher instructions are enabled */
  teacherInstructions?: boolean;
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
   * Dimensions configuration
   */
  dimensions?: ConfigureProp;

}