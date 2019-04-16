export interface ConfigureProp {
    /**
     * Indicates if the item has to be displayed
     */
    settings?: boolean;

    /**
     * Indicates the label for the item
     */
    label?: string;

    /**
     * Indicates the value of the item if it affects config-ui (eg.: if item is a switch)
     */
    enabled?: boolean;
}