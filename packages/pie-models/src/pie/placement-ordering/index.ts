import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../ComplexFeedback';


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

interface ConfigurePlacementOrdering {
    /** Indicates if changing orientation is enabled */
    enableOrientationChange?: boolean;

    /** Indicates if changing shuffle mode is enabled */
    enableShuffleChange?: boolean;

    /** Indicates if changing numbered guide mode is enabled */
    enableNumberedGuideChange?: boolean;

    /** Indicates if changing placement area mode is enabled */
    enablePlacementAreaChange?: boolean;

    /** Indicates if changing prompt is enabled */
    enablePromptChange?: boolean;

    /** Indicates if changing choice label is enabled */
    enableChoiceLabelChange?: boolean;

    /** Indicates if changing the label for the choices is enabled */
    enableChoicesLabelChange?: boolean;

    /** Indicates if changing the remove tiles mode is enabled */
    enableRemoveTiles?: boolean;

    /** Indicates if feedback is enabled */
    enableFeedback?: boolean;


    /** The label for the orientation checkboxes */
    orientationLabel?: string;

    /** The label for the shuffle checkbox */
    shuffleLabel?: string;

    /** The label for the include placement area checkbox */
    includePlacementAreaLabel?: string;

    /** The label for the numbered guides checkbox */
    numberedGuidesLabel?: string;

    /** The label for the prompt input */
    promptLabel?: string;

    /** The label for the choice input */
    choiceLabel?: string;

    /** The label for the individual choice input */
    choicesLabel?: string;

    /** The label for the remove tiles switch */
    removeTilesLabel?: string;
}

/**
* Model for the @pie-elements/placement-ordering
* @additionalProperties false
*/
export interface PlacementOrderingPie extends PieModel {
    /** Th epropmpt for the question */
    prompt: string;

    /** The label for possible choices */
    choiceAreaLabel?: string;

    /** The layout for displaying the choices */
    choiceAreaLayout: 'vertical' | 'horizontal';

    /** The label for answer area if placement area is enabled */
    answerAreaLabel?: string,

    /** Indicates if the choices can shuffle
     * @default false
     */
    shuffle: boolean;

    /** Array of all the available choices */
    choices: Choice[];

    /** Array of the correct responses in the correct order */
    correctResponse: CorrectResponse[];

    /** Indicates if the items can be replaced with each other or if they can be placed inside other boxes */
    placementType?: 'none' | 'placement';

    /** If placement type is placement, show ordering indicates if the boxes are numbered */
    showOrdering: boolean;

    /** The configuration for placement ordering pie */
    configure: ConfigurePlacementOrdering;

    /** Feedback for student answer */
    feedback: ComplexFeedbackType;

    /** Indicates if partialScoring is enabled */
    partialScoring?: boolean;

}

/**
 * Config Object for @pie-elements/placement-ordering
 * @additionalProperties false
 */
export interface PlacementOrderingConfigure extends PromptConfig, CommonConfigSettings {}