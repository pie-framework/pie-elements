NOTE: There's no functionality described for studentInstructions
so there's no implementation (they are only added in model)
Model Object for @pie-elements/charting

The schema defines the following properties:

# `addCategoryEnabled` (object, required)

# `categoryDefaultLabel` (object, required)

Allows manipulation and formatting of text strings and determination and location of substrings within strings.

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

# `editCategoryEnabled` (object, required)

# `graph` (object, required)

Properties of the `graph` object:

## `width` (number, required)

Width for chart representation

## `height` (number, required)

Height for chart representation

# `prompt` (string)

Indicates prompt value

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

# `studentInstructions` (boolean)

Indicates if student instructions are enabled

# `teacherInstructions` (boolean)

Indicates if teacher instructions are enabled

# `title` (string)

Indicates chart title

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

## `Boolean` (object)

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

### `initial` (boolean, required)

Indicates if category is default category

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