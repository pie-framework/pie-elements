import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../ComplexFeedback';


interface GraphLineModelConfig {
    /** Indicates the title for the graph */
    graphTitle: string;

    /** Indicated the width for the graph */
    graphWidth: number;

    /** Indicates the height for the graph */
    graphHeight: number;

    /** Indicates the domain label for the graph */
    domainLabel: string;

    /** Indicates the left limit (for the x axis) */
    domainMin: number;

    /** Indicates the right limit (for the x axis) */
    domainMax: number;

    /** Indicates step value (for the x axis) */
    domainStepValue: number;

    /** Indicates snap value (for the x axis) */
    domainSnapValue: number;

    /** Indicates domain label frequency (for the x axis) */
    domainLabelFrequency: number;

    /** Indicates domain graph padding (for the x axis) */
    domainGraphPadding: number;

    /** Indicates the range label for the graph */
    rangeLabel: string;

    /** Indicates the bottom limit (for the y axis) */
    rangeMin: number;

    /** Indicates the top limit (for the y axis) */
    rangeMax: number;

    /** Indicates step value (for the y axis) */
    rangeStepValue: number;

    /** Indicates snap value (for the y axis) */
    rangeSnapValue: number;

    /** Indicates range label frequency (for the y axis) */
    rangeLabelFrequency: number;

    /** Indicates range graph padding (for the y axis) */
    rangeGraphPadding: number;

    /** */
    sigfigs: number;

    /** Indicates if coordinates should be displayed */
    showCoordinates: boolean;

    /** Indicates if point labels should be displayed */
    showPointLabels: boolean;

    /** Indicates if inputs should be displayed */
    showInputs: boolean;

    /** Indicates if axis labels should be displayed */
    showAxisLabels: boolean;

    /** Indicates if feedback should be displayed */
    showFeedback: boolean;

    /** Indicates the maximum number of points that the student can select */
    maxPoints?: number | string;

    /** The array with point labels */
    pointLabels: string[];

    /** Indicates if partial scoring is enabled */
    allowPartialScoring?: boolean;

    /** Indicates if points must match labels at the evaluation time */
    pointsMustMatchLabels?: boolean;

    /** */
    labelsType?: 'present' | string;
}

interface PartialScoringRule {
    /** Number of correct answers */
    numberOfCorrect: number;

    /** The percentage for partial scoring  */
    scorePercentage: number;
}

/**
* Model for the @pie-elements/point-intercept
* @additionalProperties false
*/
export interface PointInterceptPie extends PieModel {
    /** Feedback for student answer */
    feedback: ComplexFeedbackType;

    /** Array of strings (each string having this form: x,y) */
    correctResponse: string[];

    /** The configuration for the model */
    model: {
        config: GraphLineModelConfig;
    }

    /** The array of partial scoring rules */
    partialScoring: PartialScoringRule[];

}

/**
 * Config Object for @pie-elements/point-intercept
 * @additionalProperties false
 */
export interface PointInterceptConfigure extends PromptConfig, CommonConfigSettings {}
