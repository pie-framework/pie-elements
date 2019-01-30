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

# `correctResponse` (array, required)

The defintion of the correct response to the question

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `category` (string, required)

The identifier for the category

## `choices` (array, required)

Array of identifiers for the choices that belong in this category

The object is an array with all elements of the type `string`.

# `config` (object, required)

Configuration options for the presentataion of the interaction

Properties of the `config` object:

## `choices` (object, required)

Properties of the `choices` object:

### `columns` (number, required)

Default: `2`

### `position` (string, enum, required)

This element must be one of the following enum values:

* `above`
* `below`

### `label` (string, required)

Label to be displayed for the choices

### `shuffle` (boolean, required)

Should the choices be shuffled

### `removeafterplacing` (boolean, required)

Indicates if the choice, after it is dragged into a category, should be removed from the choices
area or should remain in place.

## `categories` (object, required)

Properties of the `categories` object:

### `columns` (number, required)

The number of columns in which to present the categories

Default: `2`

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

## `CategoryCorrectResponse` (object)

Properties of the `CategoryCorrectResponse` object:

### `category` (string, required)

The identifier for the category

### `choices` (array, required)

Array of identifiers for the choices that belong in this category

The object is an array with all elements of the type `string`.

## `ChoicesConfig` (object)

Properties of the `ChoicesConfig` object:

### `columns` (number, required)

Default: `2`

### `position` (string, enum, required)

This element must be one of the following enum values:

* `above`
* `below`

### `label` (string, required)

Label to be displayed for the choices

### `shuffle` (boolean, required)

Should the choices be shuffled

### `removeafterplacing` (boolean, required)

Indicates if the choice, after it is dragged into a category, should be removed from the choices
area or should remain in place.

## `ChoicesPosition` (string)

## `CategoriesConfig` (object)

Properties of the `CategoriesConfig` object:

### `columns` (number, required)

The number of columns in which to present the categories

Default: `2`