NOTE: teacherInstructions, studentInstructions, rationale & scoringType
functionalities are not defined yet - the value for those can belong to
model or to configuration (to be moved when the functionality is defined)
Model for the @pie-elements/inline-dropdown

The schema defines the following properties:

# `choices` (object, required)

* Object with all the available choices for each response area.
* Keys need to be integers from 0 to n - 1 (where n is the number of areas)

# `alternateResponses` (object, required)

Object that contains values that are right as well, besides the main one

# `markup` (string, required)

The markup for the pie-ui element

# `prompt` (string)

The item stem for the question

# `lockChoiceOrder` (boolean, required)

Indicates if the user can lock the order of the choices

# `partialScoring` (boolean, required)

Indicates if partialScoring is enabled

# `rationale` (string, required)

Indicates correct answer rationale

# `scoringType` (string, enum, required)

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

## `Choice` (object)

Properties of the `Choice` object:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct