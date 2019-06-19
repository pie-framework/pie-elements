NOTE: teacherInstructions, studentInstructions, rationale, rubric & autoScoring
functionalities are not defined yet - the value for those can belong to
model or to configuration (to be moved when the functionality is defined)
Model for the @pie-elements/explicit-constructed-response

The schema defines the following properties:

# `choices` (object, required)

* Object with all the available choices for each response area.
* Keys need to be integers from 0 to n - 1 (where n is the number of areas)

# `markup` (string, required)

The markup for the pie-ui element

# `prompt` (string)

The item stem for the question

# `rationale` (string, required)

Indicates correct answer rationale

# `autoScoring` (string, enum, required)

Indicates auto scoring type

This element must be one of the following enum values:

* `allOrNothing`
* `partial`

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