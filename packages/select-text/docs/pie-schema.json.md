Pie Model Object for @pie-elements/select-text

The schema defines the following properties:

# `maxSelections` (number)

The maximum number of token selections a user can make when responding

# `mode` (string, enum)

The selected mode for tokenizing the text.
This is only used in the config UI to present the mode by which text has been tokenized for selection.
If importing an item, only set this property it the text tokens are strictly parsed by of these methods.

This element must be one of the following enum values:

* `paragraph`
* `sentence`
* `word`

# `partialScoring` (boolean)

Indicates if partial scoring should be used

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `tokens` (array, required)

The selectable text tokens in the main text content

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `text` (string)

The token text

## `start` (number, required)

The start point in the main text for this token

## `end` (number, required)

The end point in the main text for this token

## `correct` (boolean)

Is selected does the token represent a correct response

# `text` (string, required)

The passage of text from which user may select responses

# `prompt` (string, required)

The user prompt/item stem

# `highlightChoices` (boolean)

Indicates if the parts of text that are choosable, should be highligned when presented to student.

Default: `false`

# `rationale` (string)

Indicates rationale for correct answer

# `scoringType` (string, enum)

Indicates scoring type

This element must be one of the following enum values:

* `auto`
* `rubric`

# `studentInstructions` (boolean)

Indicates if student instructions are enabled

# `teacherInstructions` (boolean)

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

## `TextToken` (object)

Properties of the `TextToken` object:

### `text` (string)

The token text

### `start` (number, required)

The start point in the main text for this token

### `end` (number, required)

The end point in the main text for this token

### `correct` (boolean)

Is selected does the token represent a correct response