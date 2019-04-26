import {PieModel} from '../../PieModel';

/**
* Model for the @pie-elements/passage
* @additionalProperties false
*/
export interface PassagePie extends PieModel {
    /** The title of the passage */
    title: string;

    /** The content of the passage */
    content: string;
 
}

/**
 * Config Object for @pie-elements/passage
 * @additionalProperties false
 */
export interface RulerConfigure {}
