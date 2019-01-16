import {Choice}  from '../../Choice';


enum KeyMode {
  /** keyed with letters */
  letters = 'letters', 
  /** keyed with numbers */
  numbers = 'numbers' 
} 

enum ChoiceMode {
  checkbox, // user can select multiple choices
  radio // user can  select one choice
}

/**
* Model for the Choice Interaction
*/
export interface MultipleChoicePie {
  
  /** The choice options for the question */
  choices: Choice[];
  
  /**  The question prompt or item stem*/
  prompt?: string;
  
  /** What key should be displayed before choices. If undefined no  key will be displayed.  */
  keyMode?: KeyMode; 
  
  /** Indicates the choices are single or multiple selection */
  choiceMode?: ChoiceMode;
  
}





