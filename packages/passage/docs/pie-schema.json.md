Model for the @pie-elements/passage

The schema defines the following properties:

# `passages` (array, required)

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `title` (string, required)

The title of the passage

## `text` (string, required)

The content of the passage

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `Passage` (object)

Properties of the `Passage` object:

### `title` (string, required)

The title of the passage

### `text` (string, required)

The content of the passage