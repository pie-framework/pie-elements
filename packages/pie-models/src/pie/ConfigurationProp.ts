export interface ConfigureProp {
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
