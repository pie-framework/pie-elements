import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import {
  ConfigureProp,
  ConfigureMaxImageDimensionsProp,
  ConfigurePropWithEnabled,
  ConfigureLanguageOptionsProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigureRequired,
} from '../ConfigurationProp';

enum ChoicesPosition {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}

interface ResponseContainer {
  /** The x coordinate of the response container */
  x?: number;

  /** The y coordinate of the response container */
  y?: number;

  /** The width of the response container */
  width?: string;

  /** The height of the response container */
  height?: string;
}

interface Validation {
  /** The valid response*/
  validResponse?: ValidResponse;

  /** List of alternate responses*/
  altResponses?: ValidResponse[];
}

interface ValidResponse {
  /** The score of the response */
  score?: number;

  /**
   * The value of the response
   * Each value is an object with a property "images"
   */
  value?: {
    /** An array containing a string that is a img tag */
    images?: string[];
  };
}
interface Image {
  /** The url of the image*/
  src?: string;

  /** The width of the image*/
  width?: number;

  /** The height of the image*/
  height?: number;
}

/**
 * Model for the @pie-elements/image-cloze-association Interaction
 * @additionalProperties false
 */
export interface ImageClozeAssociationPie extends PieModel {
  /** Indicates in answer choices should have a transparent background. Default value is undefined. */
  answerChoiceTransparency?: boolean;

  /** The question prompt or item stem*/
  prompt?: string;

  /** Indicates if Rationale is enabled */
  rationaleEnabled?: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled?: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled?: boolean;

  /** The image over which the responses will be dragged*/
  image?: Image;

  /**
   * List of the response containers
   * The response containers are the areas where the images are dragged in
   */
  responseContainers?: ResponseContainer[];

  /** The question stimulus*/
  stimulus?: string;

  /** List of img tags that are the possible responses*/
  possibleResponses?: string[];

  /** The validation - correct responses, alternate responses and score*/
  validation?: Validation;

  /** Indicates if the item should use partial scoring */
  partialScoring?: boolean;

  /**
   * Indicates how many responses can be placed in a response container
   * @default 1
   */
  maxResponsePerZone?: number;

  /** Indicates if duplicate responses are allowed */
  duplicateResponses?: boolean;

  /** Indicates if the response containers should have a dashed border */
  showDashedBorder?: boolean;

  /** Indicates if Rubric is enabled */
  rubricEnabled: boolean;

  /** Indicates if the possible responses have to be shuffled in the player */
  shuffle?: boolean;

  /** Indicates the language of the component
   * Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX
   */
  language?: string;

  /** Indicates style options of the component
   * Supported options: fontsize, possibilityListPosition (top, bottom, left, right)
   */
  uiStyle?: {
    possibilityListPosition?: ChoicesPosition;
    fontsize: string;
  };

  /** Indicates the background color of the response area */
  responseAreaFill?: string;

  /** Indicates padding of the response container */
  responseContainerPadding?: string;

  /** Indicates the padding of the image drop target */
  imageDropTargetPadding?: string;

  /**
   * Indicates font size adjustment factor
   */
  fontSizeFactor?: number;

  /**
   * Indicates if the audio for the prompt should autoplay
   */
  autoplayAudioEnabled?: boolean;

  /**
   * Indicates if the audio should reach the end before the item can be marked as 'complete'
   */
  completeAudioEnabled?: boolean;

  /**
   * Indicates if the audio should be replaced with a custom audio button
   *  playImage: image url for the play state
   *  pauseImage: image url for the pause state
   */
  customAudioButton?: {
    playImage: string;
    pauseImage: string;
  };
}

/**
 * Config Object for @pie-elements/image-cloze-association
 * @additionalProperties false
 */
export interface ImageClozeAssociationConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;

  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /**
   * Rubric configuration - only relevant in environments that use pie-player-components
   */
  withRubric?: ConfigureProp;

  /**
   * Language configuration
   */
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
