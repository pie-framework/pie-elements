import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';

/**
 * Multiple question prompts
 */
export interface Prompt {
  /** Identifier for a question prompt */
  id: string | number;
  /** Text that will be displayed in the question prompt row */
  title: string;
  /** Id for the correct answer for this question prompt */
  relatedAnswer: string | number;
}

/**
 * Multiple answers
 */
export interface Answer {
  /** Identifier for an answer row */
  id: string | number;
  /** Text that will be displayed in the answer row */
  title: string;
}

/**
* Model for the @pie-elements/match-list Interaction
* @additionalProperties false
*/
export interface MatchListPie extends PieModel {
  /**  The question prompt or item stem*/
  prompt?: string;

  /** The question prompts that are going to be displayed.  */
  prompts: Prompt[];

  /** The answer rows that are going to be displayed.  */
  answers: Answer[];

  /** Indicates if answers should be locked in order according to the model or if they should be shuffed
   * true - order is respected according to model
   * false - order is shuffled */
  lockChoiceOrder?: boolean;

  /** Indicates if duplicates are allowed */
  duplicates?: boolean;
}

/**
 * Config Object for @pie-elements/match-list
 * @additionalProperties false
 */
export interface MatchListConfigure extends PromptConfig, CommonConfigSettings {

}
