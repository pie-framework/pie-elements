import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import { DefaultFeedbackType } from '../../Feedback';
import { ConfigureProp, ConfigurePropWithEnabled } from '../ConfigurationProp';

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

  /** Indicates if Feedback is enabled */
  feedbackEnabled: boolean;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if spellcheck is enabled for the player. Default value is true */
  playerSpellCheckEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean /**

   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */;
  toolbarEditorPosition?: 'bottom' | 'top';

  /**
   * Indicates the editor's toolbar position for the player, which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  playersToolbarPosition?: 'bottom' | 'top';
}

/**
 * Config Object for @pie-elements/extended-text-entry
 * @additionalProperties false
 */
export interface ExtendedTextEntryConfigure
  extends PromptConfig,
    CommonConfigSettings {
  /**
   * Equation Editor configuration
   */
  equationEditor?: ConfigureProp;

  /**
   * Math Input configuration
   */
  mathInput?: ConfigureProp;

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
  teacherInstructions?: ConfigureProp;

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
}
