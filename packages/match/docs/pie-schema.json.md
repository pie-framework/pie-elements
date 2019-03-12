Model for the @pie-elements/match Interaction

The schema defines the following properties:

# `rows` (array, required)

The rows of choices to be presented.

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string,number, required)

Identifier for a row

## `title` (string, required)

Title that will be displayed for the row

## `values` (array, required)

Array of boolean values indicating which columns are selected in the row

The object is an array with all elements of the type `boolean`.

# `shuffled` (boolean)

Indicates if the order of the rows should be randomly sorted on render

# `layout` (number, required)

The number of columns to be presented

# `headers` (array, required)

Array of strings for column headers

The object is an array with all elements of the type `string`.

# `responseType` (string, enum, required)

Indicates if the conrol for responses should be single (radio) or multiple (checkbox)

This element must be one of the following enum values:

* `checkbox`
* `radio`

# `partialScoring` (boolean)

Indicates if partial scoring should be used

# `partialScoringLabel` (string)

Partial scoring label to be displayed

# `allowPartialScoring` (boolean)

Indicates that the item can use partial scoring

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `MatchRow` (object)

One row in the match list.

Properties of the `MatchRow` object:

### `id` (string,number, required)

Identifier for a row

### `title` (string, required)

Title that will be displayed for the row

### `values` (array, required)

Array of boolean values indicating which columns are selected in the row

The object is an array with all elements of the type `boolean`.

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