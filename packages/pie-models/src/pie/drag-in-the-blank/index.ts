import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ConfigureProp } from '../ConfigurationProp';

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

enum ChoicesPosition {
  above = 'above',
  below = 'below',
  left = 'left',
  right = 'right'
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

    /** Indicates if duplicates are enabled */
    duplicates?: boolean;

    /** The markup for the pie-ui element */
    markup: string;

    /** The item stem for the question */
    prompt?: string;

    /** Indicates correct answer rationale */
    rationale: string;

    /** Indicates if student instructions are enabled */
    studentInstructions: boolean;

    /** Indicates if teacher instructions are enabled */
    teacherInstructions: boolean;

    /** Indicates value for rubric */
    rubric: string;
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
}
