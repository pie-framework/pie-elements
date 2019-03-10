import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ComplexFeedbackType } from '../../ComplexFeedback';

interface Responses {
    /** Array of possible responses */
    values: string[];

    /** Indicates if whitespaces should be ignored */
    ignoreWhitespace?: boolean;

    /** Indicates if case should be ignored */
    ignoreCase?: boolean;
}

interface PartialResponses extends Responses {
    /** The percentage for the partial response */
    awardPercentage: string | number;
}

/**
* Model for the @pie-elements/text-entry
* @additionalProperties false
*/
export interface TextEntryPie extends PieModel {
    /** Feedback for student answer */
    feedback: ComplexFeedbackType;

    /** Object with all the correct responses */
    correctResponses: Responses;

    /** Object with partial responses and the rule for score */
    partialResponses: PartialResponses;

    /** Prompt for the question */
    prompt: string;

    allowIntegersOnly: boolean;

    /** Indicates if decimals are allowed if allowIntegersOnly is enabled */
    allowDecimal: boolean;

    /** Indicates if thousands separator is allowed if allowIntegersOnly is enabled */
    allowThousandsSeparator: boolean;

    /** Indicates if negative numbers are allowed if allowIntegersOnly is enabled */
    allowNegative: boolean;

    /** Indicates allowed answer size */
    answerBlankSize: '2' | '4' | '6' | '8' | '10' | '12';

    /** Indicates answer alignment */
    answerAlignment: 'left' | 'center' | 'right';
}

/**
 * Config Object for @pie-elements/text-entry
 * @additionalProperties false
 */
export interface TextEntryConfigure extends PromptConfig, CommonConfigSettings {}