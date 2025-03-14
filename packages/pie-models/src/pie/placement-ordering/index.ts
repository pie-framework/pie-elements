import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
  ConfigureRequiredProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

export interface Choice {
  /** The id of the choice */
  id: string;

  /** The label of the choice */
  label?: string;
}

export interface CorrectResponse {
  /** The id of the correct response */
  id: string;

  /** The weight of the correct response
   * Note: weights are not configurable in the existing component so we'll ignore it for now
   */
  weight?: number;
}

export interface AlternateResponse {
  /** Array that contains the alternate response ids */
  response: string[];
}

/** NOTE: teacherInstructions, studentInstructions & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/placement-ordering
 * @additionalProperties false
 */
export interface PlacementOrderingPie extends PieModel {
  /** The label for possible choices */
  choiceLabel?: string;

  /** Array of all the available choices */
  choices: Choice[];

  /** Array of the correct responses in the correct order */
  correctResponse?: CorrectResponse[];

  /** Array that contains the correct alternate responses */
  alternateResponses: AlternateResponse[];

  /** Feedback for student answer */
  feedback?: ComplexFeedbackType;

  /** The item stem for the question */
  prompt?: string;

  /** Determines if prompt should show */
  promptEnabled?: boolean;

  /** Indicates if the choices can lockChoiceOrder */
  lockChoiceOrder?: boolean;

  /** If placement type is placement; show ordering indicates if the boxes are numbered */
  numberedGuides?: boolean;

  /** The layout for displaying the choices */
  orientation?: 'vertical' | 'horizontal';

  /** Indicates if partialScoring is enabled */
  partialScoring?: boolean;

  /** Indicates if the items can be replaced with each other or if they can be placed inside other boxes */
  placementArea?: boolean;

  /** Indicates correct answer rationale */
  rationale?: string;

  /** Indicates if each choice will be removed from choices after becoming a target */
  removeTilesAfterPlacing?: boolean;

  /** Indicates scoring type */
  scoringType?: 'auto' | 'rubric';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** The label for answer area if placement area is enabled */
  targetLabel?: string;

  /** Indicates if Feedback is enabled */
  feedbackEnabled: boolean;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates if Choice Label is enabled */
  choiceLabelEnabled?: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

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

interface ConfigureMaxImageDimensionsProp {
  /** Indicates the max dimension for images in teacher instructions */
  teacherInstructions?: number;

  /** Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified */
  prompt?: number;

  /** Indicates the max dimension for images in rationale */
  rationale?: number;

  /** Only available for the width prop: indicates the max width for images in choices and choices labels when placement area is enabled */
  choicesWithPlacementArea?: number;

  /** Only available for the width prop: indicates the max width for images in choices and choices labels when placement area is disabled */
  choicesWithoutPlacementArea?: number;

  /** Only available for the height prop: indicates the max height for images in choices and choices labels */
  choices?: number;
}

/**
 * Config Object for @pie-elements/placement-ordering
 * @additionalProperties false
 */
export interface PlacementOrderingConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Choice Label configuration
   */
  choiceLabel?: EditableHtmlPluginConfigure;

  /**
   * Choices configuration
   */
  choices?: EditableHtmlPluginConfigure;

  /**
   * Indicates whether feedback is enabled
   */
  feedback?: ConfigureProp;

  /**
   * Item Stem configuration
   */
  prompt?: EditableHtmlPluginConfigure;

  /**
   * Lock Choice Order configuration
   */
  lockChoiceOrder?: ConfigureProp;

  /**
   * Numbered Guides configuration
   */
  numberedGuides?: ConfigureProp;

  /**
   * Orientation configuration
   */
  orientation?: ConfigureProp;

  /**
   * Partial Scoring configuration
   */
  partialScoring?: ConfigureProp;

  /**
   * Placement Area configuration
   */
  placementArea?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Remove tiles after placing configuration
   */
  removeTilesAfterPlacing?: ConfigureProp;

  /** Indicates if the settings panel is not available */
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
   * Target Label configuration
   */
  targetLabel?: ConfigureProp;

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
