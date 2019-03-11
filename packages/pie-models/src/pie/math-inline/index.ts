import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../ComplexFeedback';

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

/**
* Model for the @pie-elements/math-inline
* @additionalProperties false
*/
export interface MathInlinePie extends PieModel {
    /** Indicates the question statement */
    question?: string;

    /** Indicates the mode of the question*/
    mode: 'advanced' | 'simple';

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

    /** The configuration */
    config: {
        /**
         * Indicates if partial scoring is allowed.
         * This property is not used yet.
         */
        allowPartialScores: boolean;
    }
}


/**
 * Config Object for @pie-elements/math-inline
 * @additionalProperties false
 */
export interface MathInlineConfigure extends PromptConfig, CommonConfigSettings {

}