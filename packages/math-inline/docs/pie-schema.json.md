Model for the @pie-elements/math-inline

The schema defines the following properties:

# `responseType` (string, enum)

Indicates the mode of the question

This element must be one of the following enum values:

* `Advanced Multi`
* `Simple`

# `prompt` (string)

The item stem for the question

# `promptEnabled` (boolean)

Determines if prompt should show

# `expression` (string, required)

Indicates the expression for advanced mode

# `equationEditor`

Indicates what type of editor should be displayed for all the possible responses
1 for Grade 1 - 2
3 for Grade 3 - 5
6 for Grade 6 - 7
8 for Grade 8 - HS

This element must be one of the following enum values:

* `1`
* `3`
* `6`
* `8`
* `advanced-algebra`
* `geometry`
* `miscellaneous`
* `statistics`

Default: `"- miscellaneous"`

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `responses` (array, required)

Array of all correct responses; if responseType is Simple, only first element in array is used

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string,number, required)

The id of the response

## `validation` (string, enum, required)

Indicates what type of validation should be applied on the response

This element must be one of the following enum values:

* `literal`
* `symbolic`

Default: `"is literal"`

## `answer` (string, required)

The answer for the question

## `alternates` (object, required)

For validation type = literal, alternates represents
an object with some alternatives for the correct answers

# `defaultResponse` (object)

Properties of the `defaultResponse` object:

## `id` (string,number, required)

The id of the response

## `validation` (string, enum, required)

Indicates what type of validation should be applied on the response

This element must be one of the following enum values:

* `literal`
* `symbolic`

Default: `"is literal"`

## `answer` (string, required)

The answer for the question

## `alternates` (object, required)

For validation type = literal, alternates represents
an object with some alternatives for the correct answers

# `partialScoring` (boolean)

Indicates if partial scoring is allowed.
This property is not used yet.

# `rationale` (string)

Indicates the value for rationale

# `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `customKeys` (array)

Extra buttons defined by user

The object is an array with all elements of the type `string`.

# `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `note` (string)

Indicates the note for the answer

# `toolbarEditorPosition` (string, enum)

Indicates the editor's toolbar position which can be 'bottom' or 'top'

This element must be one of the following enum values:

* `bottom`
* `top`

Default: `": 'bottom'"`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `ConfigureProp` (object)

Properties of the `ConfigureProp` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

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

## `MathInlineResponse` (object)

Properties of the `MathInlineResponse` object:

### `id` (string,number, required)

The id of the response

### `validation` (string, enum, required)

Indicates what type of validation should be applied on the response

This element must be one of the following enum values:

* `literal`
* `symbolic`

Default: `"is literal"`

### `answer` (string, required)

The answer for the question

### `alternates` (object, required)

For validation type = literal, alternates represents
an object with some alternatives for the correct answers

## `Alternate` (object)

Properties of the `Alternate` object:

### `id` (number, required)

The id for the alternative response

### `answer` (string, required)

The value for the alternative response