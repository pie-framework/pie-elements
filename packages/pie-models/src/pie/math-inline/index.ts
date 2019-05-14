import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';

interface Alternate {
    /** The id for the alternative response */
    id: number;

    /** The value for the alternative response */
    answer: string;
}

interface Alternates {
    [index: number]: Alternate;
}

interface MathInlineResponse {
    /** The id of the response */
    id: number | string;

    /**
     * Indicates what type of validation should be applied on the response
     * @default is symbolic
     */
    validation: 'literal' | 'symbolic';

    /** The answer for the question */
    answer: string;

    /**
     * For validation type = literal, alternates represents
     * an object with some alternatives for the correct answers
     */
    alternates: Alternates;

    /** Indicates if spaces are allowed */
    allowSpaces?: boolean;

    /** Indicates if decimals are allowed */
    allowDecimals?: boolean;
}

/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure (to be moved when the functionality is defined)
 */


/**
* Model for the @pie-elements/math-inline
* @additionalProperties false
*/
export interface MathInlinePie extends PieModel {
    /** Indicates the mode of the question*/
    responseType: 'Advanced Multi' | 'Simple';

    /** Indicates the question statement */
    question?: string;


    /** Indicates the expression for advanced mode */
    expression: string;

    /** Indicates what type of editor should be displayed for all the possible responses
     * 1 for Grade 1 - 2
     * 3 for Grade 3 - 5
     * 6 for Grade 6 - 7
     * 8 for Grade 8 - HS
     * @default - everything
     */
    equationEditor: 'geometry' | 'advanced-algebra' | 'statistics' | 'everything' | 1 | 3 | 6 | 8;

    /** Feedback configuration for the responses */
    feedback: ComplexFeedbackType;

    /** Array of all correct responses */
    responses: MathInlineResponse[];

    /**
     * Default correct response
     * if not set, default value will be responses[0]
     */
    defaultResponse?: MathInlineResponse;

    /**
     * Indicates if partial scoring is allowed.
     * This property is not used yet.
     */
    partialScoring: boolean;

    /** Indicates the value for rationale */
    rationale: string;

    /** Indicates scoring type */
    scoringType: 'auto' | 'rubric';

    /** Indicates if student instructions are enabled */
    studentInstructions: boolean;

    /** Indicates if teacher instructions are enabled */
    teacherInstructions: boolean;
}


/**
 * Config Object for @pie-elements/math-inline
 * @additionalProperties false
 */
export interface MathInlineConfigure extends PromptConfig, CommonConfigSettings {
    /**
     * Configuration for response type
     */
    responseType?: ConfigureProp;

    /**
     * Configuration for partial scoring
     */
    partialScoring?: ConfigureProp;

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