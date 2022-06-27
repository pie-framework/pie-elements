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
* `geometry`
* `miscellaneous`
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

# `spanishInput` (boolean)

Whether a control to allow insertion of spanish characters should be displayed

Default: `false`

# `specialInput` (boolean)

Whether a control to allow insertion of special characters should be displayed

Default: `false`

# `multiple` (boolean)

Indicates if multiple parts are enabled

# `prompt` (string)

The question prompt

# `promptEnabled` (boolean)

Indicates if the prompt is enabled

# `studentInstructions` (string)

Indicates student instructions

# `teacherInstructions` (string)

Indicates teacher instructions

# `feedbackEnabled` (boolean, required)

Indicates if Feedback is enabled

# `rationaleEnabled` (boolean, required)

Indicates if Rationale are enabled

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `playerSpellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the player. Default value is true

# `studentInstructionsEnabled` (boolean, required)

Indicates if Student Instructions are enabled

# `teacherInstructionsEnabled` (boolean, required)

Indicates if Teacher Instructions are enabled

# `toolbarEditorPosition` (string, enum)

This element must be one of the following enum values:

* `bottom`
* `top`

# `playersToolbarPosition` (string, enum)

Indicates the editor's toolbar position for the player, which can be 'bottom' or 'top'

This element must be one of the following enum values:

* `bottom`
* `top`

Default: `": 'bottom'"`

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

## `ConfigurePropWithEnabled` (object)

Properties of the `ConfigurePropWithEnabled` object:

### `settings` (boolean)

Indicates if the item has to be displayed in the Settings Panel

### `label` (string)

Indicates the label for the item that has to be displayed in the Settings Panel

### `enabled` (boolean)

Indicates the value of the item if it affects config-ui
(eg.: if item is a switch and displaying an input on the config-ui depends on the switch value: on/off)

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