Pie Model Object for @pie-elements/fraction-model

The schema defines the following properties:

# `prompt` (string, required)

The user prompt/item stem

# `promptEnabled` (boolean)

Determines if prompt should show

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