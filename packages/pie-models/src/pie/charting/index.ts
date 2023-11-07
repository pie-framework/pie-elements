import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import {
  ConfigureLanguageOptionsProp,
  ConfigureMathMLProp,
  ConfigureMaxImageDimensionsProp,
  ConfigureProp,
  ConfigurePropWithEnabled,
} from '../ConfigurationProp';

interface Chart {
  /** Width for chart representation */
  width: number;

  /** Height for chart representation */
  height: number;
}

interface ChartSettings {
  /** Min value */
  min: number;

  /** Max value */
  max: number;

  /** Step value */
  step: number;

  /** Label step value */
  labelStep: number;

  /** Axis Label */
  axisLabel: string;
}

interface Category {
  /** Indicates category label */
  label: string;

  /** Indicates category value */
  value: number;

  /** Indicates if category value is interactive */
  interactive: boolean;

  /** Indicates if category label is editable */
  editable: boolean;

  /** Indicates if category is deletable */
  deletable: boolean;

  /** Indicates correctness for a category */
  correctness: {
    value: 'correct' | 'incorrect';
    label: 'correct' | 'incorrect';
  };
}

interface AvailableChartTypes {
  /** Indicates if bar chart is available and the label used for it. */
  bar: string;

  /** Indicates if histogram is available and the label used for it. */
  histogram: string;

  /** Indicates if line chart with dots is available and the label used for it. */
  lineDot: string;

  /** Indicates if line chart with crosses is available and the label used for it. */
  lineCross: string;

  /** Indicates if dot plot is available and the label used for it. */
  dotPlot: string;

  /** Indicates if line plot is available and the label used for it. */
  linePlot: string;
}

interface Answer {
  /** Indicates name of answer */
  name: string;

  /** Indicates marks for the answer */
  data: [Category];
}

interface Placeholder {
  /** Indicates placeholder message if title is not defined */
  title: string;

  /** Indicates placeholder message if labels for range or domain are not defined */
  labels: string;
}

/**
 * NOTE: There's no functionality described for studentInstructions
 * so there's no implementation (they are only added in model)
 */

/**
 * Model Object for @pie-elements/charting
 * @additionalProperties false
 */
export interface ChartingPie extends PieModel {
  /** Indicates if user can add more categories */
  addCategoryEnabled: boolean;

  chartType: 'bar' | 'histogram' | 'lineCross' | 'lineDot' | 'dorPlot' | 'linePlot';

  /** Indicates marks that are set as answers; Note: alternates can be added having this form: alternateIndex */
  correctAnswer: Answer;

  /** Indicates default categories for the answer */
  data: [Category];

  /** Indicates domain settings for the chart */
  domain: ChartSettings;

  /** Indicates the chart line model */
  graph: Chart;

  /** Indicates prompt value */
  prompt?: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** Indicates range settings for the chart */
  range: ChartSettings;

  /** Indicates rationale for the answer */
  rationale?: string;

  /** Indicates scoring type */
  scoringType?: 'all or nothing' | 'partial scoring';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates chart title */
  title?: string;

  /** Indicates placeholder messages */
  placeholderMessages?: Placeholder;

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;

  /** Indicates if Rubric is enabled */
  rubricEnabled: boolean;

  /** Indicates if teacher can enable/disable data[]:interactive. Default value is false */
  changeInteractiveEnabled: boolean;

  /** Indicates if teacher can enable/disable data[]:editable. Default value is false */
  changeEditableEnabled: boolean;

  /** Indicates if teacher can enable/disable addCategoryEnabled. Default value is false */
  changeAddCategoryEnabled: boolean;

  /**
   * Label for new category in correct response and player's chart
   */
  studentNewCategoryDefaultLabel: string;

  /** Indicates the language of the component
   * Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX
   */
  language?: string;
}

interface LabelsPlaceholderConfigProp extends ConfigurePropWithEnabled {
  /**
   * This value is empty for charting. The property exist in order to be consistent with graphing configuration.
   */
  top?: string;

  /**
   * This value is empty for charting. The property exist in order to be consistent with graphing configuration.
   */
  right?: string;

  /**
   * Indicates the placeholder for the bottom label
   */
  bottom?: string;

  /**
   * Indicates the placeholder for the left label
   */
  left?: string;
}

interface AuthorNewCategoryDefaults {
  /**
   * Indicates if the item has to be displayed in the Settings Panel
   */
  settings?: boolean;

  /**
   * Indicates the label for the new category
   */
  label?: string;

  /** Indicates if new category is interactive */
  interactive?: boolean;

  /** Indicates if new category is editable */
  editable?: boolean;
}

interface ChartingOption {
  /**
   * Indicates if the item has to be displayed in the Settings Panel
   */
  settings?: boolean;

  /**
   * Indicates the label for the option
   */
  authoringLabel?: string;

  /**
   * Indicates the label for the item that has to be displayed in the Settings Panel
   */
  settingsLabel?: string;
}

interface ChartingOptions {
  /** Indicates if teacher can enable/disable data[]:interactive */
  changeInteractive?: ChartingOption;

  /**
   *  Indicates if teacher can enable/disable data[]:editable
   */
  changeEditable?: ChartingOption;

  /** Indicates if teacher can enable/disable addCategoryEnabled */
  addCategory?: ChartingOption;
}

/**
 * Config Object for @pie-elements/charting
 * @additionalProperties false
 */
export interface ChartingConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Rationale configuration
   */
  prompt?: ConfigureProp;

  /**
   * Prompt configuration
   */
  rationale?: ConfigureProp;

  /**
   * Configuration for the author's spellcheck
   */
  spellCheck?: ConfigureProp;

  /**
   * Configuration for the title's placeholder
   */
  titlePlaceholder?: ConfigureProp;

  /**
   * Labels Placeholder configuration
   */
  labelsPlaceholders?: LabelsPlaceholderConfigProp;

  /**
   * Scoring Type configuration
   */
  scoringType?: ConfigureProp;

  /**
   * Indicates if the settings panel is not available
   */
  settingsPanelDisabled?: boolean;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;

  /**
   * Chart title configuration
   */
  title?: ConfigurePropWithEnabled;

  /**
   * Author instruction to build a new chart
   */
  instruction?: ConfigureProp;

  /**
   * Coonfiguration for new category in define chart
   */
  authorNewCategoryDefaults: AuthorNewCategoryDefaults;

  /** Configuration for editable-html */
  mathMlOptions?: ConfigureMathMLProp;

  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;

  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;

  /**
   * Rubric configuration - only relevant in environments that use pie-player-components
   */
  withRubric?: ConfigureProp;

  /**
   * Authoring view settings for Charting
   */
  chartingOptions?: ChartingOptions;

  /**
   * Indicates the chart types that are available
   */
  availableChartTypes?: AvailableChartTypes;

  /**
   * Indicates the label for the chart type
   */
  chartTypeLabel: string;

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
