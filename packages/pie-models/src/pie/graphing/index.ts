import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { ConfigureProp } from '../ConfigurationProp';

interface Graph {
    /** Width for graph representation */
    domain: number;

    /** Height for graph representation */
    range: number;
}

interface GraphSettings {
    /** Min value */
    min: number;

    /** Max value */
    max: number;

    /** Padding value */
    padding: number;

    /** Step value */
    step: number;

    /** Label step value */
    labelStep: number;
}

interface Point {
    /** Indicates x coordinate */
    x: number;

    /** Indicates y coordinate */
    y: number;
}

interface Mark {
    /** Indicates type of mark */
    type: 'point' | 'segment' | 'line' | 'vector' | 'circle' | 'sine' | 'polygon' | 'ray' | 'parabola';

    /** Indicates if label should be visible */
    showLabel?: boolean;

    /** Indicates label value for mark */
    label?: string;

    /** Indicates if mark is in build process */
    building: boolean;

    /** Indicates x coordinate if type is point */
    x?: number;

    /** Indicates y coordinate if type is point */
    y?: number;

    /** Indicates where starts the mark if type is line, segment, ray, vector */
    from?: Point;

    /** Indicates where end the mark if type is line, segment, ray, vector */
    to?: Point;

    /** Indicates the center of circle if type is circle */
    center?: Point;

    /** Indicates a point on circle's exterior if type is circle  */
    outerPoint?: Point;

    /** Indicates if mark is closed if type is polygon, sine */
    closed?: boolean;

    /** Indicates all mark's points if type is polygon */
    points?: [Point];

    /** Indicated the root of mark if type is sine, parabola */
    root?: Point;

    /** Indicated the edge of mark if type is sine, parabola */
    edge?: Point;

}

interface Answer {
    /** Indicates name of answer */
    name: string;

    /** Indicates marks for the answer */
    marks: [Mark];
}


/**
 * NOTE: There's no functionality described for arrows, padding, labels, graphTitle,
 * scoringType, studentInstructions, teacherInstructions
 * so there's no implementation (they are only added in model)
 */

/**
 * Model Object for @pie-elements/graphing
 * @additionalProperties false
 */
export interface GraphingPie extends PieModel {
    /** Indicates the graph line model */
    graph: Graph;

    /** Indicates domain settings for the graph */
    domain: GraphSettings;

    /** Indicates range settings for the graph */
    range: GraphSettings;

    /** Indicates label for x axis */
    xAxisLabel: string;

    /** Indicates label for y axis */
    yAxisLabel: string;

    /** Indicates if arrows are enabled */
    arrows?: boolean;

    /** Indicates if padding is enabled */
    padding?: boolean;

    /** Indicates if labels are enabled */
    labels?: boolean;

    /** Indicates prompt value */
    prompt?: string;

    /** Indicates rationale for the answer */
    rationale?: string;

    /** Indicates scoring type */
    scoringType?: 'auto' | 'rubric';

    /** Indicates if student instructions are enabled */
    studentInstructions?: boolean;

    /** Indicates if teacher instructions are enabled */
    teacherInstructions?: boolean;

    /** Indicates graph title */
    title?: string;

    /** Indicates marks that have to be displayed in background */
    backgroundMarks: [Mark];

    /** Indicates marks that are set as answers; Note: alternates can be added having this form: alternateIndex */
    answers: {
        correctAnswer: Answer,
        alternate1: Answer
    }
}

/**
 * Config Object for @pie-elements/graphing
 * @additionalProperties false
 */
export interface GraphingConfigure extends PromptConfig, CommonConfigSettings {
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
     * Prompt configuration
     */
    rationale?: ConfigureProp;

    /**
     * Rationale configuration
     */
    prompt?: ConfigureProp;

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