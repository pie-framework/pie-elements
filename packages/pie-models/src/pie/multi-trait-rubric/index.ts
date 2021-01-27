import {PieModel} from '../../PieModel';
import {ConfigurePropWithEnabled} from '../ConfigurationProp';


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
  /** Indicates if scoring should start at 0 or 1 */
  excludeZero?: boolean;

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

  /** Indicates if should be visible to student */
  visibleToStudent?: boolean;

  /** scales */
  scales: Scale[];
}


/**
 * Config Object for @pie-elements/multi-trait-rubric
 * @additionalProperties false
 */
export interface MultiTraitRubricConfigure {
  /**
   * Configuration for showing the Standards column
   */
  showStandards?: ConfigurePropWithEnabled;
}
