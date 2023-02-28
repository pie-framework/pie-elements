The schema defines the following properties:

# `width` (string)

How large should complex-rubric be

# `simpleRubric` (object, required)

Properties of the `simpleRubric` object:

## `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

## `showExcludeZero` (object)

Properties of the `showExcludeZero` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `showMaxPoint` (object)

Properties of the `showMaxPoint` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `width` (string)

How large can the rubric be

## `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

## `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

## `settingsPartialScoring` (boolean)

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

Default: `true`

# `multiTraitRubric` (object, required)

Config Object for @pie-elements/multi-trait-rubric

Properties of the `multiTraitRubric` object:

## `excludeZeroDialogBoxContent` (object)

Properties of the `excludeZeroDialogBoxContent` object:

### `title` (string)

Dialog box title

### `text` (string)

Dialog box text

## `includeZeroDialogBoxContent` (object)

Properties of the `includeZeroDialogBoxContent` object:

### `title` (string)

Dialog box title

### `text` (string)

Dialog box text

## `deleteScaleDialogBoxContent` (object)

Properties of the `deleteScaleDialogBoxContent` object:

### `title` (string)

Dialog box title

### `text` (string)

Dialog box text

## `maxPointsDialogBoxContent` (object)

Properties of the `maxPointsDialogBoxContent` object:

### `title` (string)

Dialog box title

### `text` (string)

Dialog box text

## `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

## `showExcludeZero` (object)

Properties of the `showExcludeZero` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `showScorePointLabels` (object)

Properties of the `showScorePointLabels` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `showDescription` (object)

Properties of the `showDescription` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `showVisibleToStudent` (object)

Properties of the `showVisibleToStudent` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `showHalfScoring` (object)

Properties of the `showHalfScoring` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `spellCheck` (object)

Properties of the `spellCheck` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `width` (string, required)

How large (in px) should multi-trait-rubric be

## `minNoOfTraits` (number)

Minimum number of traits

## `maxNoOfTraits` (number)

Maximum number of traits

## `minNoOfScales` (number)

Minimum number of scales

## `maxNoOfScales` (number)

Maximum number of scales

## `defaultTraitLabel` (string)

The default trait label for new created scales.
If it's not defined, it will default to the label of the first trait.

---

# Sub Schemas

The schema defines the following additional types:

## `RubricConfigure` (object)

Properties of the `RubricConfigure` object:

### `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

### `showExcludeZero` (object)

Properties of the `showExcludeZero` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `showMaxPoint` (object)

Properties of the `showMaxPoint` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `width` (string)

How large can the rubric be

### `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

### `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

### `settingsPartialScoring` (boolean)

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

Default: `true`

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `MultiTraitRubricConfigure` (object)

Config Object for @pie-elements/multi-trait-rubric

Properties of the `MultiTraitRubricConfigure` object:

### `excludeZeroDialogBoxContent` (object)

Properties of the `excludeZeroDialogBoxContent` object:

#### `title` (string)

Dialog box title

#### `text` (string)

Dialog box text

### `includeZeroDialogBoxContent` (object)

Properties of the `includeZeroDialogBoxContent` object:

#### `title` (string)

Dialog box title

#### `text` (string)

Dialog box text

### `deleteScaleDialogBoxContent` (object)

Properties of the `deleteScaleDialogBoxContent` object:

#### `title` (string)

Dialog box title

#### `text` (string)

Dialog box text

### `maxPointsDialogBoxContent` (object)

Properties of the `maxPointsDialogBoxContent` object:

#### `title` (string)

Dialog box title

#### `text` (string)

Dialog box text

### `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

### `showExcludeZero` (object)

Properties of the `showExcludeZero` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `showScorePointLabels` (object)

Properties of the `showScorePointLabels` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `showDescription` (object)

Properties of the `showDescription` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `showVisibleToStudent` (object)

Properties of the `showVisibleToStudent` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `showHalfScoring` (object)

Properties of the `showHalfScoring` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `spellCheck` (object)

Properties of the `spellCheck` object:

#### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

#### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `width` (string, required)

How large (in px) should multi-trait-rubric be

### `minNoOfTraits` (number)

Minimum number of traits

### `maxNoOfTraits` (number)

Maximum number of traits

### `minNoOfScales` (number)

Minimum number of scales

### `maxNoOfScales` (number)

Maximum number of scales

### `defaultTraitLabel` (string)

The default trait label for new created scales.
If it's not defined, it will default to the label of the first trait.

## `DialogContent` (object)

Properties of the `DialogContent` object:

### `title` (string)

Dialog box title

### `text` (string)

Dialog box text