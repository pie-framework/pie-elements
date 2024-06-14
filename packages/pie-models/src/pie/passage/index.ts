import { PieModel } from '../../PieModel';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureMaxImageDimensionsProp,
  ConfigurePropWithEnabled,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigureRequired
} from '../ConfigurationProp';

/**
 * Model for the @pie-elements/passage
 * @additionalProperties false
 */
export interface PassagePie extends PieModel {
  passages: Passage[];

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates if title is enabled */
  titleEnabled: boolean;

  /** Indicates if subtitle is enabled */
  subtitleEnabled: boolean;

  /** Indicates if text is enabled */
  textEnabled: boolean;

  /** Indicates if author is enabled */
  authorEnabled: boolean;
}

export interface Passage {
  /** The title of the passage */
  title: string;

  /** The subtitle of the passage */
  subtitle: string;

  /** The author of the passage */
  author: string;

  /** The content of the passage */
  text: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;
}

/**
 * Config Object for @pie-elements/passage-configure
 * @additionalProperties false
 */
export interface PassageConfigure {

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;


  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: EditableHtmlPluginConfigureRequired;

  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;

  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

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