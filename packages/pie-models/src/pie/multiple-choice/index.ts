import {Choice}  from '../../Choice';
import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { ConfigureProp } from '../ConfigurationProp';

/**
* Model for the Choice Interaction
* @additionalProperties false
*/
export interface MultipleChoicePie extends PieModel {
  /** Indicates the choices are single or multiple selection */
  choiceMode?: 'checkbox' | 'radio';

  /** What key should be displayed before choices. If undefined no  key will be displayed.  */
  choicePrefix?: 'letters' | 'numbers';
  
  /** The choice options for the question */
  choices: Choice[];

  /**  The question prompt or item stem */
  itemStem?: string;

  /**  Indicates the order of choices should be randomly ordered when presented to user */
  lockChoiceOrder?: boolean;

  /** Indicates that the item should use partial scoring */
  partialScoring: boolean;
}


/**
 * Config Object for @pie-elements/multiple-choice
 * @additionalProperties false
 */
export interface MultipleChoiceConfigure extends PromptConfig {
  /**
   * The number of empty choices to show in config view if no choice model is provided
   * @minimum 1
   * @default 4
   */
  answerChoiceCount?: number;

  /**
   * Configuration for a button that allows an author to add more choices
   */
  addChoiceButton?: ConfigureProp;

  /**
   * Indicates whether the settings panel will allow an author to modify the choice
   * mode (radio / checkboxes) for single or multi-choice questions
   */
  choiceMode: ConfigureProp;

  /**
   * Indicates whether the settings panel will allow the author to chose prefixes to be prepended to
   * choices, the author may choose `letters`, `numbers` or `none`
   */
  choicePrefix: ConfigureProp;

  /**
   * Allow choices to be deleted by author
   * @default true
   */
  deleteChoice?: ConfigureProp;

  /**
   * Show fields that allow author to edit content / messages that student role user would see if item
   * is in evaluate mode
   */
  feedback?: ConfigureProp;

  /**
   * Configuration for item stem
   */
  itemStem?: ConfigureProp;

  /**
   * Indicates whether the settings panel will allow author to control choice shuffling
   */
  lockChoiceOrder: ConfigureProp;

  /**
   * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
   */
  partialScoring: ConfigureProp;
}
