import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import { ComplexFeedbackType } from '../../Feedback';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

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

interface Domain {
  min: number;
  max: number;
}

interface Ticks {
  /** smallest tick - These ticks don't have labels. */
  minor: number;

  /** larger tick - These ticks have labels. */
  major: number;

  /** Contains tick interval type Integer, Fraction, Decimal */
  tickIntervalType: string;

  /** Integer representation of minor. */
  integerTick: number;

  /** Decimal representation of minor. */
  decimalTick: number;

  /** Fraction representation of minor. */
  fractionTick: string;
}

interface Arrows {
  left: boolean;
  right: boolean;
}

interface NumberLineDimensions {
  settings: boolean;
  label: string;
  enabled: boolean;
  min: number;
  max: number;
  step: number;
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
  initialType: 'PF' | 'LFF' | 'LEF' | 'LFE' | 'LEE' | 'RFN' | 'RFP' | 'REN' | 'REP';

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

  /** If enabled, allows user to set width for number line. */
  widthEnabled: boolean;

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

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** Indicates rationale for the answer */
  rationale?: string;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';

  /** Indicates the language of the component
   * Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX
   */
  language?: string;
}

/**
 * Config Object for @pie-elements/number-line
 * @additionalProperties false
 */
export interface NumberLineConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Configuration for the instruction
   */
  instruction?: ConfigurePropWithEnabled;

  /**
   * Configuration for the prompt
   */
  prompt?: EditableHtmlPluginConfigureRequired;

    /**
   * Rationale configuration
   */
    rationale?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the teacher instructions
   */
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /**
   * Configuration for the title
   */
  title?: EditableHtmlPluginConfigure;

  /** Hold default values for number line width like min , max and step. */
  numberLineDimensions?: NumberLineDimensions;

  /** Configuration for the author's spellcheck */
  spellCheck?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /** Holds numeric value for maximum number of elements allowed on number line. */
  maxMaxElements?: number;

  /** Hide buttons in point configuration module (Select All / None). */
  hidePointConfigButtons?: boolean;

  /** Array of available tools for author. */
  availableTools?: string[];

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /** Language configuration */
  language?: ConfigurePropWithEnabled;

  /**
   * Language choices configuration
   * Only available if language is enabled
   */
  languageChoices?: {
    label: string;
    options: ConfigureLanguageOptionsProp[];
  };
}
