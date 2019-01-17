import {PieModel} from '../../PieModel';


enum CalculatorMode {
  /** Scientific calculator */
  scientific = 'scientific',
  /** Basic calculator */
  basic = 'basic'
}
/**
 * Model Object for @pie-elements/calculator
 */
export interface CalculatorPie extends PieModel {
  /** Which calculator mode to show */
  mode: CalculatorMode
}