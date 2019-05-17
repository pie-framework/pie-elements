Model for the @pie-elements/hotspot Interaction

The schema defines the following properties:

# `prompt` (string)

The question prompt or item stem

# `imageUrl` (string)

The image over which hotspots will be drawn

# `shapes` (array, required)

The shapes/hotspots of the question

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (string)

the id of the shape

## `correct` (boolean)

indicates if the shape is correct

## `height` (number, required)

the height of the shape

## `width` (number, required)

the width of the shape

## `x` (number, required)

the x position of the shape

## `y` (number, required)

the y position of the shape

# `multipleCorrect` (boolean, required)

Indicates if the item supports multiple correct answers

# `partialScoring` (boolean, required)

Indicates if the item should use partial scoring

# `dimensions` (array, required)

The dimensions of the drawable section

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `height` (number, required)

the height of the section

## `width` (number, required)

the width of the section

# `hotspotColor` (string)

The color that fills the hotspot

# `hotspotList` (array)

The filling hotspot color options

The object is an array with all elements of the type `string`.

# `outlineColor` (string)

The outline color of the hotspot

# `outlineList` (array)

The outline hotspot color options

The object is an array with all elements of the type `string`.

# `rationale` (string)

Indicates the value for rationale

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `Shape` (object)

Properties of the `Shape` object:

### `id` (string)

the id of the shape

### `correct` (boolean)

indicates if the shape is correct

### `height` (number, required)

the height of the shape

### `width` (number, required)

the width of the shape

### `x` (number, required)

the x position of the shape

### `y` (number, required)

the y position of the shape

## `Dimension` (object)

Properties of the `Dimension` object:

### `height` (number, required)

the height of the section

### `width` (number, required)

the width of the section