Model for the @pie-elements/text-entry

The schema defines the following properties:

# `feedback` (object, required)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `correctResponses` (object, required)

Properties of the `correctResponses` object:

## `values` (array, required)

Array of possible responses

The object is an array with all elements of the type `string`.

## `ignoreWhitespace` (boolean)

Indicates if whitespaces should be ignored

## `ignoreCase` (boolean)

Indicates if case should be ignored

# `partialResponses` (object, required)

Properties of the `partialResponses` object:

## `awardPercentage` (string,number, required)

The percentage for the partial response

## `values` (array, required)

Array of possible responses

The object is an array with all elements of the type `string`.

## `ignoreWhitespace` (boolean)

Indicates if whitespaces should be ignored

## `ignoreCase` (boolean)

Indicates if case should be ignored

# `prompt` (string, required)

Prompt for the question

# `allowIntegersOnly` (boolean, required)

# `allowDecimal` (boolean)

Indicates if decimals are allowed if allowIntegersOnly is enabled

# `allowThousandsSeparator` (boolean)

Indicates if thousands separator is allowed if allowIntegersOnly is enabled

# `allowNegative` (boolean)

Indicates if negative numbers are allowed if allowIntegersOnly is enabled

# `answerBlankSize` (string, enum, required)

Indicates allowed answer size

This element must be one of the following enum values:

* `10`
* `12`
* `2`
* `4`
* `6`
* `8`

# `answerAlignment` (string, enum, required)

Indicates answer alignment

This element must be one of the following enum values:

* `center`
* `left`
* `right`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

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

## `Responses` (object)

Properties of the `Responses` object:

### `values` (array, required)

Array of possible responses

The object is an array with all elements of the type `string`.

### `ignoreWhitespace` (boolean)

Indicates if whitespaces should be ignored

### `ignoreCase` (boolean)

Indicates if case should be ignored

## `PartialResponses` (object)

Properties of the `PartialResponses` object:

### `awardPercentage` (string,number, required)

The percentage for the partial response

### `values` (array, required)

Array of possible responses

The object is an array with all elements of the type `string`.

### `ignoreWhitespace` (boolean)

Indicates if whitespaces should be ignored

### `ignoreCase` (boolean)

Indicates if case should be ignored