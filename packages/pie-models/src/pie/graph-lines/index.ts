import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { ComplexFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';

interface PartialScoringRule {
    /** Number of correct answers */
    numberOfCorrect: number;

    /** Score percentage for partial scoring */
    scorePercentage: number;
}

interface GraphLine {
    /** Label for the line */
    label: string;

    /** Correct line equation */
    correctLine: string;

    /** Initial view for the line */
    initialView: string;
}

interface GraphLineModelConfig {
    /** The lines that should appear on the graph */
    lines: GraphLine[];

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

/**
 * NOTE: There's no functionality described for arrows, padding, labels, graphTitle,
 * rationale, scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */

/**
 * Model Object for @pie-elements/graph-lines
 * @additionalProperties false
 */
export interface GraphLinesPie extends PieModel {
    /** Feedback for student answer */
    feedback?: ComplexFeedbackType;

    /** Indicates if the graph can have multiple lines */
    multiple?: boolean;

    /** Indicates if partial scoring rules is enabled */
    partialScoring?: boolean;

    /** Indicates partial scoring rules */
    partialScoringRules?: PartialScoringRule[];

    /** Indicates the graph line model */
    graph: GraphLineModelConfig;

    /** Indicates if arrows are enabled */
    arrows: boolean;

    /** Indicates if padding is enabled */
    padding: boolean;

    /** Indicates if labels are enabled */
    labels: boolean;

    /** Indicates if rationale is enabled */
    rationale: boolean;

    /** Indicates scoring type */
    scoringType: 'auto' | 'rubric';

    /** Indicates if student instructions are enabled */
    studentInstructions: boolean;

    /** Indicates if teacher instructions are enabled */
    teacherInstructions: boolean;
}

/**
 * Config Object for @pie-elements/graph-lines
 * @additionalProperties false
 */
export interface GraphLinesConfigure extends PromptConfig, CommonConfigSettings {
    /**
     * Arrows configuration
     */
    arrows?: ConfigureProp;

    /**
     * Padding configuration
     */
    padding?: ConfigureProp;

    /**
     * Graph title configuration
     */
    graphTitle?: ConfigureProp;

    /**
     * Labels configuration
     */
    labels?: ConfigureProp;

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