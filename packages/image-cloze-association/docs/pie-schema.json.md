Model for the @pie-elements/image-cloze-association Interaction

The schema defines the following properties:

# `prompt` (string)

The question prompt or item stem

# `rationaleEnabled` (boolean)

Indicates if Rationale is enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `teacherInstructionsEnabled` (boolean)

Indicates if Teacher Instructions are enabled

# `studentInstructionsEnabled` (boolean)

Indicates if Student Instructions are enabled

# `image` (object)

Properties of the `image` object:

## `src` (string)

The url of the image

## `width` (number)

The width of the image

## `height` (number)

The height of the image

# `responseContainers` (array)

List of the response containers
The response containers are the areas where the images are dragged in

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `x` (number)

The x coordinate of the response container

## `y` (number)

The y coordinate of the response container

## `width` (string)

The width of the response container

## `height` (string)

The height of the response container

# `stimulus` (string)

The question stimulus

# `possibleResponses` (array)

List of img tags that are the possible responses

The object is an array with all elements of the type `string`.

# `validation` (object)

Properties of the `validation` object:

## `validResponse` (object)

Properties of the `validResponse` object:

### `score` (number)

The score of the response

### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

#### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

## `altResponses` (array)

List of alternate responses

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `score` (number)

The score of the response

### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

#### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

# `partialScoring` (boolean)

Indicates if the item should use partial scoring

# `maxResponsePerZone` (number)

Indicates how many responses can be placed in a response container

Default: `1`

# `duplicateResponses` (boolean)

Indicates if duplicate responses are allowed

# `showDashedBorder` (boolean)

Indicates if the response containers should have a dashed border

# `rubricEnabled` (boolean, required)

Indicates if Rubric is enabled

# `shuffle` (boolean)

Indicates if the possible responses have to be shuffled in the player

# `language` (string)

Indicates the language of the component
Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX

# `uiStyle` (object)

Indicates style options of the component
Supported options: fontsize, possibilityListPosition (top, bottom, left, right)

Properties of the `uiStyle` object:

## `possibilityListPosition` (string, enum)

This element must be one of the following enum values:

* `bottom`
* `left`
* `right`
* `top`

## `fontsize` (string, required)

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

## `EditableHtmlButtonConfigure` (object)

Properties of the `EditableHtmlButtonConfigure` object:

### `disabled` (boolean)

Indicates if the plugin is disabled or not

## `ConfigureMaxImageDimensionsProp` (object)

Properties of the `ConfigureMaxImageDimensionsProp` object:

### `teacherInstructions` (number)

Indicates the max dimension for images in teacher instructions

### `prompt` (number)

Indicates the max dimension for images in prompt - this is also the default dimension for all other input fields if it's not specified

### `rationale` (number)

Indicates the max dimension for images in rationale

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

### `required` (boolean)

Indicates if the item is required and the value cannot be empty

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

## `Image` (object)

Properties of the `Image` object:

### `src` (string)

The url of the image

### `width` (number)

The width of the image

### `height` (number)

The height of the image

## `ResponseContainer` (object)

Properties of the `ResponseContainer` object:

### `x` (number)

The x coordinate of the response container

### `y` (number)

The y coordinate of the response container

### `width` (string)

The width of the response container

### `height` (string)

The height of the response container

## `Validation` (object)

Properties of the `Validation` object:

### `validResponse` (object)

Properties of the `validResponse` object:

#### `score` (number)

The score of the response

#### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

##### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

### `altResponses` (array)

List of alternate responses

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `score` (number)

The score of the response

#### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

##### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

## `ValidResponse` (object)

Properties of the `ValidResponse` object:

### `score` (number)

The score of the response

### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

#### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

## `ChoicesPosition` (string)