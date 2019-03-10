import {PromptConfig} from '../../PromptConfig';
import {CommonConfigSettings} from '../../CommonConfigSettings';
import {PieModel} from '../../PieModel';
import {ComplexFeedbackType} from '../../ComplexFeedback';

interface ResponseDefault {
    /** Indicates the response type */
    type: 'point' | 'line' | 'ray';

    /** Indicates response domain position */
    domainPosition: number;
}

interface ResponsePoint extends ResponseDefault {
    /** Indicates point type */
    pointType: 'full' | 'empty';
}

interface ResponseLine extends ResponseDefault {
    /** Indicates left point (left limit for the line) type */
    leftPoint: 'full' | 'empty';

    /** Indicates right point (left limit for the line) type */
    rightPoint: 'full' | 'empty';

    /** Indicates line size */
    size: number;
}

interface ResponseRay extends ResponseDefault {
    /** Indicates point type */
    pointType: 'full' | 'empty';

    /** Indicates ray direction */
    direction: 'negative' | 'positive';
}

/** Array that returns responses */
interface ResponseArray extends Array<ResponsePoint | ResponseLine | ResponseRay> {}

interface PartialScoringRule {
    /** Number of correct answers */
    numberOfCorrect: number;

    /** The percentage for partial scoring  */
    scorePercentage: number;
}

interface NumberLineDomainConfiguration {
    /** Indicates domain representation width */
    width: number;

    /** Indicates domain representation height */
    height: number;

    /** Domain limits */
    domain: [number, number];

    /** Indicates the maximum number of correct response values */
    maxNumberOfPoints: number;

    /** Indicates number of ticks on the domain representation */
    tickFrequency: number;

    /** Indicates if minor ticks should be displayed */
    showMinorTicks: boolean;

    /** The number of minor ticks between the ticks */
    snapPerTick: number;

    /** */
    tickLabelOverrides: string[]; // TODO find the type for this property

    /** Indicates if the exhibit mode is enabled */
    exhibitOnly: boolean;

    /** Indicates the initial type of response */
    initialType: 'PF' | 'PE' | 'LFF' | 'LEF' | 'LFE' | 'LEE' | 'RFN' | 'RFP' | 'REN' | 'REP';

    /** Indicates the available types of responses */
    availableTypes: {
        /** Indicates if full point is available */
        PF: boolean;

        /** Indicates if empty point is available */
        PE: boolean;

        /** Indicates if line with full left & right point is available */
        LFF: boolean;

        /** Indicates if line with empty left & full right point is available */
        LEF: boolean;

        /** Indicates if line with full left & empty right point is available */
        LFE: boolean;

        /** Indicates if line with empty left & right point is available */
        LEE: boolean;

        /** Indicates if ray with full point and negative direction is available */
        RFN: boolean;

        /** Indicates if ray with empty point and negative direction is available */
        REN: boolean;

        /** Indicates if ray with full point and positive direction is available */
        RFP: boolean;

        /** Indicates if ray with empty point and positive direction is available */
        REP: boolean;
    };

    /** Array of initial responses */
    initialElements: ResponseArray;
}

/**
 * Model Object for @pie-elements/number-line
 * @additionalProperties false
 */
export interface NumberLinePie extends PieModel {
    /** Feedback for student responses */
    feedback?: ComplexFeedbackType;

    /** Array of responses */
    correctResponse: ResponseArray;

    /** Indicates if partial scoring is enabled */
    allowPartialScoring: boolean;

    /** Partial scoring rules */
    partialScoring: PartialScoringRule[];

    /** Configuration for the domain */
    config: NumberLineDomainConfiguration;
}

/**
 * Config Object for @pie-elements/number-line
 * @additionalProperties false
 */
export interface NumberLineConfigure extends PromptConfig, CommonConfigSettings {}

