import {PieModel} from '../../PieModel';

/**
* Model for the @pie-elements/passage
* @additionalProperties false
*/
export interface PassagePie extends PieModel {
    passages: Passage[];
}

export interface Passage {
    /** The title of the passage */
    title: string;

    /** The content of the passage */
    text: string;
}

/**
 * Config Object for @pie-elements/passage
 * @additionalProperties false
 */
export interface RulerConfigure {}
