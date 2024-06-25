import { PieModel } from '../../PieModel';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureMaxImageDimensionsProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
  EditableHtmlPluginConfigureRequired
} from '../ConfigurationProp';

interface Alternate {
  /**
   * The id for the alternative response
   */
  id: number;
  /**
   * The value for the alternative response
   */
  answer: string;
}

interface Alternates {
  [index: number]: Alternate;
}

export interface Response {
  /**
   * Indicates the allowance of trailing zeros in expressions
   * @default is false
   */
  allowTrailingZeros: boolean;
  /**
   * The value for the response's answer
   */
  answer: string;
  /**
   * The id for the response
   */
  id: string;
  /**
   * Indicates what type of validation should be applied on the response
   * @default is literal
   */
  validation: 'literal' | 'symbolic';
  /**
   * Indicates if the order of expression elements in literal validation can be ignore
   * @default is false
   */
  ignoreOrder: boolean;
  /**
   * For validation type = literal, alternates represents
   * an object with some alternatives for the correct answers
   */
  alternates: Alternates;
}

/**
 * Model for the @pie-elements/math-templated
 * @additionalProperties false
 */
export interface MathTemplatedPie extends PieModel {
  /**
   * Indicates markup value
   */
  markup: string;
  /**
   * Indicates prompt value
   */
  prompt: string;
  /**
   * Indicates if Prompt is enabled
   */
  promptEnabled: boolean;
  /**
   * Indicates if Teacher Instructions are enabled
   */
  teacherInstructionsEnabled: boolean;
  /**
   * Indicates rationale value
   */
  rationale: string;
  /**
   * Indicates if Rationale is enabled
   */
  rationaleEnabled: boolean;
  /**
   * Indicates if Spell Check is enabled
   */
  spellCheckEnabled: boolean;
  /**
   * Indicates if Player Spell Check is enabled
   */
  playerSpellCheckEnabled: boolean;
  /**
   * Array of all responses
   */
  responses: Response[];
  /**
   * The html Element tag name
   */
  element: string;
  /**
   * Indicates what type of editor should be displayed for all the possible responses
   * 1 for Grade 1 - 2
   * 3 for Grade 3 - 5
   * 6 for Grade 6 - 7
   * 8 for Grade 8 - HS
   * non-negative-integers
   * integers
   * decimals
   * fractions
   * geometry
   * advanced-algebra
   * statistics
   * @default - item-authoring
   */
  equationEditor:
      | 'geometry'
      | 'advanced-algebra'
      | 'statistics'
      | 'item-authoring'
      | 1
      | 3
      | 6
      | 8
      | 'non-negative-integers'
      | 'integers'
      | 'decimals'
      | 'fractions';
  /**
   * Indicates the default value for ignoreOrder, in case that it's not set
   * @default is false
   */
  ignoreOrderDefault: boolean;
  /**
   * Indicates the default value for allowTrailingZeros, in case that it's not set
   * @default is false
   */
  allowTrailingZerosDefault: boolean;
  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';
  /**
   * Indicates what type of validation should be applied on the response
   * @default is literal
   */
  validationDefault: 'literal' | 'symbolic';
}

/**
 * Config Object for @pie-elements/math-templated-configure
 * @additionalProperties false
 */
export interface MathTemplatedConfigure {
  /**
   * Ignore Order configuration
   */
  ignoreOrder?: ConfigurePropWithEnabled;
  /**
   * Allow Trailing Zeros configuration
   */
  allowTrailingZeros?: ConfigurePropWithEnabled;
  /**
   * Partial Scoring configuration
   */
  partialScoring?: ConfigureProp;
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;
  /**
   * Configuration for the prompt
   */
  prompt?: EditableHtmlPluginConfigureRequired;
  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;
  /**
   * Configuration for edit Source
   */
  editSource?: ConfigureProp;
  /**
   * Configuration for the player's spellcheck
   */
  playerSpellCheck?: ConfigureProp;
  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: EditableHtmlPluginConfigureRequired;
  /**
   * Configuration for Rationale
   */
  rationale?: ConfigureProp;
  /**
   * Template configuration
   */
  template?: EditableHtmlPluginConfigure;
  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;
  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;
  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;
  /**
   * Language configuration
   */
  language?: ConfigurePropWithEnabled;
  /**
   * Language choices configuration
   * Only available if language is enabled
   */
  languageChoices?: {
    label: string;
    options: ConfigureLanguageOptionsProp[];
  };
  /**
   * Maximum number of response areas
   */
  maxResponseAreas?: number;
}