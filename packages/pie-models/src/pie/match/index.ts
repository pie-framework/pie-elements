import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';

/**
* Model for the @pie-elements/match Interaction
*/
export interface MatchPie {
  
  /** The rows of choices to be presented.  */
  rows:[MatchRow];
  
  /** Indicates if the order of the rows should be randomly sorted on render */
  shuffled: boolean;

  /** The number of columns to be presented */
  layout: number;

  /** Array of strings for column headers */
  headers:[string];

  /** Indicates if the conrol for responses should be single (radio) or multiple (checkbox) */
  responseType: ResponseType;
}

/**
 * One row in the match list.
 */
interface MatchRow {
  /** Identifier for a row */
  id: string;
  /** Title that will be displayed for the row */
  title: string;
  /** Array of boolean values indicating which columns are selected in the row */
  values: [boolean];
}

/**
 * 
 */
enum ResponseType {
  radio = 'radio',
  checkbox = 'checkbox'
}

/**
 * Config Object for @pie-elements/match
 */
export interface MatchConfigure extends PromptConfig, CommonConfigSettings {

  
}