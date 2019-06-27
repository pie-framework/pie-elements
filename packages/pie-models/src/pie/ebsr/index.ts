import {PieModel} from '../../PieModel';
import {ConfigureProp} from '../ConfigurationProp';
import {PromptConfig} from '../../PromptConfig';

export interface Choice {
    /** The value for the choice */
    value: string;

    /** The label of the choice */
    label: string;

    /** Indicates if choice is correct */
    correct?: boolean;
}

export interface Part {
    /** Indicates the choices are single or multiple selection */
    choiceMode: 'checkbox' | 'radio';
    /** Array of all the available choices */
    choices: Choice[];

    /** What key should be displayed before choices.  */
    choicePrefix: 'letters' | 'numbers';

    /** Indicates if partial scoring should be used */
    partialScoring?: boolean;

    /**  The question prompt or item stem */
    prompt: string;

    /** Indicates scoring type */
    scoringType?: 'auto' | 'rubric';

    /** Indicates if student instructions are enabled */
    studentInstructions?: boolean;

    /** Indicates if teacher instructions are enabled */
    teacherInstructions?: boolean;
}

/** NOTE: teacherInstructions, studentInstructions, rationale & rubric
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the EBSR Interaction
 * @additionalProperties false
 */
export interface EbsrPie extends PieModel {
    /** First part of EBSR */
    partA: Part;

    /** Second part of EBSR */
    partB: Part;
}

/**
 * Config Object for @pie-elements/ebsr
 * @additionalProperties false
 */
export interface EbsrConfigure extends PromptConfig {
    /**
     * Indicates whether the settings panel will allow an author to modify the choice
     * mode (radio / checkboxes) for single or multi-choice questions
     */
    choiceMode?: ConfigureProp;

    /**
     * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
     */
    partialScoring?: ConfigureProp;

    /**
     * Part labels
     */
    partLabels?: ConfigureProp;

    /**
     * Rationale configuration
     */
    rationale?: ConfigureProp;

    /**
     * Indicates whether the choice labels have a sequential order
     */
    sequentialChoiceLabels?: ConfigureProp;

    /**
     * Student Instructions configuration
     */
    studentInstructions?: ConfigureProp;

    /**
     * Teacher Instructions configuration
     */
    teacherInstructions?: ConfigureProp;
}
