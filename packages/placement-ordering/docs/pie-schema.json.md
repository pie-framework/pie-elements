Model for the @pie-elements/placement-ordering

The schema defines the following properties:

# `choiceLabel` (string)

The label for possible choices

# `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string, required)

The id of the choice

## `label` (string)

The label of the choice

# `correctResponse` (array)

Array of the correct responses in the correct order

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string, required)

The id of the correct response

## `weight` (number)

The weight of the correct response
Note: weights are not configurable in the existing component so we'll ignore it for now

# `alternateResponses` (array, required)

Array that contains the correct alternate responses

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `response` (array, required)

Array that contains the alternate response ids

The object is an array with all elements of the type `string`.

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `prompt` (string)

The item stem for the question

# `promptEnabled` (boolean)

Determines if prompt should show

# `lockChoiceOrder` (boolean)

Indicates if the choices can lockChoiceOrder

# `numberedGuides` (boolean)

If placement type is placement; show ordering indicates if the boxes are numbered

# `orientation` (string, enum)

The layout for displaying the choices

This element must be one of the following enum values:

* `horizontal`
* `vertical`

# `partialScoring` (boolean)

Indicates if partialScoring is enabled

# `placementArea` (boolean)

Indicates if the items can be replaced with each other or if they can be placed inside other boxes

# `rationale` (string)

Indicates correct answer rationale

# `removeTilesAfterPlacing` (boolean)

Indicates if each choice will be removed from choices after becoming a target

# `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

# `studentInstructions` (string)

Indicates student instructions

# `targetLabel` (string)

The label for answer area if placement area is enabled

# `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

# `teacherInstructions` (string)

Indicates teacher instructions

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `choiceLabelEnabled` (boolean)

Indicates if Choice Label is enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `note` (string)

Indicates the note for the answer

# `toolbarEditorPosition` (string, enum)

Indicates the editor's toolbar position which can be 'bottom' or 'top'

This element must be one of the following enum values:

* `bottom`
* `top`

Default: `": 'bottom'"`

# `rubricEnabled` (boolean, required)

Indicates if Rubric is enabled

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

## `ConfigureMaxImageDimensionsProp` (object)

Properties of the `ConfigureMaxImageDimensionsProp` object:

### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

### `rationale` (number)

Indicates the max dimension for images in rationale

### `choicesWithPlacementArea` (number)

Only available for the width prop: indicates the max width for images in choices and choices labels when placement area is enabled

### `choicesWithoutPlacementArea` (number)

Only available for the width prop: indicates the max width for images in choices and choices labels when placement area is disabled

### `choices` (number)

Only available for the height prop: indicates the max height for images in choices and choices labels

## `ConfigureMathMLProp` (object)

Properties of the `ConfigureMathMLProp` object:

### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

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

## `Choice` (object)

Properties of the `Choice` object:

### `id` (string, required)

The id of the choice

### `label` (string)

The label of the choice

## `CorrectResponse` (object)

Properties of the `CorrectResponse` object:

### `id` (string, required)

The id of the correct response

### `weight` (number)

The weight of the correct response
Note: weights are not configurable in the existing component so we'll ignore it for now

## `AlternateResponse` (object)

Properties of the `AlternateResponse` object:

### `response` (array, required)

Array that contains the alternate response ids

The object is an array with all elements of the type `string`.

## `ComplexFeedbackType` (object)

Properties of the `ComplexFeedbackType` object:

### `correct` (, required)

Indicates the configuration for feedback when answer is correct

### `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

### `partial`

Indicates the configuration for feedback when answer is partially correct

## `DefaultFeedbackType` (object)

Properties of the `DefaultFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

### `default` (string)

Indicates the feedback value

## `CustomFeedbackType` (object)

Properties of the `CustomFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `custom`

### `custom` (string, required)

Indicates the feedback custom value