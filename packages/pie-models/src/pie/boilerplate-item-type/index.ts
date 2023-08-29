import { PromptConfig } from '../../PromptConfig';
import { PieModel } from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import {ConfigureProp} from '../ConfigurationProp';

/**
 * Pie Model Object for @pie-elements/boilerplate-item-type
 * @title  @pie-elements/boilerplate-item-type
 * @name jsdoc -  @pie-elements/boilerplate-item-type
 * @additionalProperties false
 */
export interface BoilerplateItemTypePie extends PieModel {
  /** The user prompt/item stem */
  prompt: string;

  /** Determines if prompt should show */
  promptEnabled?: boolean;
}

/**
 * Config Object for @pie-elements/boilerplate-item-type
 * @title  @pie-elements/boilerplate-item-type
 * @name jsdoc -  @pie-elements/boilerplate-item-type
 * @TJS-title this is the title
 * @additionalProperties false
 */
export interface BoilerplateItemTypeConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Prompt configuration
   */
  prompt?: ConfigureProp;
}
