Config Object for @pie-elements/graphing

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

## `blockquote` (object)

Properties of the `blockquote` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `h3` (object)

Properties of the `h3` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `characters` (object)

Properties of the `characters` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `bold` (object)

Properties of the `bold` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `html` (object)

Properties of the `html` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `italic` (object)

Properties of the `italic` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `ol_list` (object)

Properties of the `ol_list` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `redo` (object)

Properties of the `redo` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `strikethrough` (object)

Properties of the `strikethrough` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `sub` (object)

Properties of the `sub` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `sup` (object)

Properties of the `sup` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `table` (object)

Properties of the `table` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `ul_list` (object)

Properties of the `ul_list` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `underline` (object)

Properties of the `underline` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `undo` (object)

Properties of the `undo` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

# `authoring` (object)

Properties of the `authoring` object:

## `settings` (boolean)

Indicates if the item is displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that is displayed in the Settings Panel

## `enabled` (boolean)

Indicates if the Grid Setup Panel is displayed

## `includeAxesEnabled` (boolean)

Indicates if the "includeAxes" toggle is displayed in the Grid Setup Panel

## `standardGridEnabled` (boolean)

Indicates if the "standardGrid" toggle is displayed in the Grid Setup Panel

## `min` (object)

Properties of the `min` object:

### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

## `max` (object)

Properties of the `max` object:

### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

## `axisLabel` (object)

Properties of the `axisLabel` object:

### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

## `step` (object)

Properties of the `step` object:

### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

## `labelStep` (object)

Properties of the `labelStep` object:

### `label` (string)

Indicates the label for the item that is displayed in the Grid Setup Panel

### `enabled` (boolean)

Indicates if the item is displayed in the Grid Setup Panel

# `arrows` (object)

Properties of the `arrows` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `left` (object)

Properties of the `left` object:

### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

## `right` (object)

Properties of the `right` object:

### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

## `up` (object)

Properties of the `up` object:

### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

## `down` (object)

Properties of the `down` object:

### `label` (string)

Indicates the label for the arrow that has to be displayed in the Settings Panel

# `availableTools` (array)

Graph toolbar tools configuration

The object is an array with all elements of the type `string`.

# `coordinatesOnHover` (object)

Properties of the `coordinatesOnHover` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `graphDimensions` (object)

Properties of the `graphDimensions` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `enabled` (boolean)

Indicates if the graph dimensions are included in the Grid Setup Panel

## `min` (number)

Indicates the minimum value for the graph width and height

## `max` (number)

Indicates the maximum value for the graph width and height

## `step` (number)

Indicates the increase/decrease value for the graph width and height

# `gridConfigurations` (array, required)

Grid default configurations

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `label` (string)

Indicates the label for the configuration

## `arrows` (object)

Properties of the `arrows` object:

### `left` (boolean, required)

Indicates if left arrow is enabled

### `right` (boolean, required)

Indicates if right arrow is enabled

### `up` (boolean, required)

Indicates if up arrow is enabled

### `down` (boolean, required)

Indicates if down arrow is enabled

## `domain` (object, required)

Properties of the `domain` object:

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

## `graph` (object, required)

Properties of the `graph` object:

### `width` (number, required)

Width for graph representation

### `height` (number, required)

Height for graph representation

## `includeAxes` (boolean)

Indicates if the graph axes and labels are enabled

## `labels` (object)

Properties of the `labels` object:

### `top` (string, required)

Label for top side of the graph

### `bottom` (string, required)

Label for bottom side of the graph

### `left` (string, required)

Label for left side of the graph

### `right` (string, required)

Label for right side of the graph

## `padding` (boolean)

Indicates if padding is enabled

## `range` (object, required)

Properties of the `range` object:

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

## `standardGrid` (boolean)

Indicates if some domain values will be synched to the range values

## `title` (string)

Indicates graph title

# `padding` (object)

Properties of the `padding` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `labels` (object)

Properties of the `labels` object:

## `top` (string)

Indicates the placeholder for the top label

## `right` (string)

Indicates the placeholder for the right label

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

### `blockquote` (object)

Properties of the `blockquote` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `h3` (object)

Properties of the `h3` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `characters` (object)

Properties of the `characters` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `bold` (object)

Properties of the `bold` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `html` (object)

Properties of the `html` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `italic` (object)

Properties of the `italic` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ol_list` (object)

Properties of the `ol_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `redo` (object)

Properties of the `redo` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `strikethrough` (object)

Properties of the `strikethrough` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sub` (object)

Properties of the `sub` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sup` (object)

Properties of the `sup` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `table` (object)

Properties of the `table` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ul_list` (object)

Properties of the `ul_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `underline` (object)

Properties of the `underline` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `undo` (object)

Properties of the `undo` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `required` (boolean)

Indicates if the item is required and the value cannot be empty

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

# `spellCheck` (object)

Properties of the `spellCheck` object:

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

### `blockquote` (object)

Properties of the `blockquote` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `h3` (object)

Properties of the `h3` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `characters` (object)

Properties of the `characters` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `bold` (object)

Properties of the `bold` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `html` (object)

Properties of the `html` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `italic` (object)

Properties of the `italic` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ol_list` (object)

Properties of the `ol_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `redo` (object)

Properties of the `redo` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `strikethrough` (object)

Properties of the `strikethrough` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sub` (object)

Properties of the `sub` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sup` (object)

Properties of the `sup` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `table` (object)

Properties of the `table` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ul_list` (object)

Properties of the `ul_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `underline` (object)

Properties of the `underline` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `undo` (object)

Properties of the `undo` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `required` (boolean)

Indicates if the item is required and the value cannot be empty

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

### `blockquote` (object)

Properties of the `blockquote` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `h3` (object)

Properties of the `h3` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `characters` (object)

Properties of the `characters` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `bold` (object)

Properties of the `bold` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `html` (object)

Properties of the `html` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `italic` (object)

Properties of the `italic` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ol_list` (object)

Properties of the `ol_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `redo` (object)

Properties of the `redo` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `strikethrough` (object)

Properties of the `strikethrough` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sub` (object)

Properties of the `sub` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sup` (object)

Properties of the `sup` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `table` (object)

Properties of the `table` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ul_list` (object)

Properties of the `ul_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `underline` (object)

Properties of the `underline` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `undo` (object)

Properties of the `undo` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `required` (boolean)

Indicates if the item is required and the value cannot be empty

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `title` (object)

Properties of the `title` object:

## `placeholder` (string)

Indicates the placeholder for the title label

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

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

# `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

## `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

## `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

# `removeIncompleteTool` (boolean)

Ability to remove incomplete tool added after switching current tool.

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

### `blockquote` (object)

Properties of the `blockquote` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `h3` (object)

Properties of the `h3` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `characters` (object)

Properties of the `characters` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `bold` (object)

Properties of the `bold` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `html` (object)

Properties of the `html` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `italic` (object)

Properties of the `italic` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ol_list` (object)

Properties of the `ol_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `redo` (object)

Properties of the `redo` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `strikethrough` (object)

Properties of the `strikethrough` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sub` (object)

Properties of the `sub` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `sup` (object)

Properties of the `sup` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `table` (object)

Properties of the `table` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `ul_list` (object)

Properties of the `ul_list` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `underline` (object)

Properties of the `underline` object:

#### `disabled` (boolean)

Indicates if the plugin is disabled or not

### `undo` (object)

Properties of the `undo` object:

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

#### `characters` (object)

Properties of the `characters` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `bold` (object)

Properties of the `bold` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `html` (object)

Properties of the `html` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `italic` (object)

Properties of the `italic` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `ol_list` (object)

Properties of the `ol_list` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `redo` (object)

Properties of the `redo` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `strikethrough` (object)

Properties of the `strikethrough` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `sub` (object)

Properties of the `sub` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `sup` (object)

Properties of the `sup` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `table` (object)

Properties of the `table` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `ul_list` (object)

Properties of the `ul_list` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `underline` (object)

Properties of the `underline` object:

##### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `undo` (object)

Properties of the `undo` object:

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