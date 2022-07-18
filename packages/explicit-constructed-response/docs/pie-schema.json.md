Model for the @pie-elements/explicit-constructed-response

The schema defines the following properties:

# `choices` (object, required)

* Object with all the available choices for each response area.
* Keys need to be integers from 0 to n - 1 (where n is the number of areas)

# `displayType` (string, required)

The type of display the container of the pie-ui element will be used

# `markup` (string, required)

The markup for the pie-ui element

# `prompt` (string)

The item stem for the question

# `promptEnabled` (boolean)

Indicates if the prompt is enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `playerSpellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the player. Default value is true

# `rationale` (string, required)

Indicates correct answer rationale

# `autoScoring` (string, enum, required)

Indicates auto scoring type

This element must be one of the following enum values:

* `allOrNothing`
* `partial`

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `rubric` (string, required)

Indicates value for rubric

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `note` (string)

Indicates the note for the answer

# `toolbarEditorPosition` (string, enum)

Indicates the editor's toolbar position which can be 'bottom' or 'top'

This element must be one of the following enum values:

* `bottom`
* `top`

Default: `": 'bottom'"`

# `maxLengthPerChoice` (array)

Indicates the maximum length for each response area

The object is an array with all elements of the type `number`.

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

## `ConfigureMaxImageDimensionsProp` (object)

Properties of the `ConfigureMaxImageDimensionsProp` object:

### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

### `rationale` (number)

Indicates the max dimension for images in rationale

## `Choice` (object)

Properties of the `Choice` object:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice