Model for the @pie-elements/drawing-response Interaction

The schema defines the following properties:

# `prompt` (string)

The question prompt or item stem

# `promptEnabled` (boolean)

Indicates if the prompt is enabled

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

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `backgroundImageEnabled` (boolean, required)

Indicates if Background Image is enabled

# `toolbarEditorPosition` (string, enum)

Indicates the editor's toolbar position which can be 'bottom' or 'top'

This element must be one of the following enum values:

* `bottom`
* `top`

Default: `": 'bottom'"`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

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

## `Dimension` (object)

Properties of the `Dimension` object:

### `height` (number, required)

the height of the section

### `width` (number, required)

the width of the section