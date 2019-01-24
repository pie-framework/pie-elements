# select-text-pie

Pie Model Object for @pie-elements/select-text

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**prompt**|`string`|The user prompt/item stem| :white_check_mark: Yes|
|**text**|`string`|The passage of text from which user may select responses| :white_check_mark: Yes|
|**highlightChoices**|`boolean`|Indicates if the parts of text that are choosable, should be highligned when presented to student.| :white_check_mark: Yes|
|**feedback**|`object[]`|Feedback for student responses| :white_check_mark: Yes|
|**partialScoring**|`boolean`|Indicates if partial scoring should be used| :white_check_mark: Yes|
|**maxSelections**|`number`|The maximum number of token selections a user can make when responding| :white_check_mark: Yes|
|**mode**|`string`|-| :white_check_mark: Yes|
|**tokens**|`object[]`|The selectable text tokens in the main text content| :white_check_mark: Yes|
|**id**|`string`|Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.| :white_check_mark: Yes|
|**element**|`string`|The html Element tag name| :white_check_mark: Yes|

Additional properties are not allowed.

## select-text-pie.prompt

The user prompt/item stem

* **Type**: `string`
* **Required**: No

## select-text-pie.text

The passage of text from which user may select responses

* **Type**: `string`
* **Required**: No

## select-text-pie.highlightChoices

Indicates if the parts of text that are choosable, should be highligned when presented to student.

* **Type**: `boolean`
* **Required**: No, default: `false`

## select-text-pie.feedback

Feedback for student responses

* **Type**: `object[]`
* **Required**: No

## select-text-pie.partialScoring

Indicates if partial scoring should be used

* **Type**: `boolean`
* **Required**: No

## select-text-pie.maxSelections

The maximum number of token selections a user can make when responding

* **Type**: `number`
* **Required**: No

## select-text-pie.mode

* **Type**: `string`
* **Required**: No
* **Allowed values**: `"paragraphs"`, `"sentence"`, `"word"`

## select-text-pie.tokens

The selectable text tokens in the main text content

* **Type**: `object[]`
* **Required**: No

## select-text-pie.id

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

* **Type**: `string`
* **Required**: No

## select-text-pie.element

The html Element tag name

* **Type**: `string`
* **Required**: No


