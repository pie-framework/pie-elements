import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import {
  ConfigureMathMLProp,
  ConfigureProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
} from '../ConfigurationProp';

/**
 * Model for the RubricPie Interaction
 * @additionalProperties false
 */
export interface RubricPie extends PieModel {
  /** Indicates the score points labels. Starting from 0 to max */
  points?: String[];

  /** Indicates the sample answers labels. Starting from 0 to max */
  sampleAnswers?: String[];

  /** Indicates the max limit for scoring points */
  maxPoints?: number;

  /** Indicates if point 0 should be shown */
  excludeZeros?: boolean;
}

export interface RubriclessPie extends PieModel {
  /** Indicates the max limit for scoring points */
  maxPoints?: number;

  /** Indicates if point 0 should be shown */
  excludeZeros?: boolean;

  /** Indicates that rubricInstruction is enabled*/
  rubriclessInstructionEnabled: boolean;
}

export interface RubricConfigure extends PromptConfig, CommonConfigSettings {
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
   * Ability to exclude zero configuration
   */
  showExcludeZero?: ConfigureProp;

  /**
   * Show max points dropdown configuration
   */
  showMaxPoint?: ConfigureProp;

  /**
   * How large can the rubric be
   */
  width?: string;

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /** Indicates the max limit for scoring points */
  maxMaxPoints?: number;
}

export interface RubriclessConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Ability to exclude zero configuration
   */
  showExcludeZero?: ConfigureProp;

  /**
   * Show max points dropdown configuration
   */
  showMaxPoint?: ConfigureProp;

  /**
   * How large can the rubric be
   */
  width?: string;

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /** Indicates the max limit for scoring points */
  maxMaxPoints?: number;

  /** Indicates that it is rubricless */
  rubricless: true;

  // scoring instruction for rubricless
  rubriclessInstruction: EditableHtmlPluginConfigure;
}
