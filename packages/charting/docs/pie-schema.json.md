Model Object for @pie-elements/charting

The schema defines the following properties:

# `addCategoryEnabled` (boolean, required)

Indicates if user can add more categories

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

# `placeholderMessages` (object)

Properties of the `placeholderMessages` object:

## `title` (string, required)

Indicates placeholder message if title is not defined

## `labels` (string, required)

Indicates placeholder message if labels for range or domain are not defined

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `rubricEnabled` (boolean, required)

Indicates if Rubric is enabled

# `changeInteractiveEnabled` (boolean, required)

Indicates if teacher can enable/disable data[]:interactive

# `changeEditableEnabled` (boolean, required)

Indicates if teacher can enable/disable data[]:editable

# `changeAddCategoryEnabled` (boolean, required)

Indicates if teacher can enable/disable addCategoryEnabled

# `studentNewCategoryDefaultLabel` (string, required)

Label for new category in correct response and player's chart

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

## `LabelsPlaceholderConfigProp` (object)

Properties of the `LabelsPlaceholderConfigProp` object:

### `top` (string)

This value is empty for charting. The property exist in order to be consistent with graphing configuration.

### `right` (string)

This value is empty for charting. The property exist in order to be consistent with graphing configuration.

### `bottom` (string)

Indicates the placeholder for the bottom label

### `left` (string)

Indicates the placeholder for the left label

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `AuthorNewCategoryDefaults` (object)

Properties of the `AuthorNewCategoryDefaults` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the new category

### `interactive` (boolean)

Indicates if new category is interactive

### `editable` (boolean)

Indicates if new category is editable

## `ConfigureMathMLProp` (object)

Properties of the `ConfigureMathMLProp` object:

### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

## `ConfigureMaxImageDimensionsProp` (object)

Properties of the `ConfigureMaxImageDimensionsProp` object:

### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

### `rationale` (number)

Indicates the max dimension for images in rationale

## `ChartingOptions` (object)

Properties of the `ChartingOptions` object:

### `changeInteractive` (object)

Properties of the `changeInteractive` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `authoringLabel` (string)

Indicates the label for the option

#### `settingsLabel` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `changeEditable` (object)

Properties of the `changeEditable` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `authoringLabel` (string)

Indicates the label for the option

#### `settingsLabel` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `addCategory` (object)

Properties of the `addCategory` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `authoringLabel` (string)

Indicates the label for the option

#### `settingsLabel` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `ChartingOption` (object)

Properties of the `ChartingOption` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `authoringLabel` (string)

Indicates the label for the option

### `settingsLabel` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `AvailableChartTypes` (object)

Properties of the `AvailableChartTypes` object:

### `bar` (string, required)

Indicates if bar chart is available and the label used for it.

### `histogram` (string, required)

Indicates if histogram is available and the label used for it.

### `lineDot` (string, required)

Indicates if line chart with dots is available and the label used for it.

### `lineCross` (string, required)

Indicates if line chart with crosses is available and the label used for it.

### `dotPlot` (string, required)

Indicates if dot plot is available and the label used for it.

### `linePlot` (string, required)

Indicates if line plot is available and the label used for it.

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

Indicates if category value is interactive

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

## `Placeholder` (object)

Properties of the `Placeholder` object:

### `title` (string, required)

Indicates placeholder message if title is not defined

### `labels` (string, required)

Indicates placeholder message if labels for range or domain are not defined