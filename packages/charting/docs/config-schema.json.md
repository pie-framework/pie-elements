Config Object for @pie-elements/charting

The schema defines the following properties:

# `baseInputConfiguration` (object)

Properties of the `baseInputConfiguration` object:

## `math` (object)

Properties of the `math` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `audio` (object)

Properties of the `audio` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `video` (object)

Properties of the `video` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `image` (object)

Properties of the `image` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `customPlugins` (array)

An array of objects that determine custom plugins.
A custom plugin is an object which determines how the button will look like (icon) and the event name that will be triggered when button gets pressed (event).
Example can be found at https://github.com/pie-framework/pie-lib/blob/develop/packages/demo/pages/editable-html.js#L425.

The object is an array with all elements of the type `object`.

The array object has the following properties:

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

# `prompt` (object)

Properties of the `prompt` object:

## `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

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

## `required` (boolean)

Indicates if the item is required and the value cannot be empty

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `rationale` (object)

Properties of the `rationale` object:

## `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

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

## `required` (boolean)

Indicates if the item is required and the value cannot be empty

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `spellCheck` (object)

Properties of the `spellCheck` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `titlePlaceholder` (object)

Properties of the `titlePlaceholder` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `labelsPlaceholders` (object)

Properties of the `labelsPlaceholders` object:

## `top` (string)

This value is empty for charting. The property exist in order to be consistent with graphing configuration.

## `right` (string)

This value is empty for charting. The property exist in order to be consistent with graphing configuration.

## `bottom` (string)

Indicates the placeholder for the bottom label

## `left` (string)

Indicates the placeholder for the left label

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `scoringType` (object)

Properties of the `scoringType` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

# `studentInstructions` (object)

Properties of the `studentInstructions` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `teacherInstructions` (object)

Properties of the `teacherInstructions` object:

## `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

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

## `required` (boolean)

Indicates if the item is required and the value cannot be empty

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `title` (object)

Properties of the `title` object:

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `instruction` (object)

Properties of the `instruction` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `authorNewCategoryDefaults` (object, required)

Properties of the `authorNewCategoryDefaults` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the new category

## `interactive` (boolean)

Indicates if new category is interactive

## `editable` (boolean)

Indicates if new category is editable

# `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

## `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

## `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

# `maxImageWidth` (object)

Properties of the `maxImageWidth` object:

## `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

## `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

## `rationale` (number)

Indicates the max dimension for images in rationale

# `maxImageHeight` (object)

Properties of the `maxImageHeight` object:

## `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

## `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

## `rationale` (number)

Indicates the max dimension for images in rationale

# `withRubric` (object)

Properties of the `withRubric` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `chartingOptions` (object)

Properties of the `chartingOptions` object:

## `changeInteractive` (object)

Properties of the `changeInteractive` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `authoringLabel` (string)

Indicates the label for the option

### `settingsLabel` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `changeEditable` (object)

Properties of the `changeEditable` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `authoringLabel` (string)

Indicates the label for the option

### `settingsLabel` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `addCategory` (object)

Properties of the `addCategory` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `authoringLabel` (string)

Indicates the label for the option

### `settingsLabel` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `availableChartTypes` (object)

Properties of the `availableChartTypes` object:

## `bar` (string, required)

Indicates if bar chart is available and the label used for it.

## `histogram` (string, required)

Indicates if histogram is available and the label used for it.

## `lineDot` (string, required)

Indicates if line chart with dots is available and the label used for it.

## `lineCross` (string, required)

Indicates if line chart with crosses is available and the label used for it.

## `dotPlot` (string, required)

Indicates if dot plot is available and the label used for it.

## `linePlot` (string, required)

Indicates if line plot is available and the label used for it.

# `chartTypeLabel` (string, required)

Indicates the label for the chart type

# `language` (object)

Properties of the `language` object:

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `languageChoices` (object)

Language choices configuration
Only available if language is enabled

Properties of the `languageChoices` object:

## `label` (string, required)

## `options` (array, required)

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `value` (string, required)

Value of the language option

### `label` (string, required)

Label of the language option

# `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

# `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

# `contentDimensions` (object)

Indicates the dimensions configuration for the authoring container
Note: Some items have a default minimum width because of their content, but if
the minWidth is lower than this, the overflow behavior will take care of that

Properties of the `contentDimensions` object:

## `maxHeight` (string,number)

Indicates the max height of the authoring container

Default: `"undefined"`

## `maxWidth` (string,number)

Indicates the max width of the authoring container

Default: `"undefined"`

## `minHeight` (string,number)

Indicates the min height of the authoring container

Default: `"undefined"`

## `minWidth` (string,number)

Indicates the min width of the authoring container

Default: `"undefined"`

Default: `": {}"`

# `settingsPartialScoring` (boolean)

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

Default: `true`

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