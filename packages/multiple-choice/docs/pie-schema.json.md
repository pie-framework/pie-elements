# multiple-choice-pie

Model for the Choice Interaction

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**choices**|`object[]`|The choice options for the question| :white_check_mark: Yes|
|**prompt**|`string`|The question prompt or item stem|No|
|**keyMode**|`string`|-|No|
|**choiceMode**|`number`|-|No|
|**id**|`string`|Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.| :white_check_mark: Yes|
|**element**|`string`|The html Element tag name| :white_check_mark: Yes|

Additional properties are not allowed.

## multiple-choice-pie.choices

The choice options for the question

* **Type**: `object[]`
* **Required**: No

## multiple-choice-pie.prompt

The question prompt or item stem

* **Type**: `string`
* **Required**: No

## multiple-choice-pie.keyMode

* **Type**: `string`
* **Required**: No
* **Allowed values**: `"letters"`, `"numbers"`

## multiple-choice-pie.choiceMode

* **Type**: `number`
* **Required**: No
* **Allowed values**: `0`, `1`

## multiple-choice-pie.id

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

* **Type**: `string`
* **Required**: No

## multiple-choice-pie.element

The html Element tag name

* **Type**: `string`
* **Required**: No


