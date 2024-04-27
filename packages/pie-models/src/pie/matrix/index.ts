import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import {
  ConfigureProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';
import { CommonConfigSettings } from '../../CommonConfigSettings';

/**
 * NOTE: teacherInstruction functionality is not defined yet - the value for
 * those can belong to model or to configuration (to be moved when the
 * functionality is defined)
 */

/**
 * Model for the Matrix Interaction
 * @additionalProperties false
 */
export interface MatrixPie extends PieModel {
  /** Indicates the row labels*/
  rowLabels?: String[];
  /** Indicates the column labels*/
  columnLabels?: String[];
  /** Indicates the matrix values*/
  matrixValue?: Object[];
  /** Indicates the matrix label type */
  labelType?: 'agreement' | 'frequency' | 'yesNo' | 'importance' | 'likelihood' | 'like';
  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;
  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;
}

/**
 * Config Object for @pie-elements/matrix
 * @additionalProperties false
 */
export interface MatrixConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

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
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the prompt
   */
  prompt?: EditableHtmlPluginConfigureRequired;
}
