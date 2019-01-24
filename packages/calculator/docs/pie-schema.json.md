Model Object for @pie-elements/calculator

The schema defines the following properties:

# `mode` (string, enum, required)

This element must be one of the following enum values:

* `basic`
* `scientific`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `CalculatorMode` (string)