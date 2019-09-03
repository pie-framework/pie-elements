import {PieModel} from '../../PieModel';
import {ConfigureProp} from '../ConfigurationProp';
import {PromptConfig} from '../../PromptConfig';
import {Dimension} from '../../Dimension';


/** NOTE: teacherInstructions, studentInstructions and rationale
 * functionalities are not defined yet - the value for those can belong to
 * model or to configuration (to be moved when the functionality is defined)
 */

/**
 * Model for the @pie-elements/drawing-response Interaction
 * @additionalProperties false
 */
export interface DrawingResponsePie extends PieModel {
    /**  The question prompt or item stem */
    prompt?: string;

    /**  The image over which shapes, patterns and texts will be added */
    imageUrl?: string;

    /**  The dimensions of the image */
    imageDimensions: Dimension[];

    /** Indicates student instructions */
    studentInstructions?: string;

    /** Indicates teacher instructions */
    teacherInstructions?: string;
}

/**
 * Config Object for @pie-elements/drawing-response
 * @additionalProperties false
 */
export interface DrawingResponseConfigure extends PromptConfig {
    /**
     * Configuration for multiple correct
     */
    backgroundImage?: ConfigureProp;

    /**
     * Configuration for partial scoring
     */
    partialScoring?:  ConfigureProp;

    /** Configuration for rationale */
    rationale?: ConfigureProp;

    /**
     * Student Instructions configuration
     */
    studentInstructions?: ConfigureProp;

    /**
     * Teacher Instructions configuration
     */
    teacherInstructions?: ConfigureProp;
}
