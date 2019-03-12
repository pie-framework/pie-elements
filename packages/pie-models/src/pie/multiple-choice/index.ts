import {Choice}  from '../../Choice';
import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';

/**
* Model for the Choice Interaction
* @additionalProperties false
*/
export interface MultipleChoicePie extends PieModel {
  
  /** The choice options for the question */
  choices: Choice[];
  
  /**  The question prompt or item stem*/
  prompt?: string;
  
  /** What key should be displayed before choices. If undefined no  key will be displayed.  */
  keyMode?: 'letters' | 'numbers';
  
  /** Indicates the choices are single or multiple selection */
  choiceMode?: 'checkbox' | 'radio';

  /**  Indicates the order of choices should be randdomly ordered when presented to user */
  shuffle?: boolean;

  /** Indicates that the item should use partial scoring */
  partialScoring: boolean;

  /** The label for partial scoring */
  partialScoringLabel?: string;
}


/**
 * Config Object for @pie-elements/multiple-choice
 * @additionalProperties false
 */
export interface MultipleChoiceConfigure extends PromptConfig {

  /** 
   * Whether config view will show a button that allows an author to add more choices 
   * @default true
   */
  addChoice?: boolean;

  /** 
   * The label shown on the add choice button 
   * @maxLength 50
   * @default "Add New Choice"
   */
  addChoiceButtonLabel?: string;

  /** 
   * Show fields that allow author to edit content / messages that student role user would see if item 
   * is in evaluate mode
   * @default true
   */
  addFeedBack?: boolean;

  /** 
   * The number of empty choices to show in config view if no choice model is provided 
   * @minimum 1
   * @default 4
   */
  answerChoiceCount?: number;

  /** 
   * Allow choices to be deleted by author 
   * @default true
   */
  deleteChoice?: boolean;

  /**
   * Indicates whether the settings panel will allow an author to modify the choice 
   * mode (radio / checkboxes) for single or multi-choice questions
   * 
   * @default true
   */
  settingsSelectChoiceMode?: boolean;

  /**
   * The label presented above the `settingsSelectChoiceMode` setting
   * @default "Choice Mode"
   */
  settingsSelectChoiceModeLabel?: string;

  /**
   * Indicates whether the settings panel will allow the author to chose prefixes to be prepended to 
   * choices, the author may choose `letters`, `numbers` or `none`
   * @default true
   */
  settingsSelectChoicePrefixes?: boolean;

  /**
   * The label for the `settingsSelectChoicePrefixes` section in the settings panel
   * @default "Choice Prefixes"
   */
  settingsChoicePrefixesLabel?: string;

  /**
   * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
   * @default true
   */
  settingsPartialScoring?:  boolean;

  /**
   * Indicates whether the settings panel will allow author to control choice shuffling
   * @default true
   */
  settingsConfigShuffle?: boolean;
}
