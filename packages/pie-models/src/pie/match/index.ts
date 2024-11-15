import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import { ComplexFeedbackType } from '../../Feedback';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

/**
 * One row in the match list.
 */
export interface MatchRow {
  /** Identifier for a row */
  id: string | number;
  /** Title that will be displayed for the row */
  title: string;
  /** Array of boolean values indicating which columns are selected in the row */
  values: boolean[];
}

/**
 * NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/match Interaction
 * @additionalProperties false
 */
export interface MatchPie extends PieModel {
  /** Feedback for student responses */
  feedback?: ComplexFeedbackType;

  /** Array of strings for column headers */
  headers: string[];

  /** The number of columns to be presented */
  layout: number;

  /** Indicates if the order of the rows should be randomly sorted on render */
  lockChoiceOrder?: boolean;

  /** Indicates if partial scoring should be used */
  partialScoring?: boolean;

  /** Indicates if the control for responses should be single (radio) or multiple (checkbox) */
  choiceMode?: 'radio' | 'checkbox';

  /**  The question prompt or item stem */
  prompt: string;

  /** Determines if prompt should show */
  promptEnabled?: boolean;

  /** The rows of choices to be presented.  */
  rows: MatchRow[];

  /** Indicates value for rationale */

  rationale: string;

  /** Indicates scoring type */
  scoringType?: 'auto' | 'rubric';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

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

interface ConfigureMaxImageDimensionsProp {
  /** Indicates the max dimension for images in teacher instructions */
  teacherInstructions?: number;

  /** Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified */
  prompt?: number;

  /** Indicates the max dimension for images in rationale */
  rationale?: number;

  /** Indicates the max dimension for images in row labels */
  rowTitles?: number;
}

/**
 * Config Object for @pie-elements/match
 * @additionalProperties false
 */
export interface MatchConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Configuration for html input configuration regarding plugins that are enabled/disabled
   * on each question row
   * E.g. audio, video, image
   */
  rows?: EditableHtmlPluginConfigure;

  /**
   * Configuration for feedback
   */
  feedback?: ConfigureProp;

  /**
   * Configuration for headers
   */
  headers?: EditableHtmlPluginConfigure;

  /**
   * Configuration for layout
   */
  layout?: ConfigureProp;

  /**
   * Configuration for lock choice order
   */
  lockChoiceOrder?: ConfigureProp;

  /**
   * Configuration for partial scoring
   */
  partialScoring?: ConfigureProp;

  /**
   * Configuration for choice mode
   */
  choiceMode?: ConfigureProp;

  /**
   * Configuration for the prompt
   */
  prompt?: EditableHtmlPluginConfigureRequired;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: EditableHtmlPluginConfigureRequired;

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

  /**

   * Indicates the minimum number of question rows
   */
  minQuestions?: number;

  /**
   * Indicates the maximum number of question rows
   */
  maxQuestions?: number;

  /**
   * Indicates the maximum length of question rows headings
   */
  maxLengthQuestionsHeading?: number;

  /**
   * Indicates the maximum number of answer columns
   */
  maxAnswers?: number;

  /**
   * Indicates the maximum length of answer columns headings
   */
  maxLengthAnswers?: number;

  /**
   * Indicates the maximum length of first column headings
   */
  maxLengthFirstColumnHeading?: number;

  /**
   * How large (in px) should match be
   */
  width: string;

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
