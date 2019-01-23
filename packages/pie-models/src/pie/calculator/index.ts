import {PieModel} from '../../PieModel';


enum CalculatorMode {
  /** Scientific calculator */
  scientific = 'scientific',
  /** Basic calculator */
  basic = 'basic'
}
/**
 * Model Object for @pie-elements/calculator
 * @additionalProperties false
 */
export interface CalculatorPie extends PieModel {
  /** Which calculator mode to show */
  mode: CalculatorMode
}