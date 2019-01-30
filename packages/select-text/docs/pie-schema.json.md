Pie Model Object for @pie-elements/select-text

The schema defines the following properties:

# `prompt` (string, required)

The user prompt/item stem

# `text` (string, required)

The passage of text from which user may select responses

# `highlightChoices` (boolean, required)

Indicates if the parts of text that are choosable, should be highligned when presented to student.

Default: `false`

# `feedback` (array, required)

Feedback for student responses

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `type` (string, enum, required)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

This element must be one of the following enum values:

* `custom`
* `default`

## `value` (string, required)

# `partialScoring` (boolean, required)

Indicates if partial scoring should be used

# `maxSelections` (number, required)

The maximum number of token selections a user can make when responding

# `mode` (string, enum, required)

This element must be one of the following enum values:

* `paragraphs`
* `sentence`
* `word`

# `tokens` (array, required)

The selectable text tokens in the main text content

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `text` (string, required)

The token text

## `start` (number, required)

The start point in the main text for this token

## `end` (number, required)

The end point in the main text for this token

## `correct` (boolean, required)

Is selected does the token represent a correct response

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `Feedback` (object)

Properties of the `Feedback` object:

### `type` (string, enum, required)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

This element must be one of the following enum values:

* `custom`
* `default`

### `value` (string, required)

## `FeedbackType` (string)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

## `SelectionMode` (string)

## `TextToken` (object)

Properties of the `TextToken` object:

### `text` (string, required)

The token text

### `start` (number, required)

The start point in the main text for this token

### `end` (number, required)

The end point in the main text for this token

### `correct` (boolean, required)

Is selected does the token represent a correct response