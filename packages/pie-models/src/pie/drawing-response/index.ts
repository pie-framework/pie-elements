import { PieModel } from '../../PieModel';
import { ConfigureProp, ConfigurePropWithEnabled } from '../ConfigurationProp';
import { PromptConfig } from '../../PromptConfig';
import { Dimension } from '../../Dimension';

/** NOTE: teacherInstructions, studentInstructions and rationale
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/drawing-response Interaction
 * @additionalProperties false
 */
export interface DrawingResponsePie extends PieModel {
  /**  The question prompt or item stem */
  prompt?: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /**  The image over which shapes, patterns and texts will be added */
  imageUrl?: string;

  /**  The dimensions of the image */
  imageDimensions: Dimension[];

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates if spellcheck is enabled */
  spellCheckEnabled: boolean;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';
}

/**
 * Config Object for @pie-elements/drawing-response
 * @additionalProperties false
 */
export interface DrawingResponseConfigure extends PromptConfig {
  /**
   * Configuration for multiple correct
   */
  backgroundImage?: ConfigurePropWithEnabled;

  /**
   * Configuration for partial scoring
   */
  partialScoring?: ConfigureProp;

  /**
   * Configuration for the spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;
}
