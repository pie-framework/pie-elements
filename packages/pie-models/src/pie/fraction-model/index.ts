import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
} from '../ConfigurationProp';

/**
 * Model for the @pie-elements/fraction-model
 * @additionalProperties false
 */

interface ResponseObject {
  /** Indicates the response id for bar or pie model */
  id: number;

  /** Indicates the selected response sector for model value */
  value: number;
}

export interface FractionModelPie extends PieModel {
  /** Array of ResponseObject for correct response */
  correctResponse: ResponseObject[];

  /** The title prompt of the item */
  title: string;

  /** The question prompt or item stem */
  question: string;

  /** Indicates if the model type should be Bar or Pie model
   * @default: 'bar'
   */
  modelTypeSelected?: 'bar' | 'pie';

  /** Indicates max no of models to be selected
   * @default: 1
   */
  maxModelSelected?: number;

  /** Indicates parts per model to be selected
   * @default: 5
   */
  partsPerModel?: number;

  /** Indicates if student can configure no of models and parts per model
   * @default: false
   */
  allowedStudentConfig?: boolean;

  /** Determines if graph labels visible or not
   * @default: false
   */
  showGraphLabels?: boolean;

  /** Indicates the language of the component
   * Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX
   */
  language?: string;
}

interface ModelConfig {
  /** Indicates the min value for number model */
  min?: number;

  /** Indicates the max value for number model */
  max?: number;

  /** Indicates the default value for number model */
  default?: number;
}

interface ChoiceConfig {
  /** Indicates the value for model choice */
  value: string;

  /** Indicates the label for model choice */
  label: string;
}

interface FractionModelOptionsConfigure {
  /** Indicates the max number of models for item */
  maxOfModel?: ModelConfig;

  /** Indicates the parts per model for item */
  partsPerModel?: ModelConfig;

  /** Indicates the model types of item */
  modelTypeChoices?: ChoiceConfig[];
}

/**
 * Config Object for @pie-elements/fraction-model
 * @additionalProperties false
 */
export interface FractionModelConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Configuration for html input configuration regarding plugins that are enabled/disabled
   * on item title
   * E.g. audio, video, image
   */
  title?: EditableHtmlPluginConfigure;

  /**
   * Configuration for html input configuration regarding plugins that are enabled/disabled
   * on question stem
   * E.g. audio, video, image
   */
  question?: EditableHtmlPluginConfigure;

  /** Configuration for model options selection like Parts per model, max no. of models etc */
  modelOptions?: FractionModelOptionsConfigure;

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
   * Configuration for feedback
   */
  feedback?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;
}
