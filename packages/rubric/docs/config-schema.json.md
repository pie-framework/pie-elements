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

## `languageCharacters` (object)

Properties of the `languageCharacters` object:

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

# `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

# `showExcludeZero` (object)

Properties of the `showExcludeZero` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `showMaxPoint` (object)

Properties of the `showMaxPoint` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `width` (string)

How large can the rubric be

# `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

## `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

## `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

# `maxMaxPoints` (number)

Indicates the max limit for scoring points

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

### `languageCharacters` (object)

Properties of the `languageCharacters` object:

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

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `ConfigureMathMLProp` (object)

Properties of the `ConfigureMathMLProp` object:

### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable