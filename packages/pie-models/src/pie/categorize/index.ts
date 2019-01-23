import {PromptConfig} from '../../PromptConfig';
import {PieModel} from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';


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

interface CategoriesConfig {
  /** 
   * The number of columns in which to present the categories
   * @default 2
   */
  columns: number
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
}

/**
 * Config Object for @pie-elements/categorize
 * @additionalProperties false
 */
export interface CategorizeConfigure extends PromptConfig ,CommonConfigSettings {



}

