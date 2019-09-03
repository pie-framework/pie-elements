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

## `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

## `studentInstructions` (string)

Indicates student instructions

## `teacherInstructions` (string)

Indicates teacher instructions

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

## `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

## `studentInstructions` (string)

Indicates student instructions

## `teacherInstructions` (string)

Indicates teacher instructions

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

### `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

### `studentInstructions` (string)

Indicates student instructions

### `teacherInstructions` (string)

Indicates teacher instructions

## `Choice` (object)

Properties of the `Choice` object:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct