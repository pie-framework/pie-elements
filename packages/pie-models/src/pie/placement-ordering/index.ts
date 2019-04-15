import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';

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

/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
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
    correctResponse: CorrectResponse[];

    /** Indicates if the choices editor can use images */
    enableImages: ConfigureItem;

    /** Feedback for student answer */
    feedback: ComplexFeedbackType;

    /** The item stem for the question */
    itemStem?: string;

    /** Indicates if the choices can lockChoiceOrder */
    lockChoiceOrder: boolean;

    /** If placement type is placement; show ordering indicates if the boxes are numbered */
    numberedGuides: boolean;

    /** The layout for displaying the choices */
    orientation: 'vertical' | 'horizontal';

    /** Indicates if partialScoring is enabled */
    partialScoring: boolean;

    /** Indicates if the items can be replaced with each other or if they can be placed inside other boxes */
    placementArea?: boolean;

    /** Indicates if rationale is enabled */
    rationale: boolean;

    /** Indicates if each choice will be removed from choices after becoming a target */
    removeTilesAfterPlacing?: boolean;

    /** Indicates scoring type */
    scoringType: 'auto' | 'rubric';

    /** Indicates if student instructions are enabled */
    studentInstructions: boolean;

    /** The label for answer area if placement area is enabled */
    targetLabel?: string;

    /** Indicates if teacher instructions are enabled */
    teacherInstructions: boolean;
}


export interface ConfigureItem {
    /**
     * Indicates if the item has to be displayed
     */
    settings?: boolean;

    /**
     * Indicates the label for the item
     */
    label?: string;

    /**
     * Indicates the value of the item if it affects config-ui (eg.: if item is a switch)
     */
    enabled?: boolean;
}


/**
 * Config Object for @pie-elements/placement-ordering
 * @additionalProperties false
 */
export interface PlacementOrderingConfigure extends PromptConfig, CommonConfigSettings {
    /**
     * Choice Label configuration
     */
    choiceLabel?: ConfigureItem;

    /**
     * Choices configuration
     */
    choices?: ConfigureItem;

    /**
     * Numbered Guides configuration
     */
    enableImages?: ConfigureItem;

    /**
     * Indicates whether feedback is enabled
     */
    feedback?: ConfigureItem;

    /**
     * Item Stem configuration
     */
    itemStem?: ConfigureItem;

    /**
     * Lock Choice Order configuration
     */
    lockChoiceOrder?: ConfigureItem;

    /**
     * Numbered Guides configuration
     */
    numberedGuides?: ConfigureItem;

    /**
     * Orientation configuration
     */
    orientation?: ConfigureItem;

    /**
     * Partial Scoring configuration
     */
    partialScoring?: ConfigureItem;

    /**
     * Placement Area configuration
     */
    placementArea?: ConfigureItem;

    /**
     * Rationale configuration
     */
    rationale?: ConfigureItem;

    /**
     * Remove tiles after placing configuration
     */
    removeTilesAfterPlacing?: ConfigureItem;

    /**
     * Scoring Type configuration
     */
    scoringType?: ConfigureItem;

    /**
     * Student Instructions configuration
     */
    studentInstructions?: ConfigureItem;

    /**
     * Target Label configuration
     */
    targetLabel?: ConfigureItem;

    /**
     * Teacher Instructions configuration
     */
    teacherInstructions?: ConfigureItem;
}
