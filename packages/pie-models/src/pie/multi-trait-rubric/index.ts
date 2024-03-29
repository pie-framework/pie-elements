import { PieModel } from '../../PieModel';
import {
  ConfigureMathMLProp,
  ConfigureProp,
  EditableHtmlConfigureProp,
  EditableHtmlPluginConfigure,
} from '../ConfigurationProp';

interface Trait {
  /** Trait name */
  name: string;

  /** Trait standards */
  standards: string[];

  /** Trait description */
  description: string;

  /** Score point descriptors. Starting from 0 to max. */
  scorePointsDescriptors: string[];
}

interface Scale {
  /** Indicates max limit for scoring points */
  maxPoints: number;

  /** Score labels. Starting from 0 to max. */
  scorePointsLabels: string[];

  /** Trait label */
  traitLabel: string;

  /** Traits */
  traits: Trait[];
}

/**
 * Model for the MultiTraitRubric Interaction
 * @additionalProperties false
 */
export interface MultiTraitRubricPie extends PieModel {
  /** Indicates if half scoring is enabled */
  halfScoring?: boolean;

  /** Indicates if point labels should be shown */
  pointLabels?: boolean;

  /** Indicates if should be visible to student */
  visibleToStudent?: boolean;

  /** Indicates if description should be shown */
  description?: boolean;

  /** Indicates if standards should be shown */
  standards?: boolean;

  /** Indicates if scoring should start at 0 or 1 */
  excludeZero?: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** scales */
  scales: Scale[];
}

interface DialogContent {
  /** Dialog box title */
  title?: string;

  /** Dialog box text */
  text?: string;
}

/**
 * Config Object for @pie-elements/multi-trait-rubric
 * @additionalProperties false
 */
export interface MultiTraitRubricConfigure {
  /**
   * Base editable html input configuration regarding plugins that are enabled/disabled
   * E.g. audio, video, image
   */
  baseInputConfiguration?: EditableHtmlConfigureProp;

  /**
   * Expanded input configurations
   */
  expandedInput?: EditableHtmlPluginConfigure;

  /**
   * Label input configurations
   */
  labelInput?: EditableHtmlPluginConfigure;

  /**
   * Configuration for Excluding Zero Dialog Box
   */
  excludeZeroDialogBoxContent?: DialogContent;

  /**
   * Configuration for Including Zero Dialog Box
   */
  includeZeroDialogBoxContent?: DialogContent;

  /**
   * Configuration for Deleting Scale Dialog Box
   */
  deleteScaleDialogBoxContent?: DialogContent;

  /**
   * Configuration for Decreasing Max Points Dialog Box
   */
  maxPointsDialogBoxContent?: DialogContent;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Configuration for Excluding Zero Column
   */
  showExcludeZero?: ConfigureProp;

  /**
   * Configuration for Showing Score Point Labels
   */
  showScorePointLabels?: ConfigureProp;

  /**
   * Configuration for Showing Description
   */
  showDescription?: ConfigureProp;

  /**
   * Configuration for Showing Multi-trait-rubric to Students
   */
  showVisibleToStudent?: ConfigureProp;

  /**
   * Configuration for Showing Half Scoring Indicator
   */
  showHalfScoring?: ConfigureProp;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * How large (in px) should multi-trait-rubric be
   */
  width: string;

  // these should not be set to true (should not be used) for now
  //
  // /**
  //  * Configuration for showing the Standards column
  //  */
  // showStandards?: ConfigureProp;
  //
  // /**
  //  * Configuration for showing the Level Tag Input
  //  */
  // showLevelTagInput?: ConfigurePropWithEnabled;
  //
  // /**
  //  * Configuration for allowing drag & drop per traits
  //  */
  // dragAndDrop?: ConfigurePropWithEnabled;

  /**
   * Minimum number of traits
   */
  minNoOfTraits?: number;

  /**
   * Maximum number of traits
   */
  maxNoOfTraits?: number;

  /**
   * Minimum number of scales
   */
  minNoOfScales?: number;

  /**
   * Maximum number of scales
   */
  maxNoOfScales?: number;

  /**
   * The default trait label for new created scales.
   * If it's not defined, it will default to the label of the first trait.
   */
  defaultTraitLabel?: string;

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /** Indicates the max limit for scoring points */
  maxMaxPoints?: number;
}
