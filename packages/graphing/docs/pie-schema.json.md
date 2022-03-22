Model Object for @pie-elements/graphing

The schema defines the following properties:

# `answers` (object, required)

Indicates marks that are set as answers; Note: alternates can be added having this form: alternateIndex

Properties of the `answers` object:

## `correctAnswer` (object, required)

Properties of the `correctAnswer` object:

### `name` (string, required)

Indicates name of answer

### `marks` (array, required)

Indicates marks for the answer

Additional restrictions:

* Minimum items: `1`

## `alternate1` (object, required)

Properties of the `alternate1` object:

### `name` (string, required)

Indicates name of answer

### `marks` (array, required)

Indicates marks for the answer

Additional restrictions:

* Minimum items: `1`

# `arrows` (object)

Properties of the `arrows` object:

## `left` (boolean, required)

Indicates if left arrow is enabled

## `right` (boolean, required)

Indicates if right arrow is enabled

## `up` (boolean, required)

Indicates if up arrow is enabled

## `down` (boolean, required)

Indicates if down arrow is enabled

# `backgroundMarks` (array, required)

Indicates marks that have to be displayed in background

Additional restrictions:

* Minimum items: `1`

# `coordinatesOnHover` (boolean)

Indicates if coordinates of a point are displayed on hover

# `domain` (object, required)

Properties of the `domain` object:

## `min` (number, required)

Min value

## `max` (number, required)

Max value

## `padding` (number, required)

Padding value

## `step` (number, required)

Step value

## `labelStep` (number, required)

Label step value

## `axisLabel` (string, required)

Axis Label

# `graph` (object, required)

Properties of the `graph` object:

## `width` (number, required)

Width for graph representation

## `height` (number, required)

Height for graph representation

# `labels` (object)

Properties of the `labels` object:

## `top` (string, required)

Label for top side of the graph

## `bottom` (string, required)

Label for bottom side of the graph

## `left` (string, required)

Label for left side of the graph

## `right` (string, required)

Label for right side of the graph

# `padding` (boolean)

Indicates if padding is enabled

# `prompt` (string)

Indicates prompt value

# `promptEnabled` (boolean)

Indicates if the prompt is enabled

# `range` (object, required)

Properties of the `range` object:

## `min` (number, required)

Min value

## `max` (number, required)

Max value

## `padding` (number, required)

Padding value

## `step` (number, required)

Step value

## `labelStep` (number, required)

Label step value

## `axisLabel` (string, required)

Axis Label

# `rationale` (string)

Indicates rationale for the answer

# `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `dichotomous`
* `partial scoring`

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `title` (string)

Indicates graph title

# `toolbarTools` (array)

Indicates the tools that have to be displayed in toolbar

Additional restrictions:

* Minimum items: `1`

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled

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

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `ArrowsConfigProp` (object)

Properties of the `ArrowsConfigProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `left` (object)

Properties of the `left` object:

#### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

### `right` (object)

Properties of the `right` object:

#### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

### `up` (object)

Properties of the `up` object:

#### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

### `down` (object)

Properties of the `down` object:

#### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

## `ArrowsProp` (object)

Properties of the `ArrowsProp` object:

### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `Answer` (object)

Properties of the `Answer` object:

### `name` (string, required)

Indicates name of answer

### `marks` (array, required)

Indicates marks for the answer

Additional restrictions:

* Minimum items: `1`

## `Mark` (object)

Properties of the `Mark` object:

### `type` (string, enum, required)

Indicates type of mark

This element must be one of the following enum values:

* `circle`
* `line`
* `parabola`
* `point`
* `polygon`
* `ray`
* `segment`
* `sine`
* `vector`

### `showLabel` (boolean)

Indicates if label should be visible

### `label` (string)

Indicates label value for mark

### `building` (boolean, required)

Indicates if mark is in build process

### `x` (number)

Indicates x coordinate if type is point

### `y` (number)

Indicates y coordinate if type is point

### `from` (object)

Properties of the `from` object:

#### `x` (number, required)

Indicates x coordinate

#### `y` (number, required)

Indicates y coordinate

### `to` (object)

Properties of the `to` object:

#### `x` (number, required)

Indicates x coordinate

#### `y` (number, required)

Indicates y coordinate

### `center` (object)

Properties of the `center` object:

#### `x` (number, required)

Indicates x coordinate

#### `y` (number, required)

Indicates y coordinate

### `outerPoint` (object)

Properties of the `outerPoint` object:

#### `x` (number, required)

Indicates x coordinate

#### `y` (number, required)

Indicates y coordinate

### `closed` (boolean)

Indicates if mark is closed if type is polygon, sine

### `points` (array)

Indicates all mark's points if type is polygon

Additional restrictions:

* Minimum items: `1`

### `root` (object)

Properties of the `root` object:

#### `x` (number, required)

Indicates x coordinate

#### `y` (number, required)

Indicates y coordinate

### `edge` (object)

Properties of the `edge` object:

#### `x` (number, required)

Indicates x coordinate

#### `y` (number, required)

Indicates y coordinate

## `Point` (object)

Properties of the `Point` object:

### `x` (number, required)

Indicates x coordinate

### `y` (number, required)

Indicates y coordinate

## `Arrows` (object)

Properties of the `Arrows` object:

### `left` (boolean, required)

Indicates if left arrow is enabled

### `right` (boolean, required)

Indicates if right arrow is enabled

### `up` (boolean, required)

Indicates if up arrow is enabled

### `down` (boolean, required)

Indicates if down arrow is enabled

## `GraphSettings` (object)

Properties of the `GraphSettings` object:

### `min` (number, required)

Min value

### `max` (number, required)

Max value

### `padding` (number, required)

Padding value

### `step` (number, required)

Step value

### `labelStep` (number, required)

Label step value

### `axisLabel` (string, required)

Axis Label

## `Graph` (object)

Properties of the `Graph` object:

### `width` (number, required)

Width for graph representation

### `height` (number, required)

Height for graph representation

## `Labels` (object)

Properties of the `Labels` object:

### `top` (string, required)

Label for top side of the graph

### `bottom` (string, required)

Label for bottom side of the graph

### `left` (string, required)

Label for left side of the graph

### `right` (string, required)

Label for right side of the graph