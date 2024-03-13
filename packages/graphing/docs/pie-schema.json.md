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

# `defaultGridConfiguration` (object, required)

An object that represents a number of any kind. All JavaScript numbers are 64-bit floating-point numbers.

# `coordinatesOnHover` (boolean)

Indicates if coordinates of a point are displayed on hover

# `defaultTool` (string, enum, required)

Indicates the default selected tool for the graph

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

# `labelsEnabled` (boolean)

Indicates if the graph labels are displayed

# `dimensionsEnabled` (boolean)

Indicates if the graph dimensions are displayed

# `titleEnabled` (boolean)

Indicates if the graph title is displayed

# `toolbarTools` (array)

Indicates the tools that have to be displayed in toolbar

Additional restrictions:

* Minimum items: `1`

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

## `EditableHtmlConfigureProp` (object)

Properties of the `EditableHtmlConfigureProp` object:

### `audio` (object)

Properties of the `audio` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `video` (object)

Properties of the `video` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `image` (object)

Properties of the `image` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `EditableHtmlButtonConfigure` (object)

Properties of the `EditableHtmlButtonConfigure` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `AuthoringConfigProp` (object)

Properties of the `AuthoringConfigProp` object:

### `settings` (boolean)

Indicates if the item is displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that is displayed in the Settings Panel

### `enabled` (boolean)

Indicates if the Grid Setup Panel is displayed

### `includeAxesEnabled` (boolean)

Indicates if the "includeAxes" toggle is displayed in the Grid Setup Panel

### `standardGridEnabled` (boolean)

Indicates if the "standardGrid" toggle is displayed in the Grid Setup Panel

### `min` (object)

Properties of the `min` object:

#### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

#### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

### `max` (object)

Properties of the `max` object:

#### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

#### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

### `axisLabel` (object)

Properties of the `axisLabel` object:

#### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

#### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

### `step` (object)

Properties of the `step` object:

#### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

#### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

### `labelStep` (object)

Properties of the `labelStep` object:

#### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

#### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

## `GridPanelConfigProp` (object)

Properties of the `GridPanelConfigProp` object:

### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

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

## `DimensionsConfigProp` (object)

Properties of the `DimensionsConfigProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates if the graph dimensions are included in the Grid Setup Panel

### `min` (number)

Indicates the minimum value for the graph width and height

### `max` (number)

Indicates the maximum value for the graph width and height

### `step` (number)

Indicates the increase/decrease value for the graph width and height

## `GridConfigurationsProp` (object)

Properties of the `GridConfigurationsProp` object:

### `label` (string)

Indicates the label for the configuration

### `arrows` (object)

Properties of the `arrows` object:

#### `left` (boolean, required)

Indicates if left arrow is enabled

#### `right` (boolean, required)

Indicates if right arrow is enabled

#### `up` (boolean, required)

Indicates if up arrow is enabled

#### `down` (boolean, required)

Indicates if down arrow is enabled

### `domain` (object, required)

Properties of the `domain` object:

#### `min` (number, required)

Min value

#### `max` (number, required)

Max value

#### `padding` (number, required)

Padding value

#### `step` (number, required)

Step value

#### `labelStep` (number, required)

Label step value

#### `axisLabel` (string, required)

Axis Label

### `graph` (object, required)

Properties of the `graph` object:

#### `width` (number, required)

Width for graph representation

#### `height` (number, required)

Height for graph representation

### `includeAxes` (boolean)

Indicates if the graph axes and labels are enabled

### `labels` (object)

Properties of the `labels` object:

#### `top` (string, required)

Label for top side of the graph

#### `bottom` (string, required)

Label for bottom side of the graph

#### `left` (string, required)

Label for left side of the graph

#### `right` (string, required)

Label for right side of the graph

### `padding` (boolean)

Indicates if padding is enabled

### `range` (object, required)

Properties of the `range` object:

#### `min` (number, required)

Min value

#### `max` (number, required)

Max value

#### `padding` (number, required)

Padding value

#### `step` (number, required)

Step value

#### `labelStep` (number, required)

Label step value

#### `axisLabel` (string, required)

Axis Label

### `standardGrid` (boolean)

Indicates if some domain values will be synched to the range values

### `title` (string)

Indicates graph title

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

## `LabelsConfigProp` (object)

Properties of the `LabelsConfigProp` object:

### `top` (string)

Indicates the placeholder for the top label

### `right` (string)

Indicates the placeholder for the right label

### `bottom` (string)

Indicates the placeholder for the bottom label

### `left` (string)

Indicates the placeholder for the left label

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `ConfigureLanguageOptionsProp` (object)

Properties of the `ConfigureLanguageOptionsProp` object:

### `value` (string, required)

Value of the language option

### `label` (string, required)

Label of the language option

## `EditableHtmlPluginConfigureRequired` (object)

Properties of the `EditableHtmlPluginConfigureRequired` object:

### `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

#### `audio` (object)

Properties of the `audio` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `video` (object)

Properties of the `video` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `image` (object)

Properties of the `image` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `required` (boolean)

Indicates if the item is required and the value cannot be empty

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `TitleConfigProp` (object)

Properties of the `TitleConfigProp` object:

### `placeholder` (string)

Indicates the placeholder for the title label

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

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

## `ConfigureMathMLProp` (object)

Properties of the `ConfigureMathMLProp` object:

### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

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

## `Number` (object)

An object that represents a number of any kind. All JavaScript numbers are 64-bit floating-point numbers.