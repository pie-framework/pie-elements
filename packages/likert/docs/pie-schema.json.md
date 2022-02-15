Model for the Likert Interaction

The schema defines the following properties:

# `likertScale` (string, enum)

Indicates the likert scale

This element must be one of the following enum values:

* `likert3`
* `likert5`
* `likert7`

# `likertType` (string, enum)

Indicates the likert type

This element must be one of the following enum values:

* `agreement`
* `frequency`
* `importance`
* `like`
* `likelihood`
* `yesNo`

# `likertOrientation` (string, enum)

Indicates the likert type

This element must be one of the following enum values:

* `horizontal`
* `vertical`

# `choices` (array, required)

The choice options for the question

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `value` (string, required)

the value that will be stored if this likert choice is selected

## `label` (string, required)

the text label that will be presented to the user for this likert choice

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled

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

## `LikertChoice` (object)

Properties of the `LikertChoice` object:

### `value` (string, required)

the value that will be stored if this likert choice is selected

### `label` (string, required)

the text label that will be presented to the user for this likert choice