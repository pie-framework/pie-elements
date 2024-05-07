import { PieModel } from '../../PieModel';
import { RubricConfigure, RubriclessConfigure, RubricPie, RubriclessPie } from '../rubric';
import { MultiTraitRubricConfigure, MultiTraitRubricPie } from '../multi-trait-rubric';

enum RubricType {
  SimpleRubric = 'simpleRubric',
  MultiTraitRubric = 'multiTraitRubric',
  Rubricless = 'rubricless',
}

interface RubricModels {
  /** Contains the simple rubric model. */
  [RubricType.SimpleRubric]: RubricPie;
  /** Contains the multi trait rubric model. */
  [RubricType.MultiTraitRubric]: MultiTraitRubricPie;

  /** Contains the rubricless model. */
  [RubricType.Rubricless]: RubriclessPie;
}

/**
 * Model for the ComplexRubricPie Interaction
 * @additionalProperties false
 */
export interface ComplexRubricPie extends PieModel {
  /** Indicates the type of the rubric
   * Can be of 'simpleRubric' or  'multiTraitRubric'
   * */
  rubricType: RubricType;

  /** Contains the model for each item type. */
  rubrics: RubricModels;
}

export interface ComplexRubricConfigure {
  /**
   * How large should complex-rubric be
   */
  width?: string;

  /**
   * Contains the available rubric types
   */
  rubricOptions?: Array<string>;

  /** Contains the simple rubric configuration. */
  [RubricType.SimpleRubric]: RubricConfigure;

  /** Contains the multi trait rubric configuration. */
  [RubricType.MultiTraitRubric]: MultiTraitRubricConfigure;

  /** Contains the rubricless configuration. */
  [RubricType.Rubricless]: RubriclessConfigure;
}
