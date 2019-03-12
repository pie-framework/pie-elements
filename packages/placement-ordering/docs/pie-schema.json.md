Model for the @pie-elements/placement-ordering

The schema defines the following properties:

# `prompt` (string, required)

Th epropmpt for the question

# `choiceAreaLabel` (string)

The label for possible choices

# `choiceAreaLayout` (string, enum, required)

The layout for displaying the choices

This element must be one of the following enum values:

* `horizontal`
* `vertical`

# `answerAreaLabel` (string)

The label for answer area if placement area is enabled

# `shuffle` (boolean, required)

Indicates if the choices can shuffle

Default: `false`

# `choices` (array, required)

Array of all the available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string, required)

The id of the choice

## `label` (string)

The label of the choice

## `moveOnDrag` (boolean)

Indicates if choice will be removed after is placed into a placement area

Default: `false`

## `shuffle` (boolean)

If the entire array of choices can shuffle, each choice itself
has this property to indicate if it should shuffle

Default: `true`

# `correctResponse` (array, required)

Array of the correct responses in the correct order

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string, required)

The id of the correct response

## `weight` (number)

The weight of the correct response
Note: weights are not configurable in the existing component so we'll ignore it for now

# `placementType` (string, enum)

Indicates if the items can be replaced with each other or if they can be placed inside other boxes

This element must be one of the following enum values:

* `none`
* `placement`

# `showOrdering` (boolean, required)

If placement type is placement, show ordering indicates if the boxes are numbered

# `configure` (object, required)

Properties of the `configure` object:

## `enableOrientationChange` (boolean)

Indicates if changing orientation is enabled

## `enableShuffleChange` (boolean)

Indicates if changing shuffle mode is enabled

## `enableNumberedGuideChange` (boolean)

Indicates if changing numbered guide mode is enabled

## `enablePlacementAreaChange` (boolean)

Indicates if changing placement area mode is enabled

## `enablePromptChange` (boolean)

Indicates if changing prompt is enabled

## `enableChoiceLabelChange` (boolean)

Indicates if changing choice label is enabled

## `enableChoicesLabelChange` (boolean)

Indicates if changing the label for the choices is enabled

## `enableRemoveTiles` (boolean)

Indicates if changing the remove tiles mode is enabled

## `enableFeedback` (boolean)

Indicates if feedback is enabled

## `orientationLabel` (string)

The label for the orientation checkboxes

## `shuffleLabel` (string)

The label for the shuffle checkbox

## `includePlacementAreaLabel` (string)

The label for the include placement area checkbox

## `numberedGuidesLabel` (string)

The label for the numbered guides checkbox

## `promptLabel` (string)

The label for the prompt input

## `choiceLabel` (string)

The label for the choice input

## `choicesLabel` (string)

The label for the individual choice input

## `removeTilesLabel` (string)

The label for the remove tiles switch

# `feedback` (object, required)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `partialScoring` (boolean)

Indicates if partialScoring is enabled

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `Choice` (object)

Properties of the `Choice` object:

### `id` (string, required)

The id of the choice

### `label` (string)

The label of the choice

### `moveOnDrag` (boolean)

Indicates if choice will be removed after is placed into a placement area

Default: `false`

### `shuffle` (boolean)

If the entire array of choices can shuffle, each choice itself
has this property to indicate if it should shuffle

Default: `true`

## `CorrectResponse` (object)

Properties of the `CorrectResponse` object:

### `id` (string, required)

The id of the correct response

### `weight` (number)

The weight of the correct response
Note: weights are not configurable in the existing component so we'll ignore it for now

## `ConfigurePlacementOrdering` (object)

Properties of the `ConfigurePlacementOrdering` object:

### `enableOrientationChange` (boolean)

Indicates if changing orientation is enabled

### `enableShuffleChange` (boolean)

Indicates if changing shuffle mode is enabled

### `enableNumberedGuideChange` (boolean)

Indicates if changing numbered guide mode is enabled

### `enablePlacementAreaChange` (boolean)

Indicates if changing placement area mode is enabled

### `enablePromptChange` (boolean)

Indicates if changing prompt is enabled

### `enableChoiceLabelChange` (boolean)

Indicates if changing choice label is enabled

### `enableChoicesLabelChange` (boolean)

Indicates if changing the label for the choices is enabled

### `enableRemoveTiles` (boolean)

Indicates if changing the remove tiles mode is enabled

### `enableFeedback` (boolean)

Indicates if feedback is enabled

### `orientationLabel` (string)

The label for the orientation checkboxes

### `shuffleLabel` (string)

The label for the shuffle checkbox

### `includePlacementAreaLabel` (string)

The label for the include placement area checkbox

### `numberedGuidesLabel` (string)

The label for the numbered guides checkbox

### `promptLabel` (string)

The label for the prompt input

### `choiceLabel` (string)

The label for the choice input

### `choicesLabel` (string)

The label for the individual choice input

### `removeTilesLabel` (string)

The label for the remove tiles switch

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