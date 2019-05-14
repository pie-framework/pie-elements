Pie Model Object for @pie-elements/categorize

The schema defines the following properties:

# `choices` (array, required)

The available choices

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string, required)

Identifier for the choice

## `content` (string, required)

The xhtml content for the choice

## `categoryCount` (string,number)

## `correctResponseCount` (string,number)

# `choicesPerRow` (number)

The number of columns in which to present the choices

Default: `2`

# `categoriesPerRow` (number)

The number of columns in which to present the categories

Default: `2`

# `choicesPosition` (string, enum, required)

This element must be one of the following enum values:

* `above`
* `below`
* `left`
* `right`

# `choicesLabel` (string, required)

Label to be displayed for the choices

# `lockChoiceOrder` (boolean, required)

Should the choices be shuffled or not

# `removeTilesAfterPlacing` (boolean, required)

Indicates if the choice, after it is dragged into a category, should be removed from the choices
area or should remain in place.

# `categories` (array, required)

The categories in which choices may be placed

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string, required)

Identifier for the category

## `label` (string, required)

The label to display with the category.

## `choices` (array, required)

The choices presented in this category

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `id` (string, required)

Identifier for the choice

### `content` (string, required)

The xhtml content for the choice

### `categoryCount` (string,number)

### `correctResponseCount` (string,number)

# `correctResponse` (array, required)

The defintion of the correct response to the question

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `category` (string, required)

The identifier for the category

## `choices` (array, required)

Array of identifiers for the choices that belong in this category

The object is an array with all elements of the type `string`.

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `scoring` (object)

Properties of the `scoring` object:

## `weighting` (object)

Properties of the `weighting` object:

### `enabled` (boolean, required)

Indicates if weighting is enabled

### `rules` (array)

Array of rules for weighting

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `category` (string, required)

The id of the category

#### `points` (number, required)

The value of weighting

## `partial` (object)

Properties of the `partial` object:

### `enabled` (boolean, required)

Indicates if partial scoring is enabled

### `rules` (array)

Array of rules for partial scoring

Additional restrictions:

* Minimum items: `1`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `CategoryChoice` (object)

Properties of the `CategoryChoice` object:

### `id` (string, required)

Identifier for the choice

### `content` (string, required)

The xhtml content for the choice

### `categoryCount` (string,number)

### `correctResponseCount` (string,number)

## `ChoicesPosition` (string)

## `Category` (object)

Properties of the `Category` object:

### `id` (string, required)

Identifier for the category

### `label` (string, required)

The label to display with the category.

### `choices` (array, required)

The choices presented in this category

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `id` (string, required)

Identifier for the choice

#### `content` (string, required)

The xhtml content for the choice

#### `categoryCount` (string,number)

#### `correctResponseCount` (string,number)

## `CategoryCorrectResponse` (object)

Properties of the `CategoryCorrectResponse` object:

### `category` (string, required)

The identifier for the category

### `choices` (array, required)

Array of identifiers for the choices that belong in this category

The object is an array with all elements of the type `string`.

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

## `ScoringConfig` (object)

Properties of the `ScoringConfig` object:

### `weighting` (object)

Properties of the `weighting` object:

#### `enabled` (boolean, required)

Indicates if weighting is enabled

#### `rules` (array)

Array of rules for weighting

The object is an array with all elements of the type `object`.

The array object has the following properties:

##### `category` (string, required)

The id of the category

##### `points` (number, required)

The value of weighting

### `partial` (object)

Properties of the `partial` object:

#### `enabled` (boolean, required)

Indicates if partial scoring is enabled

#### `rules` (array)

Array of rules for partial scoring

Additional restrictions:

* Minimum items: `1`

## `WeightingConfig` (object)

Properties of the `WeightingConfig` object:

### `enabled` (boolean, required)

Indicates if weighting is enabled

### `rules` (array)

Array of rules for weighting

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `category` (string, required)

The id of the category

#### `points` (number, required)

The value of weighting

## `WeightingConfigRule` (object)

Properties of the `WeightingConfigRule` object:

### `category` (string, required)

The id of the category

### `points` (number, required)

The value of weighting

## `PartialScoringConfig` (object)

Properties of the `PartialScoringConfig` object:

### `enabled` (boolean, required)

Indicates if partial scoring is enabled

### `rules` (array)

Array of rules for partial scoring

Additional restrictions:

* Minimum items: `1`

## `PartialScoringRule` (object)

Properties of the `PartialScoringRule` object:

### `category` (string, required)

The id of the category

### `rules` (array, required)

Array of rules for partial scoring for the category

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `count` (number, required)

Indicates the number of correct answers

#### `percent` (number, required)

Indicates the percentage for partial scoring

## `PartialScoringCategoryRule` (object)

Properties of the `PartialScoringCategoryRule` object:

### `count` (number, required)

Indicates the number of correct answers

### `percent` (number, required)

Indicates the percentage for partial scoring