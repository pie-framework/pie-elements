import { PieModel } from '../../PieModel';
import { RubricPie } from '../rubric';
import { MultiTraitRubricConfigure, MultiTraitRubricPie } from '../multi-trait-rubric';

enum RubricType {
  SimpleRubric = 'simpleRubric',
  MultiTraitRubric = 'multiTraitRubric',
}

interface RubricModels {
  /** Contains the simple rubric model. */
  [RubricType.SimpleRubric]: RubricPie;
  /** Contains the multi trait rubric model. */
  [RubricType.MultiTraitRubric]: MultiTraitRubricPie;
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
  /** Contains the multi trait rubric configuration. */
  [RubricType.MultiTraitRubric]: MultiTraitRubricConfigure;
}
