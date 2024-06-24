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

Indicates if teacher can enable/disable data[]:interactive. Default value is false

# `changeEditableEnabled` (boolean, required)

Indicates if teacher can enable/disable data[]:editable. Default value is false

# `changeAddCategoryEnabled` (boolean, required)

Indicates if teacher can enable/disable addCategoryEnabled. Default value is false

# `studentNewCategoryDefaultLabel` (string, required)

Label for new category in correct response and player's chart

# `language` (string)

Indicates the language of the component
Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `EditableHtmlConfigureProp` (object)

Properties of the `EditableHtmlConfigureProp` object:

### `math` (object)

Properties of the `math` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

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

### `customPlugins` (array)

An array of objects that determine custom plugins.
A custom plugin is an object which determines how the button will look like (icon) and the event name that will be triggered when button gets pressed (event).
Example can be found at https://github.com/pie-framework/pie-lib/blob/develop/packages/demo/pages/editable-html.js#L425.

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `event` (string, required)

The name of the custom event. It needs to be valid (only letters, numbers and "_" can be used).
PIE will emit the event prefixed with "PIE-".
Eg: event = 'client_custom_event_A' => the emitted event will be "PIE-client_custom_event_A"

#### `iconAlt` (string, required)

The alt for the custom button icon

#### `iconType` (string, required)

The icon type.
Currently, only "SVG" is supported.

#### `icon` (string, required)

The icon string. Currently, only "SVG" is supported, so it needs to be a valid svg.

### `blockquote` (object)

Properties of the `blockquote` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `h3` (object)

Properties of the `h3` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `EditableHtmlButtonConfigure` (object)

Properties of the `EditableHtmlButtonConfigure` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `CustomPlugin` (object)

Properties of the `CustomPlugin` object:

### `event` (string, required)

The name of the custom event. It needs to be valid (only letters, numbers and "_" can be used).
PIE will emit the event prefixed with "PIE-".
Eg: event = 'client_custom_event_A' => the emitted event will be "PIE-client_custom_event_A"

### `iconAlt` (string, required)

The alt for the custom button icon

### `iconType` (string, required)

The icon type.
Currently, only "SVG" is supported.

### `icon` (string, required)

The icon string. Currently, only "SVG" is supported, so it needs to be a valid svg.

## `EditableHtmlPluginConfigureRequired` (object)

Properties of the `EditableHtmlPluginConfigureRequired` object:

### `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

#### `math` (object)

Properties of the `math` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

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

#### `customPlugins` (array)

An array of objects that determine custom plugins.
A custom plugin is an object which determines how the button will look like (icon) and the event name that will be triggered when button gets pressed (event).
Example can be found at https://github.com/pie-framework/pie-lib/blob/develop/packages/demo/pages/editable-html.js#L425.

The object is an array with all elements of the type `object`.

The array object has the following properties:

##### `event` (string, required)

The name of the custom event. It needs to be valid (only letters, numbers and "_" can be used).
PIE will emit the event prefixed with "PIE-".
Eg: event = 'client_custom_event_A' => the emitted event will be "PIE-client_custom_event_A"

##### `iconAlt` (string, required)

The alt for the custom button icon

##### `iconType` (string, required)

The icon type.
Currently, only "SVG" is supported.

##### `icon` (string, required)

The icon string. Currently, only "SVG" is supported, so it needs to be a valid svg.

#### `blockquote` (object)

Properties of the `blockquote` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `h3` (object)

Properties of the `h3` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `required` (boolean)

Indicates if the item is required and the value cannot be empty

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

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

## `ConfigureLanguageOptionsProp` (object)

Properties of the `ConfigureLanguageOptionsProp` object:

### `value` (string, required)

Value of the language option

### `label` (string, required)

Label of the language option

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