Config Object for @pie-elements/multiple-choice

The schema defines the following properties:

# `addChoice` (boolean)

Whether config view will show a button that allows an author to add more choices

Default: `true`

# `addChoiceButtonLabel` (string)

The label shown on the add choice button

Default: `"Add New Choice"`

# `addFeedBack` (boolean)

Show fields that allow author to edit content / messages that student role user would see if item 
is in evaluate mode

Default: `true`

# `answerChoiceCount` (number)

The number of empty choices to show in config view if no choice model is provided

Default: `4`

Additional restrictions:

* Minimum: `1`

# `deleteChoice` (boolean)

Allow choices to be deleted by author

Default: `true`

# `settingsSelectChoiceMode` (boolean)

Indicates whether the settings panel will allow an author to modify the choice 
mode (radio / checkboxes) for single or multi-choice questions

Default: `true`

# `settingsSelectChoiceModeLabel` (string)

The label presented above the `settingsSelectChoiceMode` setting

Default: `"Choice Mode"`

# `settingsSelectChoicePrefixes` (boolean)

Indicates whether the settings panel will allow the author to chose prefixes to be prepended to 
choices, the author may choose `letters`, `numbers` or `none`

Default: `true`

# `settingsChoicePrefixesLabel` (string)

The label for the `settingsSelectChoicePrefixes` section in the settings panel

Default: `"Choice Prefixes"`

# `settingsPartialScoring` (boolean)

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

Default: `true`

# `settingsConfigShuffle` (boolean)

Indicates whether the settings panel will allow author to control choice shuffling

Default: `true`

# `showPrompt` (boolean)

Determines whether prompt field will be displayed or not

Default: `true`

# `promptLabel` (string)

The label for the item stem/prompt field

Default: `"Item Stemm"`