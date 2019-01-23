import {PromptConfig} from '../../PromptConfig';
import {PieModel} from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { Feedback } from '../../Feedback';


enum SelectionMode {
  sentence = 'sentence',
  word = 'word',
  paragraph = 'paragraphs'
}

interface TextToken {
  /** The token text */
  text: string;
  /** The start point in the main text for this token */
  start: number;
  /** The end point in the main text for this token */
  end: number;
  /** Is selected does the token represent a correct response */
  correct: boolean;
}

/**
 * Pie Model Object for @pie-elements/select-text
 * @title  @pie-elements/select-text
 * @name jsdoc -  @pie-elements/select-text
 * @additionalProperties false
 */
export interface SelectTextPie extends PieModel {

  /** The user prompt/item stem */
  prompt: string;

  /** The passage of text from which user may select responses */
  text: string;

  /**
   * Indicates if the parts of text that are choosable, should be highligned when presented to student. 
   * @default false 
   */
  highlightChoices: boolean;

  /** Feedback for student responses */
  feedback: Feedback[];

  /** Indicates if partial scoring should be used */
  partialScoring: boolean;

  /** The maximum number of token selections a user can make when responding */
  maxSelections: number;

  /** The selected mode for tokenizing the text */
  mode: SelectionMode;

  /** The selectable text tokens in the main text content */
  tokens: TextToken[];
}


/**
 * Config Object for @pie-elements/select-text
 * @title  @pie-elements/select-text
 * @name jsdoc -  @pie-elements/select-text
 * @TJS-title this is the title
 * @additionalProperties false
 */
export interface SelectTextConfigure extends PromptConfig ,CommonConfigSettings {



}

