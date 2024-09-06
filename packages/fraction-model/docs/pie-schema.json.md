The schema defines the following properties:

# `correctResponse` (array, required)

Array of ResponseObject for correct response

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `id` (number, required)

Indicates the response id for bar or pie model

## `value` (number, required)

Indicates the selected response sector for model value

# `title` (string, required)

The title prompt of the item

# `question` (string, required)

The question prompt or item stem

# `modelTypeSelected` (string, enum)

Indicates if the model type should be Bar or Pie model

This element must be one of the following enum values:

* `bar`
* `pie`

Default: `": 'bar'"`

# `maxModelSelected` (number)

Indicates max no of models to be selected

Default: `": 1"`

# `partsPerModel` (number)

Indicates parts per model to be selected

Default: `": 5"`

# `allowedStudentConfig` (boolean)

Indicates if student can configure no of models and parts per model

Default: `": false"`

# `showGraphLabels` (boolean)

Determines if graph labels visible or not

Default: `": false"`

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

## `ResponseObject` (object)

Model for the

Properties of the `ResponseObject` object:

### `id` (number, required)

Indicates the response id for bar or pie model

### `value` (number, required)

Indicates the selected response sector for model value