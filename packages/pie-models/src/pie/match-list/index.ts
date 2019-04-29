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

/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 */

/**
* Model for the @pie-elements/match-list Interaction
* @additionalProperties false
*/
export interface MatchListPie extends PieModel {
  /**  The question prompt or item stem*/
  prompt?: string;

  /** The question prompts that are going to be displayed.  */
  prompts: Prompt[];

  /** The question prompts that are going to be displayed.  */
  answers: Prompt[];

  /** Indicates if answers should be shuffled or not */
  shuffled?: boolean;
}

/**
 * Config Object for @pie-elements/match-list
 * @additionalProperties false
 */
export interface MatchListConfigure extends PromptConfig, CommonConfigSettings {

}
