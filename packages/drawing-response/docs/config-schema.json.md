Config Object for @pie-elements/drawing-response

The schema defines the following properties:

# `backgroundImage` (object)

Properties of the `backgroundImage` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

# `partialScoring` (object)

Properties of the `partialScoring` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `spellCheck` (object)

Properties of the `spellCheck` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `studentInstructions` (object)

Properties of the `studentInstructions` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `teacherInstructions` (object)

Properties of the `teacherInstructions` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `maxImageWidth` (object)

Properties of the `maxImageWidth` object:

## `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

## `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

## `rationale` (number)

Indicates the max dimension for images in rationale

# `maxImageHeight` (object)

Properties of the `maxImageHeight` object:

## `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

## `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

## `rationale` (number)

Indicates the max dimension for images in rationale

# `withRubric` (object)

Properties of the `withRubric` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

# `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

---

# Sub Schemas

The schema defines the following additional types:

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `ConfigureMaxImageDimensionsProp` (object)

Properties of the `ConfigureMaxImageDimensionsProp` object:

### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

### `rationale` (number)

Indicates the max dimension for images in rationale