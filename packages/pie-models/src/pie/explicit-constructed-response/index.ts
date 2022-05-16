import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ConfigureProp } from '../ConfigurationProp';

export interface Choice {
  /** The value for the choice */
  value: string;

  /** The label of the choice */
  label: string;
}

export interface Choices {
  [index: number]: Choice[];
}

/** NOTE: teacherInstructions, studentInstructions, rationale, rubric & autoScoring
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/explicit-constructed-response
 * @additionalProperties false
 */
export interface ExplicitConstructedResponsePie extends PieModel {
  /**
   * * Object with all the available choices for each response area.
   * * Keys need to be integers from 0 to n - 1 (where n is the number of areas)
   */
  choices: Choices;

  /** The type of display the container of the pie-ui element will be used */
  displayType: string;

  /** The markup for the pie-ui element */
  markup: string;

  /** The item stem for the question */
  prompt?: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if spellcheck is enabled for the player. Default value is true */
  playerSpellCheckEnabled: boolean;

  /** Indicates correct answer rationale */
  rationale: string;

  /** Indicates auto scoring type */
  autoScoring: 'allOrNothing' | 'partial';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates value for rubric */
  rubric: string;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates the note for the answer */
  note?: string;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';

  /** Indicates the maximum length for each response area */
  maxLengthPerChoice?: number[];
}

/**
 * Config Object for @pie-elements/explicit-constructed-response
 * @additionalProperties false
 */
export interface ExplicitConstructedResponseConfigure
  extends PromptConfig,
    CommonConfigSettings {
  /**
   * Choices configuration
   */
  choices?: ConfigureProp;

  /**
   * Item Stem configuration
   */
  prompt?: ConfigureProp;

  /**
   * Rationale configuration
   */
  rationale?: ConfigureProp;

  /**
   * Configuration for the author's spellcheck
   */
   spellCheck?: ConfigureProp;

   /**
    * Configuration for the player's spellcheck
    */
   playerSpellCheck?: ConfigureProp;

  /**
   * Auto Scoring Type configuration
   */
  autoScoring?: ConfigureProp;

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

  /** Alternates Configuration */
  alternates?: ConfigureProp;

  /** Maximum Length Per Choice Configuration */
  maxLengthPerChoice?: ConfigureProp;

  /**
   * Maximum number of response areas
   */
  maxResponseAreas?: number;
}
