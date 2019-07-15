NOTE: studentInstructions & multipleParts
functionalities are not defined yet - the value for those can belong to
model or to configure (to be moved when the functionality is defined)
Model for the @pie-elements/extended-text-entry Interaction

The schema defines the following properties:

# `dimensions` (object, required)

Properties of the `dimensions` object:

## `width` (string)

Width the editor should take. USE CSS-style definition.

## `height` (string)

Height the editor should take. USE CSS-style definition.

# `equationEditor` (string, enum)

Indicates if equation editor is enabled

This element must be one of the following enum values:

* `Grade 1 - 2`
* `Grade 3 - 5`
* `Grade 6 - 7`
* `Grade 8 - HS`
* `advanced-algebra`
* `everything`
* `geometry`
* `statistics`

# `feedback` (object)

Properties of the `feedback` object:

## `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

## `default` (string)

Indicates the feedback value

# `mathInput` (boolean)

Whether a control to allow insertion of math forumulas should be displayed

Default: `false`

# `multiple` (boolean)

Indicates if multiple parts are enabled

# `prompt` (string)

The question prompt

# `studentInstructions` (boolean)

Indicates if student instructions are enabled

# `teacherInstructions` (boolean)

Indicates if teacher instructions are enabled

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

Indicates if the item has to be displayed

### `label` (string)

Indicates the label for the item

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui (eg.: if item is a switch)

## `Dimensions` (object)

Properties of the `Dimensions` object:

### `width` (string)

Width the editor should take. USE CSS-style definition.

### `height` (string)

Height the editor should take. USE CSS-style definition.

## `DefaultFeedbackType` (object)

Properties of the `DefaultFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

### `default` (string)

Indicates the feedback value