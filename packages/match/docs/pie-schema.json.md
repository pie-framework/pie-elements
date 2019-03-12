Model for the @pie-elements/match Interaction

The schema defines the following properties:

# `rows` (array, required)

The rows of choices to be presented.

Additional restrictions:

* Minimum items: `1`

# `shuffled` (boolean)

Indicates if the order of the rows should be randomly sorted on render

# `layout` (number, required)

The number of columns to be presented

# `headers` (array, required)

Array of strings for column headers

Additional restrictions:

* Minimum items: `1`

# `responseType` (string, enum, required)

This element must be one of the following enum values:

* `checkbox`
* `radio`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `MatchRow` (object)

One row in the match list.

Properties of the `MatchRow` object:

### `id` (string, required)

Identifier for a row

### `title` (string, required)

Title that will be displayed for the row

### `values` (array, required)

Array of boolean values indicating which columns are selected in the row

Additional restrictions:

* Minimum items: `1`

## `ResponseType` (string)