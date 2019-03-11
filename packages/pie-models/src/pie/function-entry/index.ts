import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import { ComplexFeedbackType } from '../../Feedback';

/**
 * Model Object for @pie-elements/function-entry
 * @additionalProperties false
 */
export interface FunctionEntryPie extends PieModel {
    /** The expression against which the response will be evaluated */
    equation?: string;

    /** Indicates if formatting hints for constructing an answer are displayed */
    showFormattingHelp?: boolean;

    /** Feedback for student responses */
    feedback?: ComplexFeedbackType;
}

/**
 * Config Object for @pie-elements/function-entry
 * @additionalProperties false
 */
export interface FunctionEntryConfigure extends PromptConfig, CommonConfigSettings {}
