NOTE: teacherInstructions, studentInstructions, rationale & scoringType
functionalities are not defined yet - the value for those can belong to
model or to configure (to be moved when the functionality is defined)
Model for the @pie-elements/match Interaction

The schema defines the following properties:

# `enableImages` (boolean)

Indicates if questions can contain images

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `headers` (array, required)

Array of strings for column headers

The object is an array with all elements of the type `string`.

# `layout` (number, required)

The number of columns to be presented

# `lockChoiceOrder` (boolean)

Indicates if the order of the rows should be randomly sorted on render

# `partialScoring` (boolean)

Indicates if partial scoring should be used

# `choiceMode` (string, enum)

Indicates if the control for responses should be single (radio) or multiple (checkbox)

This element must be one of the following enum values:

* `checkbox`
* `radio`

# `prompt` (string, required)

The question prompt or item stem

# `rows` (array, required)

The rows of choices to be presented.

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string,number, required)

Identifier for a row

## `title` (string, required)

Title that will be displayed for the row

## `values` (array, required)

Array of boolean values indicating which columns are selected in the row

The object is an array with all elements of the type `boolean`.

# `rationale` (string, required)

Indicates value for rationale

# `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `ComplexFeedbackType` (object)

Properties of the `ComplexFeedbackType` object:

### `correct` (, required)

Indicates the configuration for feedback when answer is correct

### `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

### `partial`

Indicates the configuration for feedback when answer is partially correct

## `DefaultFeedbackType` (object)

Properties of the `DefaultFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

### `default` (string)

Indicates the feedback value

## `CustomFeedbackType` (object)

Properties of the `CustomFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `custom`

### `custom` (string, required)

Indicates the feedback custom value

## `MatchRow` (object)

One row in the match list.

Properties of the `MatchRow` object:

### `id` (string,number, required)

Identifier for a row

### `title` (string, required)

Title that will be displayed for the row

### `values` (array, required)

Array of boolean values indicating which columns are selected in the row

The object is an array with all elements of the type `boolean`.