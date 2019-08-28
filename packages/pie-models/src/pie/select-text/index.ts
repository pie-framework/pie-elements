import {PromptConfig} from '../../PromptConfig';
import {PieModel} from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';

interface TextToken {
  /** The token text */
  text?: string;
  /** The start point in the main text for this token */
  start: number;
  /** The end point in the main text for this token */
  end: number;
  /** Is selected does the token represent a correct response */
  correct?: boolean;
}

/**
 * Pie Model Object for @pie-elements/select-text
 * @title  @pie-elements/select-text
 * @name jsdoc -  @pie-elements/select-text
 * @additionalProperties false
 */
export interface SelectTextPie extends PieModel {
  /** The maximum number of token selections a user can make when responding */
  maxSelections?: number;

  /**
   * The selected mode for tokenizing the text.
   * This is only used in the config UI to present the mode by which text has been tokenized for selection.
   * If importing an item, only set this property it the text tokens are strictly parsed by of these methods.
   */
  mode?: 'sentence' | 'word' | 'paragraph';

  /** Indicates if partial scoring should be used */
  partialScoring?: boolean;

  /** Feedback for student responses */
  feedback?: ComplexFeedbackType;

  /** The selectable text tokens in the main text content */
  tokens: TextToken[];

  /** The passage of text from which user may select responses */
  text: string;

  /** The user prompt/item stem */
  prompt: string;

  /**
   * Indicates if the parts of text that are choosable, should be highligned when presented to student.
   * @default false
   */
  highlightChoices?: boolean;

  /** Indicates rationale for correct answer */
  rationale?: string;

  /** Indicates scoring type */
  scoringType?: 'auto' | 'rubric';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;
}


/**
 * Config Object for @pie-elements/select-text
 * @title  @pie-elements/select-text
 * @name jsdoc -  @pie-elements/select-text
 * @TJS-title this is the title
 * @additionalProperties false
 */
export interface SelectTextConfigure extends PromptConfig ,CommonConfigSettings {
  /**
   * Selection Count configuration
   */
  selectionCount?: ConfigureProp;

  /**
   * Selections configuration
   */
  selections?: ConfigureProp;


  /**
   * Mode configuration
   */
  mode?: ConfigureProp;

  /**
   * Partial Scoring configuration
   */
  partialScoring?: ConfigureProp;

  /**
   * Feedback configuration
   */
  feedback?: ConfigureProp;

  /**
   * Tokens configuration
   */
  tokens?: ConfigureProp;

  /**
   * Text Content configuration
   */
  text?: ConfigureProp;

  /**
   * Prompt configuration
   */
  prompt?: ConfigureProp;

  /**
   * Highlight Choices configuration
   */
  highlightChoices?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: ConfigureProp;

  /**
   * Scoring Type configuration
   */
  scoringType?: ConfigureProp;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;
}

