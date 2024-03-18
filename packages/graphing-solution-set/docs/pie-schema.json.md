Model Object for

The schema defines the following properties:

# `answers` (object, required)

Indicates marks that are set as answers

Properties of the `answers` object:

## `correctAnswer` (object, required)

Properties of the `correctAnswer` object:

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

# `defaultGridConfiguration` (object, required)

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

# `gssLineData` (object, required)

Properties of the `gssLineData` object:

## `numberOfLines` (number, required)

Indicates number of lines for GSS item

## `selectedTool` (string, enum, required)

Indicates selected tool default is lineA

This element must be one of the following enum values:

* `lineA`
* `lineB`
* `solutionSet`

## `sections` (array, required)

Indicates array of polygons points formed by intersection of lines drawn

Additional restrictions:

* Minimum items: `1`

## `lineA` (object, required)

Properties of the `lineA` object:

### `lineType` (string, enum, required)

Indicates if line is Solid or Dashed

This element must be one of the following enum values:

* `Dashed`
* `Solid`

## `lineB` (object, required)

Properties of the `lineB` object:

### `lineType` (string, enum, required)

Indicates if line is Solid or Dashed

This element must be one of the following enum values:

* `Dashed`
* `Solid`

# `includeAxes` (boolean)

Indicates if the graph axes and labels are enabled

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

# `language` (string)

Indicates the language of the component
Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX

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

# `scoringType` (string)

Indicates scoring type

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `title` (string)

Indicates graph title

# `labelsEnabled` (boolean)

Indicates if the graph labels are displayed

# `dimensionsEnabled` (boolean)

Indicates if the graph dimensions are displayed

# `titleEnabled` (boolean)

Indicates if the graph title is displayed

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `standardGrid` (boolean)

Indicates if some domain values will be synched to the range values

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `rubricEnabled` (boolean, required)

Indicates if Rubric is enabled

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

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

### `type` (string, required)

Indicates type of mark

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

## `Number` (object)

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

## `GssLineData` (object)

Properties of the `GssLineData` object:

### `numberOfLines` (number, required)

Indicates number of lines for GSS item

### `selectedTool` (string, enum, required)

Indicates selected tool default is lineA

This element must be one of the following enum values:

* `lineA`
* `lineB`
* `solutionSet`

### `sections` (array, required)

Indicates array of polygons points formed by intersection of lines drawn

Additional restrictions:

* Minimum items: `1`

### `lineA` (object, required)

Properties of the `lineA` object:

#### `lineType` (string, enum, required)

Indicates if line is Solid or Dashed

This element must be one of the following enum values:

* `Dashed`
* `Solid`

### `lineB` (object, required)

Properties of the `lineB` object:

#### `lineType` (string, enum, required)

Indicates if line is Solid or Dashed

This element must be one of the following enum values:

* `Dashed`
* `Solid`

## `LineType` (object)

Properties of the `LineType` object:

### `lineType` (string, enum, required)

Indicates if line is Solid or Dashed

This element must be one of the following enum values:

* `Dashed`
* `Solid`

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