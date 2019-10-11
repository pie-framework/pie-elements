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

## `moveOnDrag` (boolean)

Indicates if choice will be removed after is placed into a placement area

Default: `false`

## `lockChoiceOrder` (boolean)

If the entire array of choices can lockChoiceOrder, each choice itself
has this property to indicate if it should lockChoiceOrder

Default: `true`

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

The object is an array with all elements of the type `string`.

# `enableImages` (boolean)

Indicates if the choices editor can use images

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

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `Choice` (object)

Properties of the `Choice` object:

### `id` (string, required)

The id of the choice

### `label` (string)

The label of the choice

### `moveOnDrag` (boolean)

Indicates if choice will be removed after is placed into a placement area

Default: `false`

### `lockChoiceOrder` (boolean)

If the entire array of choices can lockChoiceOrder, each choice itself
has this property to indicate if it should lockChoiceOrder

Default: `true`

## `CorrectResponse` (object)

Properties of the `CorrectResponse` object:

### `id` (string, required)

The id of the correct response

### `weight` (number)

The weight of the correct response
Note: weights are not configurable in the existing component so we'll ignore it for now

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