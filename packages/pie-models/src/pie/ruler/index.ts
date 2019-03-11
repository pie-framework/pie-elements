import {PieModel} from '../../PieModel';
import { PromptConfig } from '../../PromptConfig';
import { CommonConfigSettings } from '../../CommonConfigSettings';

type RulerPieMetric = 'mm' | 'cm' | 'm' | 'km';
type RulerPieImperial = 'in' | 'ft' | 'yd' | 'm';
/**
* Model for the @pie-elements/ruler
* @additionalProperties false
*/
export interface RulerPie extends PieModel {
    /** Type of the ruler */
    measure: 'imperial' | 'metric';

    /**
     * Ruler label
     * for measure: imperial it can be 'in' | 'ft' | 'yd' | 'm'
     * for measure: metric it can be ''mm' | 'cm' | 'm' | 'km' |
     */
    label: RulerPieMetric | RulerPieImperial;

    /** Number of ticks to display if metric is imperial
     * @default is 8
     */
    imperialTicks?: 16 | 8 | 4 ;

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
