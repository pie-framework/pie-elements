import { PieModel } from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
  ConfigurePropWithEnabled,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

interface CategoryChoice {
  /** Identifier for the choice */
  id: string;

  /** The xhtml content for the choice */
  content: string;

  /** */
  categoryCount?: number | string;

  /** */
  correctResponseCount?: number | string;
}

interface Category {
  /** Identifier for the category */
  id: string;

  /** The label to display with the category. */
  label: string;

  /** The choices presented in this category */
  choices: CategoryChoice[];
}

type AlternateResponse = string[];

interface CategoryCorrectResponse {
  /** The identifier for the category */
  category: string;

  /** Array of identifiers for the choices that belong in this category */
  choices: string[];

  /** Array of alternatives correct choices */
  alternateResponses?: AlternateResponse[];
}

enum ChoicesPosition {
  above = 'above',
  below = 'below',
  left = 'left',
  right = 'right',
}

/**
 * Pie Model Object for @pie-elements/categorize
 * @additionalProperties false
 */
export interface CategorizePie extends PieModel {
  /** Indicates if author has the possibility to set maxChoicesPerCategory */
  allowMaxChoicesPerCategory: boolean;

  /** The available choices */
  choices: CategoryChoice[];

  /**
   * The number of columns in which to present the categories
   * @default 2
   */
  categoriesPerRow?: number;

  /**
   * Indicates where the choices should be presented in relation to the categories.
   */
  choicesPosition?: ChoicesPosition;

  /** Label to be displayed for the choices */
  choicesLabel?: string;

  /** Should the choices be shuffled or not */
  lockChoiceOrder?: boolean;

  /**  The question prompt or item stem */
  prompt: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** The categories in which choices may be placed */
  categories: Category[];

  /** The defintion of the correct response to the question */
  correctResponse?: CategoryCorrectResponse[];

  /** Feedback configuration */
  feedback?: ComplexFeedbackType;

  /** Indicates the maximum number of choices from a category */
  maxChoicesPerCategory: number;

  /** Indicates the value for rationale */
  rationale?: string;

  /** Indicates if partial scoring is enabled */
  partialScoring?: boolean;

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

  /**
   * Maximum number of choices
   */
  maxAnswerChoices?: number;

  /**
   * Indicates font size adjustment factor
   */
  fontSizeFactor?: number;

  /**
   * Indicates if the audio for the prompt should autoplay
   */
  autoplayAudioEnabled?: boolean;

  /**
   * Indicates if the audio should reach the end before the item can be marked as 'complete'
   */
  completeAudioEnabled?: boolean;

  /**
   * Indicates if the audio should be replaced with a custom audio button
   *  playImage: image url for the play state
   *  pauseImage: image url for the pause state
   */
  customAudioButton?: {
    playImage: string;
    pauseImage: string;
  };
}

interface ConfigureMaxImageDimensionsProp {
  /** Indicates the max dimension for images in teacher instructions */
  teacherInstructions?: number;

  /** Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified */
  prompt?: number;

  /** Indicates the max dimension for images in rationale */
  rationale?: number;

  /** Indicates the max dimension for images in choices */
  choices?: number;

  /** Indicates the max dimension for images in row labels */
  rowLabel?: number;

  /** Indicates the max dimension for images in category labels */
  categoryLabel?: number;
}

/**
 * Config Object for @pie-elements/categorize
 * @additionalProperties false
 */
export interface CategorizeConfigure extends CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Partial Scoring configuration
   */
  partialScoring?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Scoring Type configuration
   */
  scoringType?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the prompt
   */
  prompt?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the headers
   */
  headers?: EditableHtmlPluginConfigure;

  /**
   * Configuration for the row labels
   */
  rowLabels?: EditableHtmlPluginConfigure;

  /**
   * Minimum number of choices
   */
  minChoices?: number;

  /**
   * Maximum number of choices
   */
  maxChoices?: number;

  /**
   * Position of the choices
   */
  choicesPosition?: ConfigureProp;

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /**
   * Maximum number of categories
   */
  maxCategories?: number;

  /**
   *  Minimum value of categories per row
   */
  minCategoriesPerRow?: number;

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
   * Configuration for maximum number of choices
   */
  allowMaxAnswerChoices?: ConfigureProp
}
