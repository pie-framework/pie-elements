Config Object for @pie-elements/multiple-choice

The schema defines the following properties:

# `answerChoiceCount` (number)

The number of empty choices to show in config view if no choice model is provided

Default: `4`

Additional restrictions:

* Minimum: `1`

# `addChoiceButton` (object)

Properties of the `addChoiceButton` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `choiceMode` (object, required)

Properties of the `choiceMode` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `choicePrefix` (object, required)

Properties of the `choicePrefix` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `deleteChoice` (object)

Properties of the `deleteChoice` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `feedback` (object)

Properties of the `feedback` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `prompt` (object)

Properties of the `prompt` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `lockChoiceOrder` (object, required)

Properties of the `lockChoiceOrder` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `partialScoring` (object, required)

Properties of the `partialScoring` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `rationale` (object)

Properties of the `rationale` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `scoringType` (object)

Properties of the `scoringType` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `studentInstructions` (object)

Properties of the `studentInstructions` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `teacherInstructions` (object)

Properties of the `teacherInstructions` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

# `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

# `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

---

# Sub Schemas

The schema defines the following additional types:

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed

### `label` (string)

Indicates the label for the item

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)