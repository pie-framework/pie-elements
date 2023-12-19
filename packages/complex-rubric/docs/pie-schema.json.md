Model for the ComplexRubricPie Interaction

The schema defines the following properties:

# `rubricType` (string, enum, required)

This element must be one of the following enum values:

* `multiTraitRubric`
* `rubricless`
* `simpleRubric`

# `rubrics` (object, required)

Properties of the `rubrics` object:

## `simpleRubric` (object, required)

Model for the RubricPie Interaction

Properties of the `simpleRubric` object:

### `points` (array)

Indicates the score points labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `sampleAnswers` (array)

Indicates the sample answers labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `maxPoints` (number)

Indicates the max limit for scoring points

### `excludeZeros` (boolean)

Indicates if point 0 should be shown

### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

### `element` (string, required)

The html Element tag name

## `multiTraitRubric` (object, required)

Model for the MultiTraitRubric Interaction

Properties of the `multiTraitRubric` object:

### `halfScoring` (boolean)

Indicates if half scoring is enabled

### `pointLabels` (boolean)

Indicates if point labels should be shown

### `visibleToStudent` (boolean)

Indicates if should be visible to student

### `description` (boolean)

Indicates if description should be shown

### `standards` (boolean)

Indicates if standards should be shown

### `excludeZero` (boolean)

Indicates if scoring should start at 0 or 1

### `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

### `scales` (array, required)

scales

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `maxPoints` (number, required)

Indicates max limit for scoring points

#### `scorePointsLabels` (array, required)

Score labels. Starting from 0 to max.

The object is an array with all elements of the type `string`.

#### `traitLabel` (string, required)

Trait label

#### `traits` (array, required)

Traits

The object is an array with all elements of the type `object`.

The array object has the following properties:

##### `name` (string, required)

Trait name

##### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

##### `description` (string, required)

Trait description

##### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.

### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

### `element` (string, required)

The html Element tag name

## `rubricless` (object, required)

Properties of the `rubricless` object:

### `maxPoints` (number)

Indicates the max limit for scoring points

### `excludeZeros` (boolean)

Indicates if point 0 should be shown

### `rubriclessInstructionEnabled` (boolean, required)

Indicates that rubricInstruction is enabled

### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

### `element` (string, required)

The html Element tag name

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

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

### `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

#### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

#### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

### `maxMaxPoints` (number)

Indicates the max limit for scoring points

### `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

### `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

### `contentDimensions` (object)

Indicates the dimensions configuration for the authoring container
Note: Some items have a default minimum width because of their content, but if
the minWidth is lower than this, the overflow behavior will take care of that

Properties of the `contentDimensions` object:

#### `maxHeight` (string,number)

Indicates the max height of the authoring container

Default: `"undefined"`

#### `maxWidth` (string,number)

Indicates the max width of the authoring container

Default: `"undefined"`

#### `minHeight` (string,number)

Indicates the min height of the authoring container

Default: `"undefined"`

#### `minWidth` (string,number)

Indicates the min width of the authoring container

Default: `"undefined"`

Default: `": {}"`

### `settingsPartialScoring` (boolean)

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

Default: `true`

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

### `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

#### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

#### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

### `maxMaxPoints` (number)

Indicates the max limit for scoring points

## `DialogContent` (object)

Properties of the `DialogContent` object:

### `title` (string)

Dialog box title

### `text` (string)

Dialog box text

## `RubriclessConfigure` (object)

Properties of the `RubriclessConfigure` object:

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

### `mathMlOptions` (object)

Properties of the `mathMlOptions` object:

#### `mmlOutput` (number)

Indicates if model should have mathML output instead of latex

#### `mmlEditing` (number)

Indicates if mathML that's already in model should be editable

### `maxMaxPoints` (number)

Indicates the max limit for scoring points

### `rubricless` (boolean, enum, required)

Indicates that it is rubricless

This element must be one of the following enum values:

* `true`

### `rubriclessInstruction` (object, required)

Properties of the `rubriclessInstruction` object:

#### `settings` (boolean, enum, required)

This element must be one of the following enum values:

* `true`

#### `label` (string, enum, required)

This element must be one of the following enum values:

* `Instruction`

### `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

### `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`

### `contentDimensions` (object)

Indicates the dimensions configuration for the authoring container
Note: Some items have a default minimum width because of their content, but if
the minWidth is lower than this, the overflow behavior will take care of that

Properties of the `contentDimensions` object:

#### `maxHeight` (string,number)

Indicates the max height of the authoring container

Default: `"undefined"`

#### `maxWidth` (string,number)

Indicates the max width of the authoring container

Default: `"undefined"`

#### `minHeight` (string,number)

Indicates the min height of the authoring container

Default: `"undefined"`

#### `minWidth` (string,number)

Indicates the min width of the authoring container

Default: `"undefined"`

Default: `": {}"`

### `settingsPartialScoring` (boolean)

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

Default: `true`

## `RubricType` (string)

## `RubricModels` (object)

Properties of the `RubricModels` object:

### `simpleRubric` (object, required)

Model for the RubricPie Interaction

Properties of the `simpleRubric` object:

#### `points` (array)

Indicates the score points labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `sampleAnswers` (array)

Indicates the sample answers labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `maxPoints` (number)

Indicates the max limit for scoring points

#### `excludeZeros` (boolean)

Indicates if point 0 should be shown

#### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

#### `element` (string, required)

The html Element tag name

### `multiTraitRubric` (object, required)

Model for the MultiTraitRubric Interaction

Properties of the `multiTraitRubric` object:

#### `halfScoring` (boolean)

Indicates if half scoring is enabled

#### `pointLabels` (boolean)

Indicates if point labels should be shown

#### `visibleToStudent` (boolean)

Indicates if should be visible to student

#### `description` (boolean)

Indicates if description should be shown

#### `standards` (boolean)

Indicates if standards should be shown

#### `excludeZero` (boolean)

Indicates if scoring should start at 0 or 1

#### `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

#### `scales` (array, required)

scales

The object is an array with all elements of the type `object`.

The array object has the following properties:

##### `maxPoints` (number, required)

Indicates max limit for scoring points

##### `scorePointsLabels` (array, required)

Score labels. Starting from 0 to max.

The object is an array with all elements of the type `string`.

##### `traitLabel` (string, required)

Trait label

##### `traits` (array, required)

Traits

The object is an array with all elements of the type `object`.

The array object has the following properties:

###### `name` (string, required)

Trait name

###### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

###### `description` (string, required)

Trait description

###### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.

#### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

#### `element` (string, required)

The html Element tag name

### `rubricless` (object, required)

Properties of the `rubricless` object:

#### `maxPoints` (number)

Indicates the max limit for scoring points

#### `excludeZeros` (boolean)

Indicates if point 0 should be shown

#### `rubriclessInstructionEnabled` (boolean, required)

Indicates that rubricInstruction is enabled

#### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

#### `element` (string, required)

The html Element tag name

## `RubricPie` (object)

Model for the RubricPie Interaction

Properties of the `RubricPie` object:

### `points` (array)

Indicates the score points labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `sampleAnswers` (array)

Indicates the sample answers labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `maxPoints` (number)

Indicates the max limit for scoring points

### `excludeZeros` (boolean)

Indicates if point 0 should be shown

### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

### `element` (string, required)

The html Element tag name

## `MultiTraitRubricPie` (object)

Model for the MultiTraitRubric Interaction

Properties of the `MultiTraitRubricPie` object:

### `halfScoring` (boolean)

Indicates if half scoring is enabled

### `pointLabels` (boolean)

Indicates if point labels should be shown

### `visibleToStudent` (boolean)

Indicates if should be visible to student

### `description` (boolean)

Indicates if description should be shown

### `standards` (boolean)

Indicates if standards should be shown

### `excludeZero` (boolean)

Indicates if scoring should start at 0 or 1

### `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

### `scales` (array, required)

scales

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `maxPoints` (number, required)

Indicates max limit for scoring points

#### `scorePointsLabels` (array, required)

Score labels. Starting from 0 to max.

The object is an array with all elements of the type `string`.

#### `traitLabel` (string, required)

Trait label

#### `traits` (array, required)

Traits

The object is an array with all elements of the type `object`.

The array object has the following properties:

##### `name` (string, required)

Trait name

##### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

##### `description` (string, required)

Trait description

##### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.

### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

### `element` (string, required)

The html Element tag name

## `Scale` (object)

Properties of the `Scale` object:

### `maxPoints` (number, required)

Indicates max limit for scoring points

### `scorePointsLabels` (array, required)

Score labels. Starting from 0 to max.

The object is an array with all elements of the type `string`.

### `traitLabel` (string, required)

Trait label

### `traits` (array, required)

Traits

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `name` (string, required)

Trait name

#### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

#### `description` (string, required)

Trait description

#### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.

## `Trait` (object)

Properties of the `Trait` object:

### `name` (string, required)

Trait name

### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

### `description` (string, required)

Trait description

### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.

## `RubriclessPie` (object)

Properties of the `RubriclessPie` object:

### `maxPoints` (number)

Indicates the max limit for scoring points

### `excludeZeros` (boolean)

Indicates if point 0 should be shown

### `rubriclessInstructionEnabled` (boolean, required)

Indicates that rubricInstruction is enabled

### `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

### `element` (string, required)

The html Element tag name