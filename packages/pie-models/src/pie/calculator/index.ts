enum CalculatorMode {
  /** Scientific calculator */
  scientific = 'scientific',
  /** Basic calculator */
  basic = 'basic'
}
/**
 * Model Object for @pie-elements/calculator
 */
export interface CalculatorPie  {
  /** Which calculator mode to show */
  mode: CalculatorMode
}