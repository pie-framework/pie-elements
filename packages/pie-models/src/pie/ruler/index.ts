import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';

/**
* Model for the @pie-elements/ruler
* @additionalProperties false
*/
export interface RulerPie extends PieModel {
    /** Type of the ruler */
    metric: 'imperial' | 'matric';

    /**
     * Ruler label
     * for imperial it can be 'in' | 'ft' | 'yd' | 'm'
     * for metric it can be ''mm' | 'cm' | 'm' | 'km' |
     */
    label: 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd';

    /** Number of ticks to display if metric is imperial */
    imperialTicks: 16 | 8 | 4;

    /** Units number for the ruler */
    units: number;

    /** Ruler width */
    width: number;
}

/**
 * Config Object for @pie-elements/ruler
 * @additionalProperties false
 */
export interface RulerConfigure extends PromptConfig, CommonConfigSettings {}