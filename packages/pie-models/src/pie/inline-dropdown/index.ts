import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureMaxImageDimensionsProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

export interface Choice {
  /** The value for the choice */
  value: string;

  /** The label of the choice */
  label: string;

  /** Indicates if choice is correct */
  correct?: boolean;

  /** Rationale for the choice */
  rationale?: string;
}

export interface Choices {
  [index: number]: Choice[];
}

export interface AlternateResponses {
  [index: number]: string[];
}

/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/inline-dropdown
 * @additionalProperties false
 */
export interface InlineDropdownPie extends PieModel {
  /**
   * * Object with all the available choices for each response area.
   * * Keys need to be integers from 0 to n - 1 (where n is the number of areas)
   */
  choices: Choices;

  /** Object that contains values that are right as well, besides the main one */
  alternateResponses: AlternateResponses;

  /** The markup for the pie-ui element */
  markup: string;

  /** The item stem for the question */
  prompt?: string;

  /** Determines if prompt should show */
  promptEnabled?: boolean;

  /** Indicates if the user can lock the order of the choices */
  lockChoiceOrder: boolean;

  /** Indicates if partialScoring is enabled */
  partialScoring: boolean;

  /** Indicates correct answer rationale */
  rationale: string;

  /** Indicates scoring type */
  scoringType: 'auto' | 'rubric';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if Choice Level Rationales are enabled */
  choiceRationaleEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates display type for the container of the pie-ui element */
  displayType: string;

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
 * Config Object for @pie-elements/inline-dropdown
 * @additionalProperties false
 */
export interface InlineDropdownConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Choices configuration
   */
  choices?: ConfigureProp;

  /**
   * Item Stem configuration
   */
  prompt?: EditableHtmlPluginConfigureRequired;

  /**
   * Lock Choice Order configuration
   */
  lockChoiceOrder?: ConfigureProp;

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
   * Choice Level Rationales configuration
   */
  choiceRationale?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

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
   * Template configuration
   */
  template?: EditableHtmlPluginConfigure;

  /**
   * Maximum number of response areas
   */
  maxResponseAreas?: number;

  /**
   * Maximum number of choices per response area
   */
  maxResponseAreaChoices?: number;

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

  /**
   * Configuration for editable-html inside inline-dropdown toolbar
   * */
  responseAreaInputConfiguration?: EditableHtmlConfigureProp;
}
