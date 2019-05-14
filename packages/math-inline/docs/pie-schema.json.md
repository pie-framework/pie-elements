NOTE: teacherInstructions, studentInstructions, rationale & scoringType
functionalities are not defined yet - the value for those can belong to
model or to configure (to be moved when the functionality is defined)
Model for the @pie-elements/math-inline

The schema defines the following properties:

# `responseType` (string, enum, required)

Indicates the mode of the question

This element must be one of the following enum values:

* `Advanced Multi`
* `Simple`

# `question` (string)

Indicates the question statement

# `expression` (string, required)

Indicates the expression for advanced mode

# `equationEditor` (, enum, required)

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
* `everything`
* `geometry`
* `statistics`

Default: `"- everything"`

# `feedback` (object, required)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `responses` (array, required)

Array of all correct responses

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string,number, required)

The id of the response

## `validation` (string, enum, required)

Indicates what type of validation should be applied on the response

This element must be one of the following enum values:

* `literal`
* `symbolic`

Default: `"is symbolic"`

## `answer` (string, required)

The answer for the question

## `alternates` (object, required)

For validation type = literal, alternates represents
an object with some alternatives for the correct answers

## `allowSpaces` (boolean)

Indicates if spaces are allowed

## `allowDecimals` (boolean)

Indicates if decimals are allowed

# `defaultResponse` (object)

Properties of the `defaultResponse` object:

## `id` (string,number, required)

The id of the response

## `validation` (string, enum, required)

Indicates what type of validation should be applied on the response

This element must be one of the following enum values:

* `literal`
* `symbolic`

Default: `"is symbolic"`

## `answer` (string, required)

The answer for the question

## `alternates` (object, required)

For validation type = literal, alternates represents
an object with some alternatives for the correct answers

## `allowSpaces` (boolean)

Indicates if spaces are allowed

## `allowDecimals` (boolean)

Indicates if decimals are allowed

# `partialScoring` (boolean, required)

Indicates if partial scoring is allowed.
This property is not used yet.

# `rationale` (string, required)

Indicates the value for rationale

# `scoringType` (string, enum, required)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

# `studentInstructions` (boolean, required)

Indicates if student instructions are enabled

# `teacherInstructions` (boolean, required)

Indicates if teacher instructions are enabled

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

Indicates if the item has to be displayed

### `label` (string)

Indicates the label for the item

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

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

Default: `"is symbolic"`

### `answer` (string, required)

The answer for the question

### `alternates` (object, required)

For validation type = literal, alternates represents
an object with some alternatives for the correct answers

### `allowSpaces` (boolean)

Indicates if spaces are allowed

### `allowDecimals` (boolean)

Indicates if decimals are allowed

## `Alternate` (object)

Properties of the `Alternate` object:

### `id` (number, required)

The id for the alternative response

### `answer` (string, required)

The value for the alternative response