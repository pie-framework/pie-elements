import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';
import { ConfigureProp, ConfigurePropWithEnabled } from '../ConfigurationProp';

export interface Choice {
    /** The id of the choice */
    id: string;

    /** The label of the choice */
    label?: string;

    /** Indicates if choice will be removed after is placed into a placement area
     * @default false
     */
    moveOnDrag?: boolean;

    /**
     * If the entire array of choices can lockChoiceOrder, each choice itself
     * has this property to indicate if it should lockChoiceOrder
     * @default true
     */
    lockChoiceOrder?: boolean;
}

export interface CorrectResponse {
    /** The id of the correct response */
    id: string;

    /** The weight of the correct response
     * Note: weights are not configurable in the existing component so we'll ignore it for now
     */
    weight?: number;
}

export interface AlternateResponse {
    /** Array that contains the alternate response ids */
    alternateResponse: string[];
}

/** NOTE: teacherInstructions, studentInstructions & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/placement-ordering
 * @additionalProperties false
 */
export interface PlacementOrderingPie extends PieModel {
    /** The label for possible choices */
    choiceLabel?: string;

    /** Array of all the available choices */
    choices: Choice[];

    /** Array of the correct responses in the correct order */
    correctResponse?: CorrectResponse[];

    /** Array that contains the correct alternate responses */
    alternateResponses: AlternateResponse[];

    /** Indicates if the choices editor can use images */
    enableImages?: boolean;

    /** Feedback for student answer */
    feedback?: ComplexFeedbackType;

    /** The item stem for the question */
    prompt?: string;

    /** Determines if prompt should show */
    promptEnabled?: boolean;

    /** Indicates if the choices can lockChoiceOrder */
    lockChoiceOrder?: boolean;

    /** If placement type is placement; show ordering indicates if the boxes are numbered */
    numberedGuides?: boolean;

    /** The layout for displaying the choices */
    orientation?: 'vertical' | 'horizontal';

    /** Indicates if partialScoring is enabled */
    partialScoring?: boolean;

    /** Indicates if the items can be replaced with each other or if they can be placed inside other boxes */
    placementArea?: boolean;

    /** Indicates correct answer rationale */
    rationale?: string;

    /** Indicates if each choice will be removed from choices after becoming a target */
    removeTilesAfterPlacing?: boolean;

    /** Indicates scoring type */
    scoringType?: 'auto' | 'rubric';

    /** Indicates student instructions */
    studentInstructions?: string;

    /** The label for answer area if placement area is enabled */
    targetLabel?: string;

    /** Indicates if Feedback is enabled */
    feedbackEnabled: boolean;

    /** Indicates teacher instructions */
    teacherInstructions?: string;

    /** Indicates if Rationale are enabled */
    rationaleEnabled: boolean;

    /** Indicates if Student Instructions are enabled */
    studentInstructionsEnabled: boolean;

    /** Indicates if Teacher Instructions are enabled */
    teacherInstructionsEnabled: boolean;

    /** Indicates if Choice Label is enabled */
    choiceLabelEnabled?: boolean;

    /** Indicates the note for the answer */
    note?: string;

    /**
     * Indicates the editor's toolbar position which can be 'bottom' or 'top'
     * @default: 'bottom'
     */
    toolbarEditorPosition?: 'bottom' | 'top';
}

/**
 * Config Object for @pie-elements/placement-ordering
 * @additionalProperties false
 */
export interface PlacementOrderingConfigure extends PromptConfig, CommonConfigSettings {
    /**
     * Choice Label configuration
     */
    choiceLabel?: ConfigureProp;

    /**
     * Choices configuration
     */
    choices?: ConfigureProp;

    /**
     * Numbered Guides configuration
     */
    enableImages?: ConfigureProp;

    /**
     * Indicates whether feedback is enabled
     */
    feedback?: ConfigureProp;

    /**
     * Item Stem configuration
     */
    prompt?: ConfigureProp;

    /**
     * Lock Choice Order configuration
     */
    lockChoiceOrder?: ConfigureProp;

    /**
     * Numbered Guides configuration
     */
    numberedGuides?: ConfigureProp;

    /**
     * Orientation configuration
     */
    orientation?: ConfigureProp;

    /**
     * Partial Scoring configuration
     */
    partialScoring?: ConfigureProp;

    /**
     * Placement Area configuration
     */
    placementArea?: ConfigureProp;

    /**
     * Rationale configuration
     */
    rationale?: ConfigureProp;

    /**
     * Remove tiles after placing configuration
     */
    removeTilesAfterPlacing?: ConfigureProp;

    /**
     * Scoring Type configuration
     */
    scoringType?: ConfigureProp;

    /**
     * Student Instructions configuration
     */
    studentInstructions?: ConfigureProp;

    /**
     * Target Label configuration
     */
    targetLabel?: ConfigureProp;

    /**
     * Teacher Instructions configuration
     */
    teacherInstructions?: ConfigureProp;
}
