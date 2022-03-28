import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { ConfigureProp } from '../ConfigurationProp';

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
  labelType?:
    | 'agreement'
    | 'frequency'
    | 'yesNo'
    | 'importance'
    | 'likelihood'
    | 'like';
  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;
  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;
}

/**
 * Config Object for @pie-elements/matrix
 * @additionalProperties false
 */
export interface MatrixConfigure extends PromptConfig {
  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;

  /**
   * Configuration for the author's spellcheck
   */
   spellCheck?: ConfigureProp;
}
