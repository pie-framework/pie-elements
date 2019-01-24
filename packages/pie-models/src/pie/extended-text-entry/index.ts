import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { Feedback } from '../../Feedback';

/**
* Model for the @pie-elements/extended-text-entry Interaction
* @additionalProperties false
*/
export interface ExtendedTextEntryPie extends PieModel {

  /** Feedback configuration */
  feedback?: Feedback;

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

  /**
   * Should the editor be disabled?
   * @default false
   */
  disabled?: boolean;

  /** The question prompt */
  prompt?: string;

  /**
   * Whether a control to allow insertion of math forumulas should be displayed
   * @default false
   */
  showMathInput: boolean;
}




/**
 * Config Object for @pie-elements/extended-text-entry
 * @additionalProperties false
 */
export interface ExtendedTextEntryConfigure extends PromptConfig, CommonConfigSettings {

  
}