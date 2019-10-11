Model for the Choice Interaction

The schema defines the following properties:

# `choiceMode` (string, enum)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

# `choicePrefix` (string, enum)

What key should be displayed before choices. If undefined no  key will be displayed.

This element must be one of the following enum values:

* `letters`
* `numbers`

# `choices` (array, required)

The choice options for the question

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `correct` (boolean)

Indicates if the choice is correct

## `value` (string, required)

the value that will be stored if this choice is selected

## `label` (string, required)

the text label that will be presented to the user for this choice

## `feedback` (object)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

Properties of the `feedback` object:

### `type` (string, enum, required)

This element must be one of the following enum values:

* `custom`
* `default`
* `none`

Default: `"default"`

### `value` (string)

Value for feedback

### `custom` (string)

Custom value for feedback

## `rationale` (string)

Rationale for the Choice

# `prompt` (string)

The question prompt or item stem

# `promptEnabled` (boolean)

Determines if prompt should show

# `lockChoiceOrder` (boolean)

Indicates the order of choices should be randomly ordered when presented to user

# `partialScoring` (boolean)

Indicates that the item should use partial scoring

# `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `feedbackEnabled` (boolean, required)

Indicates if feedback is enabled

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

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `Choice` (object)

Properties of the `Choice` object:

### `correct` (boolean)

Indicates if the choice is correct

### `value` (string, required)

the value that will be stored if this choice is selected

### `label` (string, required)

the text label that will be presented to the user for this choice

### `feedback` (object)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

Properties of the `feedback` object:

#### `type` (string, enum, required)

This element must be one of the following enum values:

* `custom`
* `default`
* `none`

Default: `"default"`

#### `value` (string)

Value for feedback

#### `custom` (string)

Custom value for feedback

### `rationale` (string)

Rationale for the Choice

## `Feedback` (object)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

Properties of the `Feedback` object:

### `type` (string, enum, required)

This element must be one of the following enum values:

* `custom`
* `default`
* `none`

Default: `"default"`

### `value` (string)

Value for feedback

### `custom` (string)

Custom value for feedback