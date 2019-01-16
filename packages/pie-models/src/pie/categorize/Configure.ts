import PromptConfig from '../../PromptConfig';
/**
 * Config Object for @pie-elements/categorize
 */
export interface CategorizeConfigure extends PromptConfig  {



  /**
   * Indicates whether the settings panel wil allow the author to modify settings for partial scoring
   * @default true
   */
  settingsPartialScoring?:  boolean;

}