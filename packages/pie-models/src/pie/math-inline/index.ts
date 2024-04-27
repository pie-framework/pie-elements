import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureMaxImageDimensionsProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

interface Alternate {
  /** The id for the alternative response */
  id: number;

  /** The value for the alternative response */
  answer: string;
}

interface Alternates {
  [index: number]: Alternate;
}

interface MathInlineResponse {
  /** The id of the response */
  id: number | string;

  /**
   * Indicates what type of validation should be applied on the response
   * @default is literal
   */
  validation: 'literal' | 'symbolic';

  /**
   * Indicates if the order of expression elements in literal validation can be ignore - whilst the expression is still mathematically correct
   * @default is false
   */
  ignoreOrder: boolean;

  /**
   * Indicates the allowance of trailing zeros in expressions - whilst the expression is still mathematically correct
   * @default is false
   */
  allowTrailingZeros: boolean;

  /** The answer for the question */
  answer: string;

  /**
   * For validation type = literal, alternates represents
   * an object with some alternatives for the correct answers
   */
  alternates: Alternates;
}

/**
 * NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/math-inline
 * @additionalProperties false
 */
export interface MathInlinePie extends PieModel {
  /** Indicates the mode of the question*/
  responseType?: 'Advanced Multi' | 'Simple';

  /** The item stem for the question */
  prompt?: string;

  /** Determines if prompt should show */
  promptEnabled?: boolean;

  /** Indicates the expression for advanced mode */
  expression: string;

  /** Indicates what type of editor should be displayed for all the possible responses
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
  equationEditor?:
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

  /** Feedback configuration for the responses */
  feedback?: ComplexFeedbackType;

  /** Array of all correct responses; if responseType is Simple, only first element in array is used */
  responses: MathInlineResponse[];

  /**
   * Default correct response
   * if not set, default value will be responses[0]
   */
  defaultResponse?: MathInlineResponse;

  /**
   * Indicates if partial scoring is allowed.
   * This property is not used yet.
   */
  partialScoring?: boolean;

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

  /** Indicates the value for rationale */
  rationale?: string;

  /** Indicates scoring type */
  scoringType?: 'auto' | 'rubric';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Extra buttons defined by user */
  customKeys?: string[];

  /** Indicates if Feedback is enabled */
  feedbackEnabled: boolean;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates the note for the answer */
  note?: string;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';

  /** Indicates if Rubric is enabled */
  rubricEnabled: boolean;

  /** Indicates the language of the component
   * Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX
   */
  language?: string;
}

/**
 * Config Object for @pie-elements/math-inline
 * @additionalProperties false
 */
export interface MathInlineConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Configuration for prompt
   */
  prompt?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for response type
   */
  responseType?: ConfigureProp;

  /**
   * Configuration for partial scoring
   */
  partialScoring?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: EditableHtmlPluginConfigureRequired;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

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
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /**
   * Ignore Order configuration
   */
  ignoreOrder?: ConfigurePropWithEnabled;

  /**
   * Allow Trailing Zeros configuration
   */
  allowTrailingZeros?: ConfigurePropWithEnabled;

  /**
   * Maximum number of response areas
   */
  maxResponseAreas?: number;

  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;

  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;

  /**
   * Rubric configuration - only relevant in environments that use pie-player-components
   */
  withRubric?: ConfigureProp;

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
}
