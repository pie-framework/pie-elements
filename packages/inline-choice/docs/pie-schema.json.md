Model for the @pie-elements/inline-choice Interaction

The schema defines the following properties:

# `defaultLang` (string)

Default language

# `choiceLabel` (string)

Text to display in the dropdown

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