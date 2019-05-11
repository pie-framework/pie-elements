import { Shape }  from '../../Shape';
import { Dimension }  from '../../Dimension';
import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { ConfigureProp } from '../ConfigurationProp';

/**
 * Model for the @pie-elements/hotspot Interaction
 * @additionalProperties false
 */
export interface HotspotPie extends PieModel {
  /**  The question prompt or item stem */
  prompt?: string;

  /**  The image over which hotspots will be drawn */
  imageUrl?: string;

  /** The shapes/hotspots of the question */
  shapes: Shape[];

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
}


/**
 * Config Object for @pie-elements/hotspot
 * @additionalProperties false
 */
export interface MultipleChoiceConfigure extends PromptConfig {
    /**
     * Indicates whether the settings panel wil allow the author to modify settings for multiple correct answers
     * @default true
     */
    settingsMultipleCorrect?: boolean;

    /**
     * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
     * @default true
     */
    settingsPartialScoring?:  boolean;

    /** Configuration for rationale */
    rationale?: ConfigureProp;
}
