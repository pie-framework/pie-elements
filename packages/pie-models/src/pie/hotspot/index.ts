import { Shape } from '../../Shape';
import { Dimension } from '../../Dimension';
import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { ConfigureMaxImageDimensionsProp, ConfigureProp } from '../ConfigurationProp';

/**
 * Model for the @pie-elements/hotspot Interaction
 * @additionalProperties false
 */
export interface HotspotPie extends PieModel {
  /**  The question prompt or item stem */
  prompt?: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /**  The image over which hotspots will be drawn */
  imageUrl?: string;

  /** The shapes/hotspots of the question */
  shapes: Shape;

  /**  Indicates if the item supports multiple correct answers */
  multipleCorrect: boolean;

  /** Indicates if the item should use partial scoring */
  partialScoring: boolean;

  /**  The dimensions of the drawable section */
  dimensions: Dimension[];

  /**  The color that fills the hotspot */
  hotspotColor?: string;

  /**  The filling hotspot color options  */
  hotspotList?: string[];

  /**  The outline color of the hotspot */
  outlineColor?: string;

  /**  The outline hotspot color options  */
  outlineList?: string[];

  /** Indicates the value for rationale */
  rationale?: string;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates the width of the outline for a selection */
  strokeWidth: number;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /**
   * Indicates the editor's toolbar position which can be 'bottom' or 'top'
   * @default: 'bottom'
   */
  toolbarEditorPosition?: 'bottom' | 'top';

  /** Indicates if Rubric is enabled */
  rubricEnabled: boolean;
}

/**
 * Config Object for @pie-elements/hotspot
 * @additionalProperties false
 */
export interface HotspotConfigure extends PromptConfig {
  /**
   * Configuration for multiple correct
   */
  multipleCorrect?: ConfigureProp;

  /**
   * Configuration for partial scoring
   */
  partialScoring?: ConfigureProp;

  /** Configuration for rationale */
  rationale?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /** Configuration for preserveAspectRatio. If enabled, then the image aspect ratio will be preserved. It is enabled by default. */
  preserveAspectRatio?: ConfigureProp;

  /**
   * Minimum number of shapes
   */
  minShapes?: number;

  /**
   * Maximum number of shapes
   */
  maxShapes?: number;

  /**
   * Maximum number of selected shapes in correct answer
   */
  maxSelections?: number;

  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;

  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;

  /**
   * Rubric configuration
   */
  withRubric?: ConfigureProp;
}
