NOTE: teacherInstructions, studentInstructions, rationale & rubric
functionalities are not defined yet - the value for those can belong to
model or to configuration (to be moved when the functionality is defined)
Model for the @pie-elements/drag-in-the-blank

The schema defines the following properties:

# `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `value` (string, required)

The value for the choice

## `label` (string, required)

The label of the choice

## `correct` (boolean)

Indicates if choice is correct

# `choicesPosition` (string, enum)

This element must be one of the following enum values:

* `above`
* `below`
* `left`
* `right`

# `correctResponse` (object, required)

Object containing the correct answer for each response area

# `alternateResponses` (array)

Array of alternatives correct choices

The object is an array with all elements of the type `array`.

# `duplicates` (boolean)

Indicates if duplicates are enabled

# `markup` (string, required)

The markup for the pie-ui element

# `prompt` (string)

The item stem for the question

# `rationale` (string, required)

Indicates correct answer rationale

# `studentInstructions` (boolean, required)

Indicates if student instructions are enabled

# `teacherInstructions` (boolean, required)

Indicates if teacher instructions are enabled

# `rubric` (string, required)

Indicates value for rubric

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

Indicates if the item has to be displayed

### `label` (string)

Indicates the label for the item

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

## `Choice` (object)

Properties of the `Choice` object:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct

## `ChoicesPosition` (string)