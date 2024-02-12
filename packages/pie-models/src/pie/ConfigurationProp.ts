export interface ConfigureProp {
  /**
   * Indicates if the item has to be displayed in the Settings Panel
   */
  settings?: boolean;

  /**
   * Indicates the label for the item that has to be displayed in the Settings Panel
   */
  label?: string;
}

export interface EditableHtmlButtonConfigure {
  /**
   * Indicates if the plugin is disabled or not
   */
  disabled?: boolean
}

export interface EditableHtmlConfigureProp {
  /**
   * Indicates if the audio plugin is disabled or not
   */
  audio?: EditableHtmlButtonConfigure,

  /**
   * Indicates if the video plugin is disabled or not
   */
  video?: EditableHtmlButtonConfigure,

  /**
   * Indicates if the image plugin is disabled or not
   */
  image?: EditableHtmlButtonConfigure,
}

export interface EditableHtmlPluginConfigure extends ConfigureProp {
  /**
   * Indicates the custom configuration for the editable html buttons
   * E.g. audio, video, image
   */
  inputConfiguration?: EditableHtmlConfigureProp
}

export interface ConfigureRequiredProp extends ConfigureProp {
  /**
   * Indicates if the item is required and the value cannot be empty
   */
  required?: boolean;
}

export interface ConfigureWithForceProp extends ConfigureProp {
  /**
   * Indicates the value for the toggle;
   * if true:
   * - this property will not be visible in Settings Panel (settings will become automatically false)
   * - the model property afferent to it will become automatically false
   */
  forceEnabled?: boolean;
}

export interface ConfigurePropWithEnabled extends ConfigureProp {
  /**
   * Indicates the value of the item if it affects config-ui
   * (eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)
   */
  enabled?: boolean;
}

export interface ConfigureMaxImageDimensionsProp {
  /** Indicates the max dimension for images in teacher instructions */
  teacherInstructions?: number;

  /** Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified */
  prompt?: number;

  /** Indicates the max dimension for images in rationale */
  rationale?: number;
}

export interface ConfigureMathMLProp {
  /** Indicates if model should have mathML output instead of latex */
  mmlOutput?: number;

  /** Indicates if mathML that's already in model should be editable */
  mmlEditing?: number;
}

export interface ConfigureLanguageOptionsProp {
  /**
   * Value of the language option
   */
  value: string;

  /**
   * Label of the language option
   */
  label: string;
}
