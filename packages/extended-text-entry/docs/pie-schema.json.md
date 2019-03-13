Model for the @pie-elements/extended-text-entry Interaction

The schema defines the following properties:

# `feedback` (object)

Properties of the `feedback` object:

## `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

## `default` (string)

Indicates the feedback value

# `width` (string)

Width the editor should take. USE CSS-style definition.

# `height` (string)

Height the editor should take. USE CSS-style definition.

# `prompt` (string)

The question prompt

# `showMathInput` (boolean, required)

Whether a control to allow insertion of math forumulas should be displayed

Default: `false`

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

## `DefaultFeedbackType` (object)

Properties of the `DefaultFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

### `default` (string)

Indicates the feedback value