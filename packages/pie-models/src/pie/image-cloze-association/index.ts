import { PieModel } from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';
import { ConfigureProp } from '../ConfigurationProp';


interface ResponseContainer {
    /** The x coordinate of the response container */
    x?: number;

    /** The y coordinate of the response container */
    y?: number;

    /** The width of the response container */
    width?: string;

    /** The height of the response container */
    height?: string;
}

interface Validation {
    /** The valid response*/
    validResponse?: ValidResponse;

    /** List of alternate responses*/
    altResponses?: ValidResponse[];
}

interface ValidResponse {
    /** The score of the response */
    score?: number;

    /**
     * The value of the response
     * Each value is an object with a property "images"
     */
    value?: {
        /** An array containing a string that is a img tag */
        images?: string[];
    };
}
interface Image {
    /** The url of the image*/
    src?: string;

    /** The width of the image*/
    width?: number;

    /** The height of the image*/
    height?: number;
}

/**
 * Model for the @pie-elements/image-cloze-association Interaction
 * @additionalProperties false
 */
export interface ImageClozeAssociationPie extends PieModel {
    /** The question prompt or item stem*/
    prompt?: string;

    /** Indicates if Rationale is enabled */
    rationaleEnabled?: boolean;

    /** Indicates if Teacher Instructions are enabled */
    teacherInstructionsEnabled?: boolean;

    /** Indicates if Student Instructions are enabled */
    studentInstructionsEnabled?: boolean;

    /** The image over which the responses will be dragged*/
    image?: Image;

    /**
     * List of the response containers
     * The response containers are the areas where the images are dragged in
     */
    responseContainers?: ResponseContainer[];

    /** The question stimulus*/
    stimulus?: string;

    /** List of img tags that are the possible responses*/
    possibleResponses?: string[];

    /** The validation - correct responses, alternate responses and score*/
    validation?: Validation;

    /** Indicates if the item should use partial scoring */
    partialScoring?: boolean;

    /**
     * Indicates how many responses can be placed in a response container
     * @default 1
     */
    maxResponsePerZone?: number;

    /** Indicates if duplicate responses are allowed */
    duplicateResponses?: boolean;
}

/**
 * Config Object for @pie-elements/image-cloze-association
 * @additionalProperties false
 */
export interface ImageClozeAssociationConfigure extends PromptConfig, CommonConfigSettings {
    /**
     * Teacher Instructions configuration
     */
    teacherInstructions?: ConfigureProp;
}
