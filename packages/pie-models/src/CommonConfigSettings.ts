/**
 * Config panel settings that are shared across many PIEs
 */
export interface CommonConfigSettings {
  /**
   * Indicates the dimensions configuration for the authoring container
   * @default: {}
   */
  contentDimensions?: {
    /**
     * Indicates the max height of the authoring container (in pixels)
     * @default undefined
     */
    maxHeight?: Number;

    /**
     * Indicates the max width of the authoring container (in pixels)
     * @default undefined
     */
    maxWidth?: Number;

    /**
     * Indicates the min height of the authoring container (in pixels)
     * @default undefined
     */
    minHeight?: Number;

    /**
     * Indicates the min width of the authoring container (in pixels)
     * @default undefined
     */
    minWidth?: Number;
  };

  /**
   * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
   * @default true
   */
  settingsPartialScoring?: boolean;
}
