import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import {Feedback} from '../../Feedback';

interface PartialScoringRule extends PieModel {
    /** Number of correct answers */
    numberOfCorrect: number;

    /** Score percentage for partial scoring */
    scorePercentage: number;
}

interface GraphLine extends PieModel {
    /** Label for the line */
    label: string;

    /** Correct line equation */
    correctLine: string;

    /** Initial view for the line */
    initialView: string;
}

interface GraphLineModelConfig extends PieModel {
    /** The lines that should appear on the graph */
    lines: [GraphLine];

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
}

interface GraphLineModel extends PieModel {
    /** Config for graph line model */
    config: GraphLineModelConfig;
}

/**
 * Model Object for @pie-elements/graph-lines
 * @additionalProperties false
 */
export interface GraphLinesPie extends PieModel {
    /** Feedback for student answer */
    feedback?: Feedback;

    /** Indicates if the graph can have multiple lines */
    multiple?: boolean;

    /** Indicates if partial scoring rules is enabled */
    partialScoring?: boolean;

    /** Indicates partial scoring rules */
    partialScoringRules?: [PartialScoringRule];

    /** Indicates the graph line model */
    model: GraphLineModel;
}

/**
 * Config Object for @pie-elements/graph-lines
 * @additionalProperties false
 */
export interface GraphLinesConfigure extends PromptConfig, CommonConfigSettings {}