import {Choice}  from '../../Choice';
import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';

/**
* Model for the @pie-elements/inline-choice Interaction
* @additionalProperties false
*/
export interface InlineChoicePie extends PieModel {
  /** Default language */
  defaultLang?: string;
  
  /** Text to display in the dropdown */
  choiceLabel?: string;

  /** The choice options for the question */
  choices: Choice[];
  
  /**  The question prompt or item stem*/
  prompt?: string;
}


/**
 * Config Object for @pie-elements/inline-choice
 * @additionalProperties false
 */
export interface InlineChoiceConfigure extends PromptConfig, CommonConfigSettings {

}