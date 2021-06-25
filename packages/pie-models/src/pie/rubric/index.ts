import {PieModel} from '../../PieModel';
import {PromptConfig} from "../../PromptConfig";
import {CommonConfigSettings} from "../../CommonConfigSettings";

/**
 * Model for the RubricPie Interaction
 * @additionalProperties false
 */
export interface RubricPie extends PieModel {
    /** Indicates the score points labels. Starting from 0 to max */
    points?: String[];

    /** Indicates the sample answers labels. Starting from 0 to max */
    sampleAnswers?:  String[];

    /** Indicates the max limit for scoring points */
    maxPoints?: number;

    /** Indicates if point 0 should be shown */
    excludeZeros?: boolean;
}

export interface RubricConfigure extends PromptConfig, CommonConfigSettings {}
