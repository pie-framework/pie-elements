Model for the @pie-elements/image-cloze-association Interaction

The schema defines the following properties:

# `prompt` (string)

The question prompt or item stem

# `rationaleEnabled` (boolean)

Indicates if Rationale is enabled

# `teacherInstructionsEnabled` (boolean)

Indicates if Teacher Instructions are enabled

# `studentInstructionsEnabled` (boolean)

Indicates if Student Instructions are enabled

# `image` (object)

Properties of the `image` object:

## `src` (string)

The url of the image

## `width` (number)

The width of the image

## `height` (number)

The height of the image

# `responseContainers` (array)

List of the response containers
The response containers are the areas where the images are dragged in

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `x` (number)

The x coordinate of the response container

## `y` (number)

The y coordinate of the response container

## `width` (string)

The width of the response container

## `height` (string)

The height of the response container

# `stimulus` (string)

The question stimulus

# `possibleResponses` (array)

List of img tags that are the possible responses

The object is an array with all elements of the type `string`.

# `validation` (object)

Properties of the `validation` object:

## `validResponse` (object)

Properties of the `validResponse` object:

### `score` (number)

The score of the response

### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

#### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

## `altResponses` (array)

List of alternate responses

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `score` (number)

The score of the response

### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

#### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

# `partialScoring` (boolean)

Indicates if the item should use partial scoring

# `maxResponsePerZone` (number)

Indicates how many responses can be placed in a response container

Default: `1`

# `duplicateResponses` (boolean)

Indicates if duplicate responses are allowed

# `showDashedBorder` (boolean)

Indicates if the response containers should have a dashed border

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

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

## `Image` (object)

Properties of the `Image` object:

### `src` (string)

The url of the image

### `width` (number)

The width of the image

### `height` (number)

The height of the image

## `ResponseContainer` (object)

Properties of the `ResponseContainer` object:

### `x` (number)

The x coordinate of the response container

### `y` (number)

The y coordinate of the response container

### `width` (string)

The width of the response container

### `height` (string)

The height of the response container

## `Validation` (object)

Properties of the `Validation` object:

### `validResponse` (object)

Properties of the `validResponse` object:

#### `score` (number)

The score of the response

#### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

##### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

### `altResponses` (array)

List of alternate responses

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `score` (number)

The score of the response

#### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

##### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.

## `ValidResponse` (object)

Properties of the `ValidResponse` object:

### `score` (number)

The score of the response

### `value` (object)

The value of the response
Each value is an object with a property "images"

Properties of the `value` object:

#### `images` (array)

An array containing a string that is a img tag

The object is an array with all elements of the type `string`.