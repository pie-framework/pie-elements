import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { ConfigureProp } from '../ConfigurationProp';

interface Graph {
    /** Width for graph representation */
    width: number;

    /** Height for graph representation */
    height: number;
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

    /** Axis Label */
    axisLabel: string;
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

interface Labels {
    /** Label for top side of the graph */
    top: string;

    /** Label for bottom side of the graph */
    bottom: string;

    /** Label for left side of the graph */
    left: string;

    /** Label for right side of the graph */
    right: string;
}

enum Tool {
    point = 'point',
    circle = 'circle',
    polygon = 'polygon',
    segment = 'segment',
    ray = 'ray',
    vector = 'vector',
    line = 'line',
    sine = 'sine',
    parabola = 'parabola',
    label = 'label'
}


/**
 * NOTE: There's no functionality described for studentInstructions
 * so there's no implementation (they are only added in model)
 */

/**
 * Model Object for @pie-elements/graphing
 * @additionalProperties false
 */
export interface GraphingPie extends PieModel {
    /** Indicates marks that are set as answers; Note: alternates can be added having this form: alternateIndex */
    answers: {
        correctAnswer: Answer,
        alternate1: Answer
    };

    /** Indicates if arrows are enabled */
    arrows?: boolean;

    /** Indicates marks that have to be displayed in background */
    backgroundMarks: [Mark];

    /** Indicates domain settings for the graph */
    domain: GraphSettings;

    /** Indicates the graph line model */
    graph: Graph;

    /** Indicates labels */
    labels?: Labels;

    /** Indicates if padding is enabled */
    padding?: boolean;

    /** Indicates prompt value */
    prompt?: string;

    /** Indicates range settings for the graph */
    range: GraphSettings;

    /** Indicates rationale for the answer */
    rationale?: string;

    /** Indicates scoring type */
    scoringType?: 'dichotomous' | 'partial scoring';

    /** Indicates if student instructions are enabled */
    studentInstructions?: boolean;

    /** Indicates if teacher instructions are enabled */
    teacherInstructions?: boolean;

    /** Indicates graph title */
    title?: string;

    /** Indicates the tools that have to be displayed in toolbar */
    toolbarTools?: [Tool]
}

/**
 * Config Object for @pie-elements/graphing
 * @additionalProperties false
 */
export interface GraphingConfigure extends PromptConfig, CommonConfigSettings {
    /**
     * Authoring configuration
     */
    authoring?: ConfigureProp;

    /**
     * Arrows configuration
     */
    arrows?: ConfigureProp;

    /**
     * Padding configuration
     */
    padding?: ConfigureProp;

    /**
     * Labels configuration
     */
    labels?: ConfigureProp;

    /**
     * Rationale configuration
     */
    prompt?: ConfigureProp;

    /**
     * Prompt configuration
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

    /**
     * Graph title configuration
     */
    title?: ConfigureProp;
}