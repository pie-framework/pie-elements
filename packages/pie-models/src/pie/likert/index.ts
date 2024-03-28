import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { ConfigureProp, EditableHtmlConfigureProp, EditableHtmlPluginConfigure } from '../ConfigurationProp';
import { LikertChoice } from '../../LikertChoice';
import { CommonConfigSettings } from '../../CommonConfigSettings';

/**
 * NOTE: teacherInstruction functionality is not defined yet - the value for
 * those can belong to model or to configuration (to be moved when the
 * functionality is defined)
 */

/**
 * Model for the Likert Interaction
 * @additionalProperties false
 */
export interface LikertPie extends PieModel {
  /** Indicates the likert scale */
  likertScale?: 'likert3' | 'likert5' | 'likert7';
  /** Indicates the likert type */
  likertType?: 'agreement' | 'frequency' | 'yesNo' | 'importance' | 'likelihood' | 'like';
  /** Indicates the likert type */
  likertOrientation?: 'horizontal' | 'vertical';
  /** The choice options for the question */
  choices: LikertChoice[];
  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;
  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;
}

/**
 * Config Object for @pie-elements/likert
 * @additionalProperties false
 */
export interface LikertConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: EditableHtmlPluginConfigure;

  /**
   * Configuration for prompt
   */
  prompt?: EditableHtmlPluginConfigure;

  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Configuration for likert choice
   */
  likertChoice?: EditableHtmlPluginConfigure;
}
