Model Object for @pie-elements/number-line

The schema defines the following properties:

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `correctResponse` (object, required)

Array that returns responses

# `partialScoring` (boolean, required)

Indicates if partial scoring is enabled

# `graph` (object, required)

Properties of the `graph` object:

## `arrows` (object, required)

Properties of the `arrows` object:

### `left` (boolean, required)

### `right` (boolean, required)

## `width` (number, required)

Indicates domain representation width

## `domain` (object, required)

Properties of the `domain` object:

### `min` (number, required)

### `max` (number, required)

## `maxNumberOfPoints` (number, required)

Indicates the maximum number of correct response values

## `tick` (object, required)

Properties of the `tick` object:

### `minor` (number, required)

smallest tick - These ticks don't have labels.

### `major` (number, required)

larger tick - These ticks have labels.

### `tickIntervalType` (string, required)

Contains tick interval type Integer, Fraction, Decimal

### `integerTick` (number, required)

Integer representation of minor.

### `decimalTick` (number, required)

Decimal representation of minor.

### `fractionTick` (string, required)

Fraction representation of minor.

## `title` (string)

the title under the graph

## `exhibitOnly` (boolean, required)

Indicates if the exhibit mode is enabled

## `initialType` (string, enum, required)

Indicates the initial type of response

This element must be one of the following enum values:

* `LEE`
* `LEF`
* `LFE`
* `LFF`
* `PF`
* `REN`
* `REP`
* `RFN`
* `RFP`

## `availableTypes` (object, required)

Indicates the available types of responses

Properties of the `availableTypes` object:

### `PF` (boolean, required)

Indicates if full point is available

### `LFF` (boolean, required)

Indicates if line with full left & right point is available

### `LEF` (boolean, required)

Indicates if line with empty left & full right point is available

### `LFE` (boolean, required)

Indicates if line with full left & empty right point is available

### `LEE` (boolean, required)

Indicates if line with empty left & right point is available

### `RFN` (boolean, required)

Indicates if ray with full point and negative direction is available

### `REN` (boolean, required)

Indicates if ray with empty point and negative direction is available

### `RFP` (boolean, required)

Indicates if ray with full point and positive direction is available

### `REP` (boolean, required)

Indicates if ray with empty point and positive direction is available

## `widthEnabled` (boolean, required)

If enabled, allows user to set width for number line.

## `initialElements` (object, required)

Array that returns responses

## `labelStep` (string, required)

Indicates the fractional step between 2 labeled ticks

# `prompt` (string)

The question prompt or item stem

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `promptEnabled` (boolean)

Indicates if the prompt is enabled

# `rationale` (string)

Indicates rationale for the answer

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `toolbarEditorPosition` (string, enum)

Indicates the editor's toolbar position which can be 'bottom' or 'top'

This element must be one of the following enum values:

* `bottom`
* `top`

Default: `": 'bottom'"`

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

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

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

## `NumberLineDimensions` (object)

Properties of the `NumberLineDimensions` object:

### `settings` (boolean, required)

### `label` (string, required)

### `enabled` (boolean, required)

### `min` (number, required)

### `max` (number, required)

### `step` (number, required)

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

## `ConfigureLanguageOptionsProp` (object)

Properties of the `ConfigureLanguageOptionsProp` object:

### `value` (string, required)

Value of the language option

### `label` (string, required)

Label of the language option

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

## `ResponsePoint` (object)

Properties of the `ResponsePoint` object:

### `pointType` (string, enum, required)

Indicates point type

This element must be one of the following enum values:

* `empty`
* `full`

### `type` (string, enum, required)

Indicates the response type

This element must be one of the following enum values:

* `line`
* `point`
* `ray`

### `domainPosition` (number, required)

Indicates response domain position

## `ResponseLine` (object)

Properties of the `ResponseLine` object:

### `leftPoint` (string, enum, required)

Indicates left point (left limit for the line) type

This element must be one of the following enum values:

* `empty`
* `full`

### `rightPoint` (string, enum, required)

Indicates right point (left limit for the line) type

This element must be one of the following enum values:

* `empty`
* `full`

### `size` (number, required)

Indicates line size

### `type` (string, enum, required)

Indicates the response type

This element must be one of the following enum values:

* `line`
* `point`
* `ray`

### `domainPosition` (number, required)

Indicates response domain position

## `ResponseRay` (object)

Properties of the `ResponseRay` object:

### `pointType` (string, enum, required)

Indicates point type

This element must be one of the following enum values:

* `empty`
* `full`

### `direction` (string, enum, required)

Indicates ray direction

This element must be one of the following enum values:

* `negative`
* `positive`

### `type` (string, enum, required)

Indicates the response type

This element must be one of the following enum values:

* `line`
* `point`
* `ray`

### `domainPosition` (number, required)

Indicates response domain position

## `NumberLineDomainConfiguration` (object)

Properties of the `NumberLineDomainConfiguration` object:

### `arrows` (object, required)

Properties of the `arrows` object:

#### `left` (boolean, required)

#### `right` (boolean, required)

### `width` (number, required)

Indicates domain representation width

### `domain` (object, required)

Properties of the `domain` object:

#### `min` (number, required)

#### `max` (number, required)

### `maxNumberOfPoints` (number, required)

Indicates the maximum number of correct response values

### `tick` (object, required)

Properties of the `tick` object:

#### `minor` (number, required)

smallest tick - These ticks don't have labels.

#### `major` (number, required)

larger tick - These ticks have labels.

#### `tickIntervalType` (string, required)

Contains tick interval type Integer, Fraction, Decimal

#### `integerTick` (number, required)

Integer representation of minor.

#### `decimalTick` (number, required)

Decimal representation of minor.

#### `fractionTick` (string, required)

Fraction representation of minor.

### `title` (string)

the title under the graph

### `exhibitOnly` (boolean, required)

Indicates if the exhibit mode is enabled

### `initialType` (string, enum, required)

Indicates the initial type of response

This element must be one of the following enum values:

* `LEE`
* `LEF`
* `LFE`
* `LFF`
* `PF`
* `REN`
* `REP`
* `RFN`
* `RFP`

### `availableTypes` (object, required)

Indicates the available types of responses

Properties of the `availableTypes` object:

#### `PF` (boolean, required)

Indicates if full point is available

#### `LFF` (boolean, required)

Indicates if line with full left & right point is available

#### `LEF` (boolean, required)

Indicates if line with empty left & full right point is available

#### `LFE` (boolean, required)

Indicates if line with full left & empty right point is available

#### `LEE` (boolean, required)

Indicates if line with empty left & right point is available

#### `RFN` (boolean, required)

Indicates if ray with full point and negative direction is available

#### `REN` (boolean, required)

Indicates if ray with empty point and negative direction is available

#### `RFP` (boolean, required)

Indicates if ray with full point and positive direction is available

#### `REP` (boolean, required)

Indicates if ray with empty point and positive direction is available

### `widthEnabled` (boolean, required)

If enabled, allows user to set width for number line.

### `initialElements` (object, required)

Array that returns responses

### `labelStep` (string, required)

Indicates the fractional step between 2 labeled ticks

## `Arrows` (object)

Properties of the `Arrows` object:

### `left` (boolean, required)

### `right` (boolean, required)

## `Domain` (object)

Properties of the `Domain` object:

### `min` (number, required)

### `max` (number, required)

## `Ticks` (object)

Properties of the `Ticks` object:

### `minor` (number, required)

smallest tick - These ticks don't have labels.

### `major` (number, required)

larger tick - These ticks have labels.

### `tickIntervalType` (string, required)

Contains tick interval type Integer, Fraction, Decimal

### `integerTick` (number, required)

Integer representation of minor.

### `decimalTick` (number, required)

Decimal representation of minor.

### `fractionTick` (string, required)

Fraction representation of minor.