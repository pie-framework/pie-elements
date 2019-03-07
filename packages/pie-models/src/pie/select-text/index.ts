import {PromptConfig} from '../../PromptConfig';
import {PieModel} from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { Feedback } from '../../Feedback';

 /** 
   * The selected mode for tokenizing the text.
   * This is only used in the config UI to present the mode by which text has been tokenized for selection.
   * If importing an item, only set this property it the text tokens are stricly parsed by of these methods.
   */
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

interface SelectTextPieConfigure {
  /**  The question prompt or item stem */
  promptLabel: string,

  /** Indicates if the content can change */
  enableContentChange: boolean,

  /** Content label */
  contentLabel : string,

  /** Indicates if the choices are highlighted  */
  enableHighlightChoices: boolean,

  /** Label for highlight choices checkbox */
  highlightChoicesLabel: string,

  /** Indicates if tokens are changeable */
  enableTokensChange: boolean,

  /** Label for the tokens */
  tokensLabel: string,

  /** Indicates if feedback is enabled */
  enableFeedback: boolean;

  /** Label for Set Correct Answers switch */
  setCorrectAnswersLabel: string,

  /** Indicates if the selected mode of the text tokens is displayed */
  showMode: boolean,

  /** Label to display the selected mode of the text tokens */
  modeLabel: string,

  /** Indicates if the available selections number is displayed */
  showSelections: boolean,

  /** Label to display the number of available selections */
  availableSelectionsLabel: string,

  /** Indicates if the correct answers number is displayed */
  showCorrectAnswersNumber: boolean,

  /** Label to display the number of correct answers*/
  correctAnswersLabel: string,

  /** Indicates if selection count is displayed */
  showSelectionCount: boolean,

  /** Label for selection count */
  selectionCountLabel: string,
}

/**
 * Pie Model Object for @pie-elements/select-text
 * @title  @pie-elements/select-text
 * @name jsdoc -  @pie-elements/select-text
 * @additionalProperties false
 */
export interface SelectTextPie extends PieModel {

  /** The user prompt/item stem */
  prompt?: string;

  /** The passage of text from which user may select responses */
  text: string;

  /**
   * Indicates if the parts of text that are choosable, should be highligned when presented to student. 
   * @default false 
   */
  highlightChoices?: boolean;

  /** Feedback for student responses */
  feedback?: Feedback[];

  /** Indicates if partial scoring should be used */
  partialScoring?: boolean;

  /** Partial scoring label */
  partialScoringLabel?: string;

  /** The maximum number of token selections a user can make when responding */
  maxSelections: number;

  /** The selected mode for text tokens */
  mode?: SelectionMode;

  /** The selectable text tokens in the main text content */
  tokens: TextToken[];

  /** */
  configure: SelectTextPieConfigure;
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

