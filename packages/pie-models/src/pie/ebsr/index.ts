import { PieModel } from '../../PieModel';
import {
  ConfigureMathMLProp,
  ConfigureProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';

export interface Choice {
  /** The value for the choice */
  value: string;

  /** The label of the choice */
  label: string;

  /** Indicates if choice is correct */
  correct?: boolean;
}

export interface Part {
  /** Indicates the choices are single or multiple selection */
  choiceMode: 'checkbox' | 'radio';

  /** Array of all the available choices */
  choices: Choice[];

  /** What key should be displayed before choices.  */
  choicePrefix: 'letters' | 'numbers';

  /**  The question prompt or item stem */
  prompt: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

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

  /** Indicates the layout of choices for player
   * @default: true
   */
  verticalMode?: boolean;
}

/** NOTE: teacherInstructions, studentInstructions, rationale & rubric
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the EBSR Interaction
 * @additionalProperties false
 */
export interface EbsrPie extends PieModel {
  /** First part of EBSR */
  partA: Part;

  /** Second part of EBSR */
  partB: Part;

  /** Indicates if part labels should be displayed */
  partLabels: boolean;

  /** Indicates what type should have part labels if they are enabled */
  partLabelType: 'Letters' | 'Numbers';

  /** Indicates if partial scoring should be used */
  partialScoring?: boolean;

  /** Indicates scoring type */
  scoringType?: 'auto' | 'rubric';
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
}

interface PartConfiguration {
  /**
   * Indicates whether the Add Choice Button should be displayed
   */
  addChoiceButton?: ConfigureProp;

  /**
   * Indicates whether the settings panel will allow an author to modify the choice
   * mode (radio / checkboxes) for single or multi-choice questions
   */
  choiceMode?: ConfigureProp;

  /**
   * Indicates whether the Choice Prefix setting should be displayed
   */
  choicePrefix?: ConfigureProp;

  /**
   * Indicates whether the Delete choice option should be displayed
   */
  deleteChoice?: ConfigureProp;

  /**
   * Indicates whether feedback should be displayed
   */
  feedback?: ConfigureProp;

  /**
   * Indicates whether the lock choice order option should be displayed
   */
  lockChoiceOrder?: ConfigureProp;

  /**
   * Prompt configuration
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
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /** Indicates the layout of choices for player
   * @default: 'vertical'
   */
  choicesLayout?: ConfigureProp;

  /** Indicates the number of columns for the grid layout
   * @default: 2
   */
  gridColumns?: ConfigureProp;

  /**
   * Minimum number of answer choices
   */
  minAnswerChoices?: number;

  /**
   * Maximum number of answer choices
   */
  maxAnswerChoices?: number;

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
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Choices configuration
   */
  choices?: EditableHtmlPluginConfigure;
}

/**
 * Config Object for @pie-elements/ebsr
 * @additionalProperties false
 */
export interface EbsrConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Indicates configuration for part A
   */
  partA: PartConfiguration;

  /**
   * Indicates configuration for part B
   */
  partB: PartConfiguration;

  /**
   * Part labels (Configuration for both parts)
   */
  partLabels?: ConfigureProp;

  /**
   * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
   */
  partialScoring?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Indicates whether the Scoring type option should be displayed
   */
  scoringType?: ConfigureProp;
}
