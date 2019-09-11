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

    /** Indicates student instructions */
    studentInstructions?: string;

    /** Indicates teacher instructions */
    teacherInstructions?: string;
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

    /** Indicates if part labels should be displayed */
    partLabels: boolean;

    /** Indicates what type should have part labels if they are enabled */
    partLabelType: 'Letters' | 'Numbers';
}

interface PartConfiguration {
    /**
     * Indicates whether the Add Choice Button should be displayed
     */
    addChoiceButton?: ConfigureProp;

    /**
     * Indicates whether the settings panel will allow an author to modify the choice
     * mode (radio / checkboxes) for single or multi-choice questions
     */
    choiceMode?: ConfigureProp;

    /**
     * Indicates whether the Choice Prefix setting should be displayed
     */
    choicePrefix?: ConfigureProp;

    /**
     * Indicates whether the Delete choice option should be displayed
     */
    deleteChoice?: ConfigureProp;

    /**
     * Indicates whether feedback should be displayed
     */
    feedback?: ConfigureProp;

    /**
     * Indicates whether the lock choice order option should be displayed
     */
    lockChoiceOrder?: ConfigureProp;

    /**
     * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
     */
    partialScoring?: ConfigureProp;

    /**
     * Indicates whether the Edit prompt input should be displayed
     */
    prompt?: ConfigureProp;

    /**
     * Rationale configuration
     */
    rationale?: ConfigureProp;

    /**
     * Indicates whether the Scoring type option should be displayed
     */
    scoringType?: ConfigureProp;

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

/**
 * Config Object for @pie-elements/ebsr
 * @additionalProperties false
 */
export interface EbsrConfigure extends PromptConfig {
    /**
     * Indicates configuration for part A
     */
    partA: PartConfiguration;

    /**
     * Indicates configuration for part B
     */
    partB: PartConfiguration;

    /**
     * Part labels (Configuration for both parts)
     */
    partLabels?: ConfigureProp;
}
