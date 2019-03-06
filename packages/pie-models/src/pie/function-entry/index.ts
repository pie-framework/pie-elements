import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';

enum CalculatorMode {
  /** Scientific calculator */
  scientific = 'scientific',
  /** Basic calculator */
  basic = 'basic'
}
/**
 * Model Object for @pie-elements/function-entry
 * @additionalProperties false
 */
export interface FunctionEntryPie extends PieModel {
  /** Which calculator mode to show */
  mode: CalculatorMode
}

/**
 * Config Object for @pie-elements/extended-text-entry
 * @additionalProperties false
 */
export interface FunctionEntryConfigure extends PromptConfig, CommonConfigSettings {


}