Config Object for @pie-elements/graphing

The schema defines the following properties:

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

# `padding` (object)

Properties of the `padding` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `labels` (object)

Properties of the `labels` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `prompt` (object)

Properties of the `prompt` object:

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

# `rationale` (object)

Properties of the `rationale` object:

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

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `title` (object)

Properties of the `title` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

# `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

# `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

# `settingsPartialScoring` (boolean)

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

Default: `true`

---

# Sub Schemas

The schema defines the following additional types:

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

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)