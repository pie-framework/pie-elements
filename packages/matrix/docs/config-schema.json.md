Config Object for @pie-elements/matrix

The schema defines the following properties:

# `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

# `spellCheck` (object)

Properties of the `spellCheck` object:

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

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel