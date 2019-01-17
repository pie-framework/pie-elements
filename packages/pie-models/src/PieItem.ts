import { PieModel } from "./PieModel";

export interface PieItem {
  /**
   * Set of elements to include in the pie, provided in the format `{'element-name': 'mpm-package-name'}`
   */
  elements: PieItemElement;

  /** Models for each PIE included in the item */
  models: [PieModel]
}


interface PieItemElement { 
  [elementName: string]: string 
};
