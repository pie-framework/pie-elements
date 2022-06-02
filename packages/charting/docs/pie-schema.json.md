Model Object for @pie-elements/charting

The schema defines the following properties:

# `addCategoryEnabled` (boolean, required)

Indicates if user can add more categories

# `categoryDefaultLabel` (string, required)

Indicates default value for a new category's label

# `chartType` (string, enum, required)

This element must be one of the following enum values:

* `bar`
* `dorPlot`
* `histogram`
* `lineCross`
* `lineDot`
* `linePlot`

# `correctAnswer` (object, required)

Properties of the `correctAnswer` object:

## `name` (string, required)

Indicates name of answer

## `data` (array, required)

Indicates marks for the answer

Additional restrictions:

* Minimum items: `1`

# `data` (array, required)

Indicates default categories for the answer

Additional restrictions:

* Minimum items: `1`

# `domain` (object, required)

Properties of the `domain` object:

## `min` (number, required)

Min value

## `max` (number, required)

Max value

## `step` (number, required)

Step value

## `labelStep` (number, required)

Label step value

## `axisLabel` (string, required)

Axis Label

# `editCategoryEnabled` (boolean, required)

Indicates if user can edit default categories

# `graph` (object, required)

Properties of the `graph` object:

## `width` (number, required)

Width for chart representation

## `height` (number, required)

Height for chart representation

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

* `all or nothing`
* `partial scoring`

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `title` (string)

Indicates chart title

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

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

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `Answer` (object)

Properties of the `Answer` object:

### `name` (string, required)

Indicates name of answer

### `data` (array, required)

Indicates marks for the answer

Additional restrictions:

* Minimum items: `1`

## `Category` (object)

Properties of the `Category` object:

### `label` (string, required)

Indicates category label

### `value` (number, required)

Indicates category value

### `interactive` (boolean, required)

Indicates if category label & value are interactive

### `editable` (boolean, required)

Indicates if category label is editable

### `deletable` (boolean, required)

Indicates if category is deletable

### `correctness` (object, required)

Indicates correctness for a category

Properties of the `correctness` object:

#### `value` (string, enum, required)

This element must be one of the following enum values:

* `correct`
* `incorrect`

#### `label` (string, enum, required)

This element must be one of the following enum values:

* `correct`
* `incorrect`

## `ChartSettings` (object)

Properties of the `ChartSettings` object:

### `min` (number, required)

Min value

### `max` (number, required)

Max value

### `step` (number, required)

Step value

### `labelStep` (number, required)

Label step value

### `axisLabel` (string, required)

Axis Label

## `Chart` (object)

Properties of the `Chart` object:

### `width` (number, required)

Width for chart representation

### `height` (number, required)

Height for chart representation