Config Object for @pie-elements/multi-trait-rubric

The schema defines the following properties:

# `excludeZeroDialogBoxContent` (object)

Properties of the `excludeZeroDialogBoxContent` object:

## `title` (string)

Dialog box title

## `text` (string)

Dialog box text

# `includeZeroDialogBoxContent` (object)

Properties of the `includeZeroDialogBoxContent` object:

## `title` (string)

Dialog box title

## `text` (string)

Dialog box text

# `deleteScaleDialogBoxContent` (object)

Properties of the `deleteScaleDialogBoxContent` object:

## `title` (string)

Dialog box title

## `text` (string)

Dialog box text

# `maxPointsDialogBoxContent` (object)

Properties of the `maxPointsDialogBoxContent` object:

## `title` (string)

Dialog box title

## `text` (string)

Dialog box text

# `settingsPanelDisabled` (boolean)

Indicates if the settings panel is not available

# `showExcludeZero` (object)

Properties of the `showExcludeZero` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `showScorePointLabels` (object)

Properties of the `showScorePointLabels` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `showDescription` (object)

Properties of the `showDescription` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `showVisibleToStudent` (object)

Properties of the `showVisibleToStudent` object:

## `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

## `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

# `showHalfScoring` (object)

Properties of the `showHalfScoring` object:

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

# `width` (string, required)

How large (in px) should multi-trait-rubric be

# `minNoOfTraits` (number)

Minimum number of traits

# `maxNoOfTraits` (number)

Maximum number of traits

# `minNoOfScales` (number)

Minimum number of scales

# `maxNoOfScales` (number)

Maximum number of scales

# `defaultTraitLabel` (string)

The default trait label for new created scales.
If it's not defined, it will default to the label of the first trait.

# `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

## `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

## `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

---

# Sub Schemas

The schema defines the following additional types:

## `DialogContent` (object)

Properties of the `DialogContent` object:

### `title` (string)

Dialog box title

### `text` (string)

Dialog box text

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