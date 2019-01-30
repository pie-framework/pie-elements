Model for the @pie-elements/extended-text-entry Interaction

The schema defines the following properties:

# `feedback` (object)

Properties of the `feedback` object:

## `type` (string, enum, required)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

This element must be one of the following enum values:

* `custom`
* `default`

## `value` (string, required)

# `width` (string)

Width the editor should take. USE CSS-style definition.

# `height` (string)

Height the editor should take. USE CSS-style definition.

# `disabled` (boolean)

Should the editor be disabled?

Default: `false`

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

## `Feedback` (object)

Properties of the `Feedback` object:

### `type` (string, enum, required)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message

This element must be one of the following enum values:

* `custom`
* `default`

### `value` (string, required)

## `FeedbackType` (string)

The type of feedback to use:
   `default` = a standard feedback message
   `custom` = a customized feedback message