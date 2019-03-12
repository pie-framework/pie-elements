Model for the Choice Interaction

The schema defines the following properties:

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

# `prompt` (string)

The question prompt or item stem

# `keyMode` (string, enum)

What key should be displayed before choices. If undefined no  key will be displayed.

This element must be one of the following enum values:

* `letters`
* `numbers`

# `choiceMode` (string, enum)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

# `shuffle` (boolean)

Indicates the order of choices should be randdomly ordered when presented to user

# `partialScoring` (boolean, required)

Indicates that the item should use partial scoring

# `partialScoringLabel` (string)

The label for partial scoring

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

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