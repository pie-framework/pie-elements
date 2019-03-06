import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';

/**
 * Model Object for @pie-elements/function-entry
 * @additionalProperties false
 */
export interface FunctionEntryPie extends PieModel {}

/**
 * Config Object for @pie-elements/extended-text-entry
 * @additionalProperties false
 */
export interface FunctionEntryConfigure extends PromptConfig, CommonConfigSettings {


}