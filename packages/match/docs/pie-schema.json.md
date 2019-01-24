# match-pie

Model for the @pie-elements/match Interaction

**Properties**

|   |Type|Description|Required|
|---|----|-----------|--------|
|**rows**|`array[1-*]`|The rows of choices to be presented.| :white_check_mark: Yes|
|**shuffled**|`boolean`|Indicates if the order of the rows should be randomly sorted on render| :white_check_mark: Yes|
|**layout**|`number`|The number of columns to be presented| :white_check_mark: Yes|
|**headers**|`array[1-*]`|Array of strings for column headers| :white_check_mark: Yes|
|**responseType**|`string`|-| :white_check_mark: Yes|
|**id**|`string`|Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.| :white_check_mark: Yes|
|**element**|`string`|The html Element tag name| :white_check_mark: Yes|

Additional properties are not allowed.

## match-pie.rows

The rows of choices to be presented.

* **Type**: `array[1-*]`
* **Required**: No

## match-pie.shuffled

Indicates if the order of the rows should be randomly sorted on render

* **Type**: `boolean`
* **Required**: No

## match-pie.layout

The number of columns to be presented

* **Type**: `number`
* **Required**: No

## match-pie.headers

Array of strings for column headers

* **Type**: `array[1-*]`
* **Required**: No

## match-pie.responseType

* **Type**: `string`
* **Required**: No
* **Allowed values**: `"checkbox"`, `"radio"`

## match-pie.id

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

* **Type**: `string`
* **Required**: No

## match-pie.element

The html Element tag name

* **Type**: `string`
* **Required**: No


