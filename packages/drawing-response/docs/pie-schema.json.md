NOTE: teacherInstructions, studentInstructions and rationale
functionalities are not defined yet - the value for those can belong to
model or to configuration (to be moved when the functionality is defined)
Model for the @pie-elements/drawing-response Interaction

The schema defines the following properties:

# `prompt` (string)

The question prompt or item stem

# `imageUrl` (string)

The image over which shapes, patterns and texts will be added

# `imageDimensions` (array, required)

The dimensions of the image

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `height` (number, required)

the height of the section

## `width` (number, required)

the width of the section

# `studentInstructions` (boolean)

Indicates if student instructions are enabled

# `teacherInstructions` (boolean)

Indicates if teacher instructions are enabled

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

## `Dimension` (object)

Properties of the `Dimension` object:

### `height` (number, required)

the height of the section

### `width` (number, required)

the width of the section