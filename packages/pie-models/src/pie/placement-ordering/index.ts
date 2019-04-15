import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';

interface Choice {
    /** The id of the choice */
    id: string;

    /** The label of the choice */
    label?: string;

    /** Indicates if choice will be removed after is placed into a placement area
     * @default false
     */
    moveOnDrag?: boolean;

    /**
     * If the entire array of choices can shuffle, each choice itself
     * has this property to indicate if it should shuffle
     * @default true
     */
    shuffle?: boolean;
}

interface CorrectResponse {
    /** The id of the correct response */
    id: string;

    /** The weight of the correct response
     * Note: weights are not configurable in the existing component so we'll ignore it for now
     */
    weight?: number;
}

/**
* Model for the @pie-elements/placement-ordering
* @additionalProperties false
*/
export interface PlacementOrderingPie extends PieModel {
    /** The prompt for the question */
    itemStem?: string;

    /** The label for possible choices */
    choiceLabel?: string;

    /** The label for answer area if placement area is enabled */
    targetLabel?: string;

    /** Indicates if the items can be replaced with each other or if they can be placed inside other boxes */
    placementArea?: boolean;

    /** If placement type is placement, show ordering indicates if the boxes are numbered */
    numberedGuides: boolean;

    /** The layout for displaying the choices */
    choiceAreaLayout: 'vertical' | 'horizontal';

    /** Indicates if the choices can shuffle
     * @default false
     */
    shuffle: boolean;

    /** Array of all the available choices */
    choices: Choice[];

    /** Array of the correct responses in the correct order */
    correctResponse: CorrectResponse[];

    /** Feedback for student answer */
    feedback: ComplexFeedbackType;

    /** Indicates if partialScoring is enabled */
    partialScoring: boolean;
}

/**
 * Config Object for @pie-elements/placement-ordering
 * @additionalProperties false
 */
export interface PlacementOrderingConfigure extends PromptConfig, CommonConfigSettings {
    /**
     * The label presented above the item stem input
     * @default "Item Stem"
     */
    labelItemStem?: string;

    /**
     * The label presented above the choice label input
     * @default "Choice label"
     */
    labelChoice?: string;

    /**
     * The label presented above the answer label input
     * @default "Answer label"
     */
    labelAnswer?: string;

    /**
     * The label presented in the settings panel for orientation
     * @default "Orientation"
     */
    labelOrientation?: string;

    /**
     * The label presented in the settings panel for shuffle
     * @default "Shuffle Choices"
     */
    labelShuffle?: string;

    /**
     * The label presented in the settings panel for placement area
     * @default "Placement Area"
     */
    labelPlacementArea?: string;

    /**
     * The label presented in the settings panel for numbered guides
     * @default "Numbered Guides"
     */
    labelNumberedGuides?: string;

    /**
     * The label presented in the settings panel for enable images
     * @default "Enable Images"
     */
    labelEnableImages?: string;

    /**
     * The label presented for choices
     * @default "Choices"
     */
    labelChoices?: string;

    /**
     * The label presented in the settings panel for removeTiles
     * @default "Remove tiles after placing"
     */
    labelRemoveTiles?: string;

    /**
     * The label presented in the settings panel for partial scoring
     * @default "Partial Scoring"
     */
    labelPartialScoring?: string;

    /**
     * Indicates whether the settings panel will allow an author to modify the choice label
     *
     * @default true
     */
    settingsChoiceLabel?: boolean;

    /**
     * Indicates whether the settings panel will allow an author to modify the shuffle choices mode
     *
     * @default true
     */
    settingsShuffle?: boolean;

    /**
     * Indicates whether the settings panel will allow an author to modify the
     * placement area mode
     *
     * @default true
     */
    settingsPlacementArea?: boolean;

    /**
     * Indicates whether the settings panel will allow an author to modify the
     * numbered guides mode for placement area
     *
     * @default true
     */
    settingsNumberedGuides?: boolean;

    /**
     * Indicates whether the settings panel will allow an author to add images to choices
     *
     * @default true
     */
    settingsEnableImages?: boolean;

    /**
     * Indicates whether the settings panel will allow an author to modify the
     * remove tile after placing option
     *
     * @default false
     */
    settingsRemoveTileAfterPlacing?: boolean;

    /**
     * Indicates whether the settings panel will allow an author to modify the orientation
     *
     * @default true
     */
    settingsOrientation?: boolean;

    /**
     * Indicates whether the settings panel will allow an author to use partial scoring
     *
     * @default true
     */
    settingsPartialScoring?: boolean;

    /**
     * Indicates whether feedback is enabled
     *
     * @default true
     */
    settingsFeedback?: boolean;


    /**
     * Indicates whether the author can modify the item stem
     *
     * @default true
     */
    editableItemStem?: boolean;

    /**
     * Indicates whether changing choices labels are allowed
     *
     * @default true
     */
    editableChoicesLabel?: boolean;

    /**
     * Indicates whether the changing placement area label will be enabled
     *
     * @default true
     */
    editablePlacementAreaLabel?: boolean;

    /** Indicates if the area to choice label has to be displayed
     * @default true
     */
    editableChoiceLabel?: boolean;

    /** Indicates if using images within choices should be enabled
     * @default false
     */
    imagesEnabled?: boolean;

    /** Indicates if the tiles should be removed after they are placed
     * @default true
     */
    removeTilesAfterPlacing?: boolean;
}