Config Object for @pie-elements/number-line

The schema defines the following properties:

# `prompt` (object)

Properties of the `prompt` object:

## `settings` (boolean)

Indicates if the item has to be displayed

## `label` (string)

Indicates the label for the item

## `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

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

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed

### `label` (string)

Indicates the label for the item

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)