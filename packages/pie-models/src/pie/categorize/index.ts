import {PromptConfig} from '../../PromptConfig';
import {PieModel} from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../ComplexFeedback';

interface CategoryChoice {
  /** Identifier for the choice */
  id: string;

  /** The xhtml content for the choice */
  content: string;
}

interface Category {
    /** Identifier for the category */
    id: string;

    /** The label to display with the category. */
    label: string;

    /** The choices presented in this category */
    choices: CategoryChoice[];
}

interface CategoryCorrectResponse {
  /** The identifier for the category */
  category: string;

  /** Array of identifiers for the choices that belong in this category */
  choices: string[];

}

enum ChoicesPosition {
  above = 'above',
  below = 'below'
}

interface ChoicesConfig {
  /**
   * @default 2
   */
  columns: number;

  /**
   * Indicates where the choices should be presented in relation to the categories.
   */
  position: ChoicesPosition;

  /** Label to be displayed for the choices */
  label: string;

  /** Should the choices be shuffled */
  shuffle: boolean;

  /**
   * Indicates if the choice, after it is dragged into a category, should be removed from the choices
   * area or should remain in place.
   */
  removeafterplacing: boolean;
}

interface PartialScoringCategoryRule {
  /**
   *  Indicates the number of correct answers
   */
  count: number;

  /**
   *  Indicates the percentage for partial scoring
   */
  percent: number;
}


interface PartialScoringRule {
  /**
   * The id of the category
   */
  category: string;

  /**
   * Array of rules for partial scoring for the category
   */
  rules: PartialScoringCategoryRule[];
}

interface PartialScoringConfig {
  /**
   *  Indicates if partial scoring is enabled
   */
  enabled: boolean;

  /**
   * Array of rules for partial scoring
   */
  rules?: [PartialScoringRule]
}

interface WeightingConfigRule {
  /**
   *  The id of the category
   */
  category: string;

  /**
   * The value of weighting
   */
  points: number;
}

interface WeightingConfig {
  /**
   *  Indicates if weighting is enabled
   */
  enabled: boolean;

  /**
   * Array of rules for weighting
   */
  rules?: WeightingConfigRule[]
}

interface ScoringConfig {
  /**
   * The configuration for weighting
   */
  weighting?: WeightingConfig;

  /**
   * The configuration for partial scoring
   */
  partial?: PartialScoringConfig;
}

interface CategoriesConfig {
  /** 
   * The number of columns in which to present the categories
   * @default 2
   */
  columns?: number

   /** 
   * The number of rows in which to present the categories
   * @default 1
   */
  rows?: number
}

/**
 * Pie Model Object for @pie-elements/categorize
 * @additionalProperties false
 */
export interface CategorizePie extends PieModel {

  /** The available choices */
  choices: CategoryChoice[];

  /** The categories in which choices may be placed */
  categories: Category[];
  
  /** The defintion of the correct response to the question */
  correctResponse: CategoryCorrectResponse[];

  /** Configuration options for the presentataion of the interaction */
  config: {choices:ChoicesConfig, categories: CategoriesConfig}

  /** Feedback configuration */
  feedback?: ComplexFeedbackType;

  /** Scoring configuration */
  scoring?: ScoringConfig
}

/**
 * Config Object for @pie-elements/categorize
 * @additionalProperties false
 */
export interface CategorizeConfigure extends PromptConfig ,CommonConfigSettings {



}

