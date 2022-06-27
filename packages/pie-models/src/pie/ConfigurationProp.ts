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

export interface ConfigurePropWithEnabled {
    /**
     * Indicates if the item has to be displayed in the Settings Panel
     */
    settings?: boolean;

    /**
     * Indicates the label for the item that has to be displayed in the Settings Panel
     */
    label?: string;

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
