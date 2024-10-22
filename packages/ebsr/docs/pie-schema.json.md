Model for the EBSR Interaction

The schema defines the following properties:

# `partA` (object, required)

Properties of the `partA` object:

## `choiceMode` (string, enum, required)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

## `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct

## `choicePrefix` (string, enum, required)

What key should be displayed before choices.

This element must be one of the following enum values:

* `letters`
* `numbers`

## `prompt` (string, required)

The question prompt or item stem

## `promptEnabled` (boolean)

Indicates if the prompt is enabled

## `studentInstructions` (string)

Indicates student instructions

## `teacherInstructions` (string)

Indicates teacher instructions

## `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

## `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

## `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

## `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

## `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

## `verticalMode` (boolean)

Indicates the layout of choices for player

Default: `": true"`

# `partB` (object, required)

Properties of the `partB` object:

## `choiceMode` (string, enum, required)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

## `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct

## `choicePrefix` (string, enum, required)

What key should be displayed before choices.

This element must be one of the following enum values:

* `letters`
* `numbers`

## `prompt` (string, required)

The question prompt or item stem

## `promptEnabled` (boolean)

Indicates if the prompt is enabled

## `studentInstructions` (string)

Indicates student instructions

## `teacherInstructions` (string)

Indicates teacher instructions

## `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

## `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

## `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

## `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

## `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

## `verticalMode` (boolean)

Indicates the layout of choices for player

Default: `": true"`

# `partLabels` (boolean, required)

Indicates if part labels should be displayed

# `partLabelType` (string, enum, required)

Indicates what type should have part labels if they are enabled

This element must be one of the following enum values:

* `Letters`
* `Numbers`

# `partialScoring` (boolean)

Indicates if partial scoring should be used

# `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `PartConfiguration` (object)

Properties of the `PartConfiguration` object:

### `addChoiceButton` (object)

Properties of the `addChoiceButton` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `choiceMode` (object)

Properties of the `choiceMode` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `choicePrefix` (object)

Properties of the `choicePrefix` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `deleteChoice` (object)

Properties of the `deleteChoice` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `feedback` (object)

Properties of the `feedback` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `lockChoiceOrder` (object)

Properties of the `lockChoiceOrder` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `prompt` (object)

Properties of the `prompt` object:

#### `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

##### `math` (object)

Properties of the `math` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `audio` (object)

Properties of the `audio` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `video` (object)

Properties of the `video` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `image` (object)

Properties of the `image` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `customPlugins` (array)

An array of objects that determine custom plugins.
A custom plugin is an object which determines how the button will look like (icon) and the event name that will be triggered when button gets pressed (event).
Example can be found at https://github.com/pie-framework/pie-lib/blob/develop/packages/demo/pages/editable-html.js#L425.

The object is an array with all elements of the type `object`.

The array object has the following properties:

###### `event` (string, required)

The name of the custom event. It needs to be valid (only letters, numbers and "_" can be used).
PIE will emit the event prefixed with "PIE-".
Eg: event = 'client_custom_event_A' => the emitted event will be "PIE-client_custom_event_A"

###### `iconAlt` (string, required)

The alt for the custom button icon

###### `iconType` (string, required)

The icon type.
Currently, only "SVG" is supported.

###### `icon` (string, required)

The icon string. Currently, only "SVG" is supported, so it needs to be a valid svg.

##### `blockquote` (object)

Properties of the `blockquote` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `h3` (object)

Properties of the `h3` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `characters` (object)

Properties of the `characters` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `bold` (object)

Properties of the `bold` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `html` (object)

Properties of the `html` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `italic` (object)

Properties of the `italic` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ol_list` (object)

Properties of the `ol_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `redo` (object)

Properties of the `redo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `strikethrough` (object)

Properties of the `strikethrough` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sub` (object)

Properties of the `sub` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sup` (object)

Properties of the `sup` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `table` (object)

Properties of the `table` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ul_list` (object)

Properties of the `ul_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `underline` (object)

Properties of the `underline` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `undo` (object)

Properties of the `undo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `required` (boolean)

Indicates if the item is required and the value cannot be empty

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

### `spellCheck` (object)

Properties of the `spellCheck` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `rationale` (object)

Properties of the `rationale` object:

#### `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

##### `math` (object)

Properties of the `math` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `audio` (object)

Properties of the `audio` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `video` (object)

Properties of the `video` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `image` (object)

Properties of the `image` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `customPlugins` (array)

An array of objects that determine custom plugins.
A custom plugin is an object which determines how the button will look like (icon) and the event name that will be triggered when button gets pressed (event).
Example can be found at https://github.com/pie-framework/pie-lib/blob/develop/packages/demo/pages/editable-html.js#L425.

The object is an array with all elements of the type `object`.

The array object has the following properties:

###### `event` (string, required)

The name of the custom event. It needs to be valid (only letters, numbers and "_" can be used).
PIE will emit the event prefixed with "PIE-".
Eg: event = 'client_custom_event_A' => the emitted event will be "PIE-client_custom_event_A"

###### `iconAlt` (string, required)

The alt for the custom button icon

###### `iconType` (string, required)

The icon type.
Currently, only "SVG" is supported.

###### `icon` (string, required)

The icon string. Currently, only "SVG" is supported, so it needs to be a valid svg.

##### `blockquote` (object)

Properties of the `blockquote` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `h3` (object)

Properties of the `h3` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `characters` (object)

Properties of the `characters` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `bold` (object)

Properties of the `bold` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `html` (object)

Properties of the `html` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `italic` (object)

Properties of the `italic` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ol_list` (object)

Properties of the `ol_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `redo` (object)

Properties of the `redo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `strikethrough` (object)

Properties of the `strikethrough` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sub` (object)

Properties of the `sub` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sup` (object)

Properties of the `sup` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `table` (object)

Properties of the `table` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ul_list` (object)

Properties of the `ul_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `underline` (object)

Properties of the `underline` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `undo` (object)

Properties of the `undo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `required` (boolean)

Indicates if the item is required and the value cannot be empty

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `studentInstructions` (object)

Properties of the `studentInstructions` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `teacherInstructions` (object)

Properties of the `teacherInstructions` object:

#### `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

##### `math` (object)

Properties of the `math` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `audio` (object)

Properties of the `audio` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `video` (object)

Properties of the `video` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `image` (object)

Properties of the `image` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `customPlugins` (array)

An array of objects that determine custom plugins.
A custom plugin is an object which determines how the button will look like (icon) and the event name that will be triggered when button gets pressed (event).
Example can be found at https://github.com/pie-framework/pie-lib/blob/develop/packages/demo/pages/editable-html.js#L425.

The object is an array with all elements of the type `object`.

The array object has the following properties:

###### `event` (string, required)

The name of the custom event. It needs to be valid (only letters, numbers and "_" can be used).
PIE will emit the event prefixed with "PIE-".
Eg: event = 'client_custom_event_A' => the emitted event will be "PIE-client_custom_event_A"

###### `iconAlt` (string, required)

The alt for the custom button icon

###### `iconType` (string, required)

The icon type.
Currently, only "SVG" is supported.

###### `icon` (string, required)

The icon string. Currently, only "SVG" is supported, so it needs to be a valid svg.

##### `blockquote` (object)

Properties of the `blockquote` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `h3` (object)

Properties of the `h3` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `characters` (object)

Properties of the `characters` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `bold` (object)

Properties of the `bold` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `html` (object)

Properties of the `html` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `italic` (object)

Properties of the `italic` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ol_list` (object)

Properties of the `ol_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `redo` (object)

Properties of the `redo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `strikethrough` (object)

Properties of the `strikethrough` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sub` (object)

Properties of the `sub` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sup` (object)

Properties of the `sup` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `table` (object)

Properties of the `table` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ul_list` (object)

Properties of the `ul_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `underline` (object)

Properties of the `underline` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `undo` (object)

Properties of the `undo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `required` (boolean)

Indicates if the item is required and the value cannot be empty

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `choicesLayout` (object)

Properties of the `choicesLayout` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `gridColumns` (object)

Properties of the `gridColumns` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `minAnswerChoices` (number)

Minimum number of answer choices

### `maxAnswerChoices` (number)

Maximum number of answer choices

### `maxImageWidth` (object)

Properties of the `maxImageWidth` object:

#### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

#### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

#### `rationale` (number)

Indicates the max dimension for images in rationale

#### `choices` (number)

Indicates the max dimension for images in choices

### `maxImageHeight` (object)

Properties of the `maxImageHeight` object:

#### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

#### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

#### `rationale` (number)

Indicates the max dimension for images in rationale

#### `choices` (number)

Indicates the max dimension for images in choices

### `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

#### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

#### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

### `baseInputConfiguration` (object)

Properties of the `baseInputConfiguration` object:

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

### `choices` (object)

Properties of the `choices` object:

#### `inputConfiguration` (object)

Properties of the `inputConfiguration` object:

##### `math` (object)

Properties of the `math` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `audio` (object)

Properties of the `audio` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `video` (object)

Properties of the `video` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `image` (object)

Properties of the `image` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `customPlugins` (array)

An array of objects that determine custom plugins.
A custom plugin is an object which determines how the button will look like (icon) and the event name that will be triggered when button gets pressed (event).
Example can be found at https://github.com/pie-framework/pie-lib/blob/develop/packages/demo/pages/editable-html.js#L425.

The object is an array with all elements of the type `object`.

The array object has the following properties:

###### `event` (string, required)

The name of the custom event. It needs to be valid (only letters, numbers and "_" can be used).
PIE will emit the event prefixed with "PIE-".
Eg: event = 'client_custom_event_A' => the emitted event will be "PIE-client_custom_event_A"

###### `iconAlt` (string, required)

The alt for the custom button icon

###### `iconType` (string, required)

The icon type.
Currently, only "SVG" is supported.

###### `icon` (string, required)

The icon string. Currently, only "SVG" is supported, so it needs to be a valid svg.

##### `blockquote` (object)

Properties of the `blockquote` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `h3` (object)

Properties of the `h3` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `characters` (object)

Properties of the `characters` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `bold` (object)

Properties of the `bold` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `html` (object)

Properties of the `html` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `italic` (object)

Properties of the `italic` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ol_list` (object)

Properties of the `ol_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `redo` (object)

Properties of the `redo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `strikethrough` (object)

Properties of the `strikethrough` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sub` (object)

Properties of the `sub` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `sup` (object)

Properties of the `sup` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `table` (object)

Properties of the `table` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `ul_list` (object)

Properties of the `ul_list` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `underline` (object)

Properties of the `underline` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

##### `undo` (object)

Properties of the `undo` object:

###### `disabled` (boolean)

Indicates if the plugin is disabled or not

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

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

## `ConfigureMaxImageDimensionsProp` (object)

Properties of the `ConfigureMaxImageDimensionsProp` object:

### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

### `rationale` (number)

Indicates the max dimension for images in rationale

### `choices` (number)

Indicates the max dimension for images in choices

## `ConfigureMathMLProp` (object)

Properties of the `ConfigureMathMLProp` object:

### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

## `EditableHtmlPluginConfigure` (object)

Properties of the `EditableHtmlPluginConfigure` object:

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

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `Part` (object)

Properties of the `Part` object:

### `choiceMode` (string, enum, required)

Indicates the choices are single or multiple selection

This element must be one of the following enum values:

* `checkbox`
* `radio`

### `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `value` (string, required)

The value for the choice

#### `label` (string, required)

The label of the choice

#### `correct` (boolean)

Indicates if choice is correct

### `choicePrefix` (string, enum, required)

What key should be displayed before choices.

This element must be one of the following enum values:

* `letters`
* `numbers`

### `prompt` (string, required)

The question prompt or item stem

### `promptEnabled` (boolean)

Indicates if the prompt is enabled

### `studentInstructions` (string)

Indicates student instructions

### `teacherInstructions` (string)

Indicates teacher instructions

### `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

### `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

### `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

### `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

### `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

### `verticalMode` (boolean)

Indicates the layout of choices for player

Default: `": true"`

## `Choice` (object)

Properties of the `Choice` object:

### `value` (string, required)

The value for the choice

### `label` (string, required)

The label of the choice

### `correct` (boolean)

Indicates if choice is correct