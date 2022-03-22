import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import { ComplexFeedbackType } from '../../Feedback';
import { ConfigureProp } from '../ConfigurationProp';

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
interface ResponseArray
  extends Array<ResponsePoint | ResponseLine | ResponseRay> {}

interface PartialScoringRule {
  /** Number of correct answers */
  numberOfCorrect: number;

  /** The percentage for partial scoring  */
  scorePercentage: number;
}

interface Domain {
  min: number;
  max: number;
}

interface Ticks {
  /** smallest tick - These ticks don't have labels. */
  minor: number;

  /** larger tick - These ticks have labels. */
  major: number;
}

interface Arrows {
  left: boolean;
  right: boolean;
}

interface NumberLineDomainConfiguration {
  /** display arrows */
  arrows: Arrows;

  /** Indicates domain representation width */
  width: number;

  /** Domain limits */
  domain: Domain;

  /** Indicates the maximum number of correct response values */
  maxNumberOfPoints: number;

  /** tick configuration */
  tick: Ticks;

  /** the title under the graph */
  title?: string;

  /** Indicates if the exhibit mode is enabled */
  exhibitOnly: boolean;

  /** Indicates the initial type of response */
  initialType:
    | 'PF'
    | 'LFF'
    | 'LEF'
    | 'LFE'
    | 'LEE'
    | 'RFN'
    | 'RFP'
    | 'REN'
    | 'REP';

  /** Indicates the available types of responses */
  availableTypes: {
    /** Indicates if full point is available */
    PF: boolean;

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

  /** Indicates the fractional step between 2 labeled ticks */
  labelStep: string;
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
  partialScoring: boolean;

  /** Configuration for the domain */
  graph: NumberLineDomainConfiguration;

  /**  The question prompt or item stem */
  prompt?: string;

  /** Indicates if spellcheck is enabled */
  spellCheckEnabled: boolean;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';
}

/**
 * Config Object for @pie-elements/number-line
 * @additionalProperties false
 */
export interface NumberLineConfigure
  extends PromptConfig,
    CommonConfigSettings {
  /**
   * Configuration for the prompt
   */
  prompt?: ConfigureProp;

  /**
   * Configuration for the spellcheck
   */
  spellCheck?: ConfigureProp;
}
