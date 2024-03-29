Model for the @pie-elements/match-list Interaction

The schema defines the following properties:

# `prompt` (string)

The question prompt or item stem

# `prompts` (array, required)

The question prompts that are going to be displayed.

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string,number, required)

Identifier for a question prompt

## `title` (string, required)

Text that will be displayed in the question prompt row

## `relatedAnswer` (string,number, required)

Id for the correct answer for this question prompt

# `answers` (array, required)

The answer rows that are going to be displayed.

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string,number, required)

Identifier for an answer row

## `title` (string, required)

Text that will be displayed in the answer row

# `lockChoiceOrder` (boolean)

Indicates if answers should be locked in order according to the model or if they should be shuffed
true - order is respected according to model
false - order is shuffled

# `duplicates` (boolean)

Indicates if duplicates are allowed

# `language` (string)

Indicates the language of the component
Supported options: en, es, en_US, en-US, es_ES, es-ES, es_MX, es-MX

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `Prompt` (object)

Multiple question prompts

Properties of the `Prompt` object:

### `id` (string,number, required)

Identifier for a question prompt

### `title` (string, required)

Text that will be displayed in the question prompt row

### `relatedAnswer` (string,number, required)

Id for the correct answer for this question prompt

## `Answer` (object)

Multiple answers

Properties of the `Answer` object:

### `id` (string,number, required)

Identifier for an answer row

### `title` (string, required)

Text that will be displayed in the answer row