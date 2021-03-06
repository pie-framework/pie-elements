import {PromptConfig} from '../../PromptConfig';
import {PieModel} from '../../PieModel';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';

interface CategoryChoice {
  /** Identifier for the choice */
  id: string;

  /** The xhtml content for the choice */
  content: string;

  /** */
  categoryCount?: number | string;

  /** */
  correctResponseCount?: number | string;
}

interface Category {
    /** Identifier for the category */
    id: string;

    /** The label to display with the category. */
    label: string;

    /** The choices presented in this category */
    choices: CategoryChoice[];
}

type AlternateResponse = string[];

interface CategoryCorrectResponse {
  /** The identifier for the category */
  category: string;

  /** Array of identifiers for the choices that belong in this category */
  choices: string[];

  /** Array of alternatives correct choices */
  alternateResponses?: AlternateResponse[];

}

enum ChoicesPosition {
  above = 'above',
  below = 'below',
  left = 'left',
  right = 'right'
}

/**
 * Pie Model Object for @pie-elements/categorize
 * @additionalProperties false
 */
export interface CategorizePie extends PieModel {

  /** The available choices */
  choices: CategoryChoice[];

  /**
   * The number of columns in which to present the categories
   * @default 2
   */
  categoriesPerRow?: number;

  /**
   * Indicates where the choices should be presented in relation to the categories.
   */
  choicesPosition?: ChoicesPosition;

  /** Label to be displayed for the choices */
  choicesLabel?: string;

  /** Should the choices be shuffled or not */
  lockChoiceOrder?: boolean;

  /**  The question prompt or item stem */
  prompt: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /**
   * Indicates if the choice, after it is dragged into a category, should be removed from the choices
   * area or should remain in place.
   */
  removeTilesAfterPlacing?: boolean;

  /** The categories in which choices may be placed */
  categories: Category[];

  /** The defintion of the correct response to the question */
  correctResponse?: CategoryCorrectResponse[];

  /** Feedback configuration */
  feedback?: ComplexFeedbackType;

  /** Indicates the value for rationale */
  rationale?: string;

  /** Indicates if partial scoring is enabled */
  partialScoring?: boolean;

  /** Indicates if Feedback is enabled */
  feedbackEnabled: boolean;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates the note for the answer */
  note?: string;
}

/**
 * Config Object for @pie-elements/categorize
 * @additionalProperties false
 */
export interface CategorizeConfigure extends PromptConfig ,CommonConfigSettings {
  /**
   * Partial Scoring configuration
   */
  partialScoring?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: ConfigureProp;

  /**
   * Scoring Type configuration
   */
  scoringType?: ConfigureProp;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;
}

