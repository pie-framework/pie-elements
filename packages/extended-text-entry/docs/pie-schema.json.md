NOTE: teacherInstructions, studentInstructions, equationEditor & multipleParts
functionalities are not defined yet - the value for those can belong to
model or to configure (to be moved when the functionality is defined)
NOTE2: mathInput does not have a functionality as well
Model for the @pie-elements/extended-text-entry Interaction

The schema defines the following properties:

# `equationEditor` (boolean, required)

Indicates if equation editor is enabled

# `feedback` (object)

Properties of the `feedback` object:

## `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

## `default` (string)

Indicates the feedback value

# `height` (string)

Height the editor should take. USE CSS-style definition.

# `mathInput` (boolean, required)

Whether a control to allow insertion of math forumulas should be displayed

Default: `false`

# `multiple` (boolean, required)

Indicates if multiple parts are enabled

# `prompt` (string)

The question prompt

# `studentInstructions` (boolean, required)

Indicates if student instructions are enabled

# `teacherInstructions` (boolean, required)

Indicates if teacher instructions are enabled

# `width` (string)

Width the editor should take. USE CSS-style definition.

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

## `DefaultFeedbackType` (object)

Properties of the `DefaultFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

### `default` (string)

Indicates the feedback value