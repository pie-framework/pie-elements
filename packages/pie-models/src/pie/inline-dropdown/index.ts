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

export interface Choices {
  [index: number]: Choice[];
}

export interface AlternateResponses {
  [index: number]: string[];
}

/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/inline-dropdown
 * @additionalProperties false
 */
export interface InlineDropdownPie extends PieModel {
    /**
     * * Object with all the available choices for each response area.
     * * Keys need to be integers from 0 to n - 1 (where n is the number of areas)
     */
    choices: Choices;

    /** Object that contains values that are right as well, besides the main one */
    alternateResponses: AlternateResponses;

    /** The markup for the pie-ui element */
    markup: string;

    /** The item stem for the question */
    prompt?: string;

    /** Indicates if the user can lock the order of the choices */
    lockChoiceOrder: boolean;

    /** Indicates if partialScoring is enabled */
    partialScoring: boolean;

    /** Indicates correct answer rationale */
    rationale: string;

    /** Indicates scoring type */
    scoringType: 'auto' | 'rubric';

    /** Indicates student instructions */
    studentInstructions?: string;

    /** Indicates teacher instructions */
    teacherInstructions?: string;
}

/**
 * Config Object for @pie-elements/inline-dropdown
 * @additionalProperties false
 */
export interface InlineDropdownConfigure extends PromptConfig, CommonConfigSettings {

    /**
     * Choices configuration
     */
    choices?: ConfigureProp;

    /**
     * Item Stem configuration
     */
    prompt?: ConfigureProp;

    /**
     * Lock Choice Order configuration
     */
    lockChoiceOrder?: ConfigureProp;

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
