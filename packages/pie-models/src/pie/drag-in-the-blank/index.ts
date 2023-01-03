import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ConfigureMaxImageDimensionsProp, ConfigureProp } from '../ConfigurationProp';

export interface Choice {
  /** The value for the choice */
  value: string;

  /** The label of the choice */
  label: string;

  /** Indicates if choice is correct */
  correct?: boolean;
}

export interface CorrectResponse {
  [index: number]: string;
}

type AlternateResponse = string[];

enum ChoicesPosition {
  above = 'above',
  below = 'below',
  left = 'left',
  right = 'right',
}

/** NOTE: teacherInstructions, studentInstructions, rationale & rubric
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/drag-in-the-blank
 * @additionalProperties false
 */
export interface DragInTheBlankPie extends PieModel {
  /** Array of all the available choices */
  choices: Choice[];

  /**
   * Indicates where the choices should be presented in relation to the categories.
   */
  choicesPosition?: ChoicesPosition;

  /** Object containing the correct answer for each response area */
  correctResponse: CorrectResponse;

  /** Array of alternatives correct choices */
  alternateResponses?: AlternateResponse[];

  /** Indicates if duplicates are enabled */
  duplicates?: boolean;

  /** The markup for the pie-ui element */
  markup: string;

  /** Indicates if the choices are presented in a fixed order */
  lockChoiceOrder: boolean;

  /** The item stem for the question */
  prompt?: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** Indicates correct answer rationale */
  rationale: string;

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates value for rubric */
  rubric: string;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';

  /** Indicates if Rubric is enabled */
  rubricEnabled: boolean;
}

/**
 * Config Object for @pie-elements/drag-in-the-blank
 * @additionalProperties false
 */
export interface DragInTheBlankConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Choices configuration
   */
  choices?: ConfigureProp;

  /**
   * Duplicates configuration
   */
  duplicates?: ConfigureProp;

  /**
   * Item Stem configuration
   */
  prompt?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: ConfigureProp;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;

  /** Rubric configuration */
  rubric?: ConfigureProp;

  /**
   * Minimum number of choices
   */
  minChoices?: number;

  /**
   * Maximum number of choices
   */
  maxChoices?: number;

  /**
   * Maximum number of response areas
   */
  maxResponseAreas?: number;

  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;

  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;

  /**
   * Rubric configuration
   */
  withRubric?: ConfigureProp;
}
