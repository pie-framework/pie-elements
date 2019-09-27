Model for the @pie-elements/hotspot Interaction

The schema defines the following properties:

# `prompt` (string)

The question prompt or item stem

# `promptEnabled` (boolean)

Indicates if the prompt is enabled

# `imageUrl` (string)

The image over which hotspots will be drawn

# `shapes` (object, required)

Properties of the `shapes` object:

## `rectangles` (array, required)

the rectangles of the shape

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `id` (string)

the id of the rectangle

### `correct` (boolean)

indicates if the rectangle is correct

### `height` (number, required)

the height of the rectangle

### `width` (number, required)

the width of the rectangle

### `x` (number, required)

the x position of the rectangle

### `y` (number, required)

the y position of the rectangle

## `polygons` (array, required)

the polygons of the shape

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `id` (string)

the id of the polygon

### `correct` (boolean)

indicates if the polygon is correct

### `points` (array, required)

the points of the polygon

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `x` (number, required)

the x position

#### `y` (number, required)

the y position

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

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `Shape` (object)

Properties of the `Shape` object:

### `rectangles` (array, required)

the rectangles of the shape

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `id` (string)

the id of the rectangle

#### `correct` (boolean)

indicates if the rectangle is correct

#### `height` (number, required)

the height of the rectangle

#### `width` (number, required)

the width of the rectangle

#### `x` (number, required)

the x position of the rectangle

#### `y` (number, required)

the y position of the rectangle

### `polygons` (array, required)

the polygons of the shape

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `id` (string)

the id of the polygon

#### `correct` (boolean)

indicates if the polygon is correct

#### `points` (array, required)

the points of the polygon

The object is an array with all elements of the type `object`.

The array object has the following properties:

##### `x` (number, required)

the x position

##### `y` (number, required)

the y position

## `Rectangle` (object)

Properties of the `Rectangle` object:

### `id` (string)

the id of the rectangle

### `correct` (boolean)

indicates if the rectangle is correct

### `height` (number, required)

the height of the rectangle

### `width` (number, required)

the width of the rectangle

### `x` (number, required)

the x position of the rectangle

### `y` (number, required)

the y position of the rectangle

## `Polygon` (object)

Properties of the `Polygon` object:

### `id` (string)

the id of the polygon

### `correct` (boolean)

indicates if the polygon is correct

### `points` (array, required)

the points of the polygon

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `x` (number, required)

the x position

#### `y` (number, required)

the y position

## `Point` (object)

Properties of the `Point` object:

### `x` (number, required)

the x position

### `y` (number, required)

the y position

## `Dimension` (object)

Properties of the `Dimension` object:

### `height` (number, required)

the height of the section

### `width` (number, required)

the width of the section