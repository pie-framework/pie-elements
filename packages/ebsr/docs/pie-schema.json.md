NOTE: teacherInstructions, studentInstructions, rationale & rubric
functionalities are not defined yet - the value for those can belong to
model or to configuration (to be moved when the functionality is defined)
Model for the EBSR Interaction

The schema defines the following properties:

# `partA` (object, required)

Properties of the `partA` object:

## `choiceMode` (string, enum, required)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

## `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct

## `choicePrefix` (string, enum, required)

What key should be displayed before choices.

This element must be one of the following enum values:

* `letters`
* `numbers`

## `partialScoring` (boolean)

Indicates if partial scoring should be used

## `prompt` (string, required)

The question prompt or item stem

## `promptEnabled` (boolean)

Indicates if the prompt is enabled

## `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

## `studentInstructions` (string)

Indicates student instructions

## `teacherInstructions` (string)

Indicates teacher instructions

## `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

## `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

## `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

## `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `partB` (object, required)

Properties of the `partB` object:

## `choiceMode` (string, enum, required)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

## `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct

## `choicePrefix` (string, enum, required)

What key should be displayed before choices.

This element must be one of the following enum values:

* `letters`
* `numbers`

## `partialScoring` (boolean)

Indicates if partial scoring should be used

## `prompt` (string, required)

The question prompt or item stem

## `promptEnabled` (boolean)

Indicates if the prompt is enabled

## `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

## `studentInstructions` (string)

Indicates student instructions

## `teacherInstructions` (string)

Indicates teacher instructions

## `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

## `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

## `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

## `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `partLabels` (boolean, required)

Indicates if part labels should be displayed

# `partLabelType` (string, enum, required)

Indicates what type should have part labels if they are enabled

This element must be one of the following enum values:

* `Letters`
* `Numbers`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `PartConfiguration` (object)

Properties of the `PartConfiguration` object:

### `addChoiceButton` (object)

Properties of the `addChoiceButton` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `choiceMode` (object)

Properties of the `choiceMode` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `choicePrefix` (object)

Properties of the `choicePrefix` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `deleteChoice` (object)

Properties of the `deleteChoice` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `feedback` (object)

Properties of the `feedback` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `lockChoiceOrder` (object)

Properties of the `lockChoiceOrder` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `partialScoring` (object)

Properties of the `partialScoring` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `prompt` (object)

Properties of the `prompt` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `rationale` (object)

Properties of the `rationale` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `scoringType` (object)

Properties of the `scoringType` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `studentInstructions` (object)

Properties of the `studentInstructions` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `teacherInstructions` (object)

Properties of the `teacherInstructions` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

#### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `Part` (object)

Properties of the `Part` object:

### `choiceMode` (string, enum, required)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

### `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `value` (string, required)

The value for the choice

#### `label` (string, required)

The label of the choice

#### `correct` (boolean)

Indicates if choice is correct

### `choicePrefix` (string, enum, required)

What key should be displayed before choices.

This element must be one of the following enum values:

* `letters`
* `numbers`

### `partialScoring` (boolean)

Indicates if partial scoring should be used

### `prompt` (string, required)

The question prompt or item stem

### `promptEnabled` (boolean)

Indicates if the prompt is enabled

### `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

### `studentInstructions` (string)

Indicates student instructions

### `teacherInstructions` (string)

Indicates teacher instructions

### `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

### `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

### `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

### `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

## `Choice` (object)

Properties of the `Choice` object:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct