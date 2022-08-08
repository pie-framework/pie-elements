import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { PieModel } from '../../PieModel';
import { ConfigureMaxImageDimensionsProp, ConfigureProp, ConfigurePropWithEnabled } from '../ConfigurationProp';

interface Graph {
  /** Width for graph representation */
  width: number;

  /** Height for graph representation */
  height: number;
}

interface GraphSettings {
  /** Min value */
  min: number;

  /** Max value */
  max: number;

  /** Padding value */
  padding: number;

  /** Step value */
  step: number;

  /** Label step value */
  labelStep: number;

  /** Axis Label */
  axisLabel: string;
}

interface Point {
  /** Indicates x coordinate */
  x: number;

  /** Indicates y coordinate */
  y: number;
}

interface Mark {
  /** Indicates type of mark */
  type:
    | 'point'
    | 'segment'
    | 'line'
    | 'vector'
    | 'circle'
    | 'sine'
    | 'polygon'
    | 'ray'
    | 'parabola';

  /** Indicates if label should be visible */
  showLabel?: boolean;

  /** Indicates label value for mark */
  label?: string;

  /** Indicates if mark is in build process */
  building: boolean;

  /** Indicates x coordinate if type is point */
  x?: number;

  /** Indicates y coordinate if type is point */
  y?: number;

  /** Indicates where starts the mark if type is line, segment, ray, vector */
  from?: Point;

  /** Indicates where end the mark if type is line, segment, ray, vector */
  to?: Point;

  /** Indicates the center of circle if type is circle */
  center?: Point;

  /** Indicates a point on circle's exterior if type is circle  */
  outerPoint?: Point;

  /** Indicates if mark is closed if type is polygon, sine */
  closed?: boolean;

  /** Indicates all mark's points if type is polygon */
  points?: [Point];

  /** Indicated the root of mark if type is sine, parabola */
  root?: Point;

  /** Indicated the edge of mark if type is sine, parabola */
  edge?: Point;
}

interface Answer {
  /** Indicates name of answer */
  name: string;

  /** Indicates marks for the answer */
  marks: [Mark];
}

interface Labels {
  /** Label for top side of the graph */
  top: string;

  /** Label for bottom side of the graph */
  bottom: string;

  /** Label for left side of the graph */
  left: string;

  /** Label for right side of the graph */
  right: string;
}

enum Tool {
  point = 'point',
  circle = 'circle',
  polygon = 'polygon',
  segment = 'segment',
  ray = 'ray',
  vector = 'vector',
  line = 'line',
  sine = 'sine',
  parabola = 'parabola',
  label = 'label',
}

interface Arrows {
  /** Indicates if left arrow is enabled */
  left: boolean;

  /** Indicates if right arrow is enabled */
  right: boolean;

  /** Indicates if up arrow is enabled */
  up: boolean;

  /** Indicates if down arrow is enabled */
  down: boolean;
}

/**
 * NOTE: There's no functionality described for studentInstructions
 * so there's no implementation (they are only added in model)
 */

/**
 * Model Object for @pie-elements/graphing
 * @additionalProperties false
 */
export interface GraphingPie extends PieModel {
  /** Indicates marks that are set as answers; Note: alternates can be added having this form: alternateIndex */
  answers: {
    correctAnswer: Answer;
    alternate1: Answer;
  };

  /** Indicates if arrows are enabled */
  arrows?: Arrows;

  /** Indicates marks that have to be displayed in background */
  backgroundMarks: [Mark];

  /** Indicates if coordinates of a point are displayed on hover */
  coordinatesOnHover?: boolean;

  /** Indicates the default selected tool for the graph */
  defaultTool:
      | 'point'
      | 'segment'
      | 'line'
      | 'vector'
      | 'circle'
      | 'sine'
      | 'polygon'
      | 'ray'
      | 'parabola';

  /** Indicates domain settings for the graph */
  domain: GraphSettings;

  /** Indicates the graph line model */
  graph: Graph;

  /** Indicates if the graph axes and labels are enabled */
  includeAxes?: boolean

  /** Indicates labels */
  labels?: Labels;

  /** Indicates if padding is enabled */
  padding?: boolean;

  /** Indicates prompt value */
  prompt?: string;

  /**  Indicates if the prompt is enabled */
  promptEnabled?: boolean;

  /** Indicates range settings for the graph */
  range: GraphSettings;

  /** Indicates rationale for the answer */
  rationale?: string;

  /** Indicates scoring type */
  scoringType?: 'dichotomous' | 'partial scoring';

  /** Indicates student instructions */
  studentInstructions?: string;

  /** Indicates teacher instructions */
  teacherInstructions?: string;

  /** Indicates graph title */
  title?: string;

  /** Indicates if the graph labels are displayed */
  labelsEnabled?: boolean;

  /** Indicates if the graph title is displayed */
  titleEnabled?: boolean;

  /** Indicates the tools that have to be displayed in toolbar */
  toolbarTools?: [Tool];

  /** Indicates if Rationale are enabled */
  rationaleEnabled: boolean;

  /** Indicates if spellcheck is enabled for the author. Default value is true */
  spellCheckEnabled: boolean;

  /** Indicates if some domain values will be synched to the range values */
  standardGrid?: boolean;

  /** Indicates if Student Instructions are enabled */
  studentInstructionsEnabled: boolean;

  /** Indicates if Teacher Instructions are enabled */
  teacherInstructionsEnabled: boolean;
}

interface ArrowsProp {
  /**
   * Indicates the label for the arrow that has to be displayed in the Settings Panel
   */
  label?: string;
}

interface ArrowsConfigProp {
  /**
   * Indicates if the item has to be displayed in the Settings Panel
   */
  settings?: boolean;

  /**
   * Indicates the label for the item that has to be displayed in the Settings Panel
   */
  label?: string;

  /** Indicates the props of the left arrow for the Settings Panel*/
  left?: ArrowsProp;

  /** Indicates the props of the right arrow for the Settings Panel*/
  right?: ArrowsProp;

  /** Indicates the props of the up arrow for the Settings Panel*/
  up?: ArrowsProp;

  /** Indicates the props of the down arrow for the Settings Panel*/
  down?: ArrowsProp;
}

interface DimensionsConfigProp {
  /**
   * Indicates if the item has to be displayed in the Settings Panel
   */
  settings?: boolean;

  /**
   * Indicates the label for the item that has to be displayed in the Settings Panel
   */
  label?: string;

  /**
   * Indicates if the graph dimensions are included in the Grid Setup Panel
   */
  enabled?: boolean;

  /** Indicates the minimum value for the graph width and height */
  min?: number;

  /** Indicates the maximum value for the graph width and height */
  max?: number;

  /** Indicates the increase/decrease value for the graph width and height */
  step?: number;
}

interface GridPanelConfigProp {
  /** Indicates the label for the item that is displayed in the Grid Setup Panel */
  label?: string;

  /** Indicates if the item is displayed in the Grid Setup Panel */
  enabled?: boolean;
}

interface AuthoringConfigProp {
  /** Indicates if the item is displayed in the Settings Panel */
  settings?: boolean;

  /** Indicates the label for the item that is displayed in the Settings Panel */
  label?: string;

  /** Indicates if the Grid Setup Panel is displayed */
  enabled?: boolean;

  /** Indicates if the "includeAxes" toggle is displayed in the Grid Setup Panel */
  includeAxesEnabled?: boolean;

  /** Indicates if the "standardGrid" toggle is displayed in the Grid Setup Panel */
  standardGridEnabled?: boolean;

  /** Axes minimum values configuration */
  min?: GridPanelConfigProp;

  /** Axes maximum values configuration */
  max?: GridPanelConfigProp;

  /** Axes labels configuration */
  axisLabel?: GridPanelConfigProp;

  /** Axes step values configuration */
  step?: GridPanelConfigProp;

  /** Axes label step values configuration */
  labelStep?: GridPanelConfigProp;
}

interface LabelsConfigProp extends ConfigurePropWithEnabled {
  /**
   * Indicates the placeholder for the top label
   */
  top?: string;

  /**
   * Indicates the placeholder for the right label
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

interface TitleConfigProp extends ConfigurePropWithEnabled {
  /**
   * Indicates the placeholder for the title label
   */
  placeholder?: string;
}

/**
 * Config Object for @pie-elements/graphing
 * @additionalProperties false
 */
export interface GraphingConfigure extends PromptConfig, CommonConfigSettings {
  /**
   * Grid Setup Panel configuration
   */
  authoring?: AuthoringConfigProp;

  /**
   * Arrows configuration
   */
  arrows?: ArrowsConfigProp;

  /**
   * Graph toolbar tools configuration
   */
  availableTools?: string[];

  /**
   * Coordinates configuration
   */
  coordinatesOnHover?: ConfigureProp;

  /**
   * Graph dimensions configuration
   */
  graphDimensions?: DimensionsConfigProp;

  /**
   * Padding configuration
   */
  padding?: ConfigureProp;

  /**
   * Labels configuration
   */
  labels?: LabelsConfigProp;

  /**
   * Rationale configuration
   */
  prompt?: ConfigureProp;

  /**
   * Configuration for the author's spellcheck
   */
   spellCheck?: ConfigureProp;

  /**
   * Prompt configuration
   */
  rationale?: ConfigureProp;

  /**
   * Scoring Type configuration
   */
  scoringType?: ConfigureProp;

  /**
   * Student Instructions configuration
   */
  studentInstructions?: ConfigureProp;

  /**
   * Teacher Instructions configuration
   */
  teacherInstructions?: ConfigureProp;

  /**
   * Graph title configuration
   */
  title?: TitleConfigProp;

  /**
   * Maximum image width for input fields
   */
  maxImageWidth?: ConfigureMaxImageDimensionsProp;

  /**
   * Maximum image height for input fields
   */
  maxImageHeight?: ConfigureMaxImageDimensionsProp;
}
