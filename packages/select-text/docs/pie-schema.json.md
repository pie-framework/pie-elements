Pie Model Object for @pie-elements/select-text

The schema defines the following properties:

# `prompt` (string)

The user prompt/item stem

# `text` (string, required)

The passage of text from which user may select responses

# `highlightChoices` (boolean)

Indicates if the parts of text that are choosable, should be highligned when presented to student.

Default: `false`

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `partialScoring` (boolean)

Indicates if partial scoring should be used

# `partialScoringLabel` (string)

Partial scoring label

# `maxSelections` (number, required)

The maximum number of token selections a user can make when responding

# `mode` (string, enum)

The selected mode for tokenizing the text.
This is only used in the config UI to present the mode by which text has been tokenized for selection.
If importing an item, only set this property it the text tokens are strictly parsed by of these methods.

This element must be one of the following enum values:

* `paragraph`
* `sentence`
* `word`

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

# `configure` (object, required)

Properties of the `configure` object:

## `promptLabel` (string)

The question prompt or item stem

## `enableContentChange` (boolean)

Indicates if the content can change

## `contentLabel` (string)

Content label

## `enableHighlightChoices` (boolean)

Indicates if the choices are highlighted

## `highlightChoicesLabel` (string)

Label for highlight choices checkbox

## `enableTokensChange` (boolean)

Indicates if tokens are changeable

## `tokensLabel` (string)

Label for the tokens

## `enableFeedback` (boolean)

Indicates if feedback is enabled

## `setCorrectAnswersLabel` (string)

Label for Set Correct Answers switch

## `showMode` (boolean)

Indicates if the selected mode of the text tokens is displayed

## `modeLabel` (string)

Label to display the selected mode of the text tokens

## `showSelections` (boolean)

Indicates if the available selections number is displayed

## `availableSelectionsLabel` (string)

Label to display the number of available selections

## `showCorrectAnswersNumber` (boolean)

Indicates if the correct answers number is displayed

## `correctAnswersLabel` (string)

Label to display the number of correct answers

## `showSelectionCount` (boolean)

Indicates if selection count is displayed

## `selectionCountLabel` (string)

Label for selection count

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

## `SelectTextPieConfigure` (object)

Properties of the `SelectTextPieConfigure` object:

### `promptLabel` (string)

The question prompt or item stem

### `enableContentChange` (boolean)

Indicates if the content can change

### `contentLabel` (string)

Content label

### `enableHighlightChoices` (boolean)

Indicates if the choices are highlighted

### `highlightChoicesLabel` (string)

Label for highlight choices checkbox

### `enableTokensChange` (boolean)

Indicates if tokens are changeable

### `tokensLabel` (string)

Label for the tokens

### `enableFeedback` (boolean)

Indicates if feedback is enabled

### `setCorrectAnswersLabel` (string)

Label for Set Correct Answers switch

### `showMode` (boolean)

Indicates if the selected mode of the text tokens is displayed

### `modeLabel` (string)

Label to display the selected mode of the text tokens

### `showSelections` (boolean)

Indicates if the available selections number is displayed

### `availableSelectionsLabel` (string)

Label to display the number of available selections

### `showCorrectAnswersNumber` (boolean)

Indicates if the correct answers number is displayed

### `correctAnswersLabel` (string)

Label to display the number of correct answers

### `showSelectionCount` (boolean)

Indicates if selection count is displayed

### `selectionCountLabel` (string)

Label for selection count