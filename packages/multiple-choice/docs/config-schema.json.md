# multiple-choice-configure

Config Object for @pie-elements/multiple-choice

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**addChoice**|`boolean`|Whether config view will show a button that allows an author to add more choices|No, default: `true`|
|**addChoiceButtonLabel**|`string`|The label shown on the add choice button|No, default: `"Add New Choice"`|
|**addFeedBack**|`boolean`|Show fields that allow author to edit content / messages that student role user would see if item 
is in evaluate mode|No, default: `true`|
|**answerChoiceCount**|`number`|The number of empty choices to show in config view if no choice model is provided|No, default: `4`|
|**deleteChoice**|`boolean`|Allow choices to be deleted by author|No, default: `true`|
|**settingsSelectChoiceMode**|`boolean`|Indicates whether the settings panel will allow an author to modify the choice 
mode (radio / checkboxes) for single or multi-choice questions|No, default: `true`|
|**settingsSelectChoiceModeLabel**|`string`|The label presented above the `settingsSelectChoiceMode` setting|No, default: `"Choice Mode"`|
|**settingsSelectChoicePrefixes**|`boolean`|Indicates whether the settings panel will allow the author to chose prefixes to be prepended to 
choices, the author may choose `letters`, `numbers` or `none`|No, default: `true`|
|**settingsChoicePrefixesLabel**|`string`|The label for the `settingsSelectChoicePrefixes` section in the settings panel|No, default: `"Choice Prefixes"`|
|**settingsPartialScoring**|`boolean`|Indicates whether the settings panel wil allow the author to modify settings for partial scoring|No, default: `true`|
|**settingsConfigShuffle**|`boolean`|Indicates whether the settings panel will allow author to control choice shuffling|No, default: `true`|
|**showPrompt**|`boolean`|Determines whether prompt field will be displayed or not|No, default: `true`|
|**promptLabel**|`string`|The label for the item stem/prompt field|No, default: `"Item Stemm"`|

Additional properties are not allowed.

## multiple-choice-configure.addChoice

Whether config view will show a button that allows an author to add more choices

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.addChoiceButtonLabel

The label shown on the add choice button

* **Type**: `string`
* **Required**: No, default: `"Add New Choice"`

## multiple-choice-configure.addFeedBack

Show fields that allow author to edit content / messages that student role user would see if item 
is in evaluate mode

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.answerChoiceCount

The number of empty choices to show in config view if no choice model is provided

* **Type**: `number`
* **Required**: No, default: `4`
* **Minimum**:` >= 1`

## multiple-choice-configure.deleteChoice

Allow choices to be deleted by author

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.settingsSelectChoiceMode

Indicates whether the settings panel will allow an author to modify the choice 
mode (radio / checkboxes) for single or multi-choice questions

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.settingsSelectChoiceModeLabel

The label presented above the `settingsSelectChoiceMode` setting

* **Type**: `string`
* **Required**: No, default: `"Choice Mode"`

## multiple-choice-configure.settingsSelectChoicePrefixes

Indicates whether the settings panel will allow the author to chose prefixes to be prepended to 
choices, the author may choose `letters`, `numbers` or `none`

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.settingsChoicePrefixesLabel

The label for the `settingsSelectChoicePrefixes` section in the settings panel

* **Type**: `string`
* **Required**: No, default: `"Choice Prefixes"`

## multiple-choice-configure.settingsPartialScoring

Indicates whether the settings panel wil allow the author to modify settings for partial scoring

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.settingsConfigShuffle

Indicates whether the settings panel will allow author to control choice shuffling

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.showPrompt

Determines whether prompt field will be displayed or not

* **Type**: `boolean`
* **Required**: No, default: `true`

## multiple-choice-configure.promptLabel

The label for the item stem/prompt field

* **Type**: `string`
* **Required**: No, default: `"Item Stemm"`


