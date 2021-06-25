Model for the RubricPie Interaction

The schema defines the following properties:

# `points` (array)

Indicates the score points labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

# `sampleAnswers` (array)

Indicates the sample answers labels. Starting from 0 to max

The object is an array with all elements of the type `object`.

The array object has the following properties:

# `maxPoints` (number)

Indicates the max limit for scoring points

# `excludeZeros` (boolean)

Indicates if point 0 should be shown

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name