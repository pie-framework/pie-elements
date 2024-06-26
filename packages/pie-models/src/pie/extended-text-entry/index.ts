import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import { DefaultFeedbackType } from '../../Feedback';
import {
  ConfigureProp,
  ConfigurePropWithEnabled,
  ConfigureMaxImageDimensionsProp,
  ConfigureWithForceProp,
  ConfigureMathMLProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

interface Dimensions {
  /**
   * Width the editor should take. USE CSS-style definition.
   * @TJS-examples ["500px", "100%"]
   */
  width?: string;

  /**
   * Height the editor should take. USE CSS-style definition.
   * @TJS-examples ["500px", "100%"]
   */
  height?: string;
}

interface PredefinedAnnotation {
  /**
   * Indicates the value displayed in the annotation button
   */
  label: string;

  /**
   * Indicates the annotation value
   */
  text: string;

  /**
   * Indicates the type of the annotation
   */
  type: 'positive' | 'negative';
}

/**
 * NOTE: studentInstructions & multipleParts
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/extended-text-entry Interaction
 * @additionalProperties false
 */
export interface ExtendedTextEntryPie extends PieModel {
  /**
   * Dimensions the editor should take
   */
  dimensions: Dimensions;

  /** Indicates if equation editor is enabled */
  equationEditor?:
    | 'miscellaneous'
    | 'statistics'
    | 'advanced-algebra'
    | 'geometry'
    | 'Grade 8 - HS'
    | 'Grade 6 - 7'
    | 'Grade 3 - 5'
    | 'Grade 1 - 2';

  /** Feedback configuration */
  feedback?: DefaultFeedbackType;

  /**
   * Whether a control to allow insertion of math forumulas should be displayed
   * @default false
   */
  mathInput?: boolean;

  /**
   * Whether a control to allow insertion of spanish characters should be displayed
   * @default false
   */
  spanishInput?: boolean;

  /**
   * Whether a control to allow insertion of special characters should be displayed
   * @default false
   */
  specialInput?: boolean;

  /** Indicates if multiple parts are enabled */
  multiple?: boolean;

  /** The question prompt */
  prompt?: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /**  Indicates if the annotations are enabled */
  annotationsEnabled?: boolean;

  /** Indicates if Feedback is enabled */
  feedbackEnabled: boolean;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if spellcheck is disabled for the player. Default value is true */
  playerSpellCheckDisabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean /**

   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */;
  toolbarEditorPosition?: 'bottom' | 'top';

  /** Indicates the predefined annotations for the annotation menu*/
  predefinedAnnotations?: Array<PredefinedAnnotation>;

  /**
   * Indicates the editor's toolbar position for the player, which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  playersToolbarPosition?: 'bottom' | 'top';

  /** Indicates if Rubric is enabled */
  rubricEnabled: boolean;
}

/**
 * Config Object for @pie-elements/extended-text-entry
 * @additionalProperties false
 */
export interface ExtendedTextEntryConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Annotations configuration
   */
  annotations?: ConfigureProp;

  /**
   * Equation Editor configuration
   */
  equationEditor?: ConfigureProp;

  /**
   * Math Input configuration
   */
  mathInput?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Spanish Input configuration
   */
  spanishInput?: ConfigureProp;

  /**
   * Special Input configuration
   */
  specialInput?: ConfigureProp;

  /**
   * Multiple Parts configuration
   */
  multiple?: ConfigurePropWithEnabled;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /**
   * Prompt configuration
   */
  prompt?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Configuration for the player's spellcheck
   */
  playerSpellCheck?: ConfigureProp;

  /**
   * Dimensions configuration
   */
  dimensions?: ConfigureProp;

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
  withRubric?: ConfigureWithForceProp;

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;
}
