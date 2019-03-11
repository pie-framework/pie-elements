import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { ComplexFeedbackType } from '../../ComplexFeedback';

/**
 * One row in the match list.
 */
interface MatchRow {
  /** Identifier for a row */
  id: string | number;
  /** Title that will be displayed for the row */
  title: string;
  /** Array of boolean values indicating which columns are selected in the row */
  values: boolean[];
}

/**
* Model for the @pie-elements/match Interaction
* @additionalProperties false
*/
export interface MatchPie extends PieModel {

  /** The rows of choices to be presented.  */
  rows: MatchRow[];
  
  /** Indicates if the order of the rows should be randomly sorted on render */
  shuffled: boolean;

  /** The number of columns to be presented */
  layout: number;

  /** Array of strings for column headers */
  headers: string[];

  /** Indicates if the conrol for responses should be single (radio) or multiple (checkbox) */
  responseType: 'radio' | 'checkbox';

  /** Indicates if partial scoring should be used */
  partialScoring?: boolean;

  /** Partial scoring label to be displayed */
  partialScoringLabel?: string;

  /** Indicates that the item can use partial scoring */
  allowPartialScoring?: boolean;

  /** Feedback for student responses */
  feedback?: ComplexFeedbackType
}

/**
 * Config Object for @pie-elements/match
 * @additionalProperties false
 */
export interface MatchConfigure extends PromptConfig, CommonConfigSettings {}
