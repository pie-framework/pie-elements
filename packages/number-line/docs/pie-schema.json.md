Model Object for @pie-elements/number-line

The schema defines the following properties:

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `correctResponse` (object, required)

Array that returns responses

# `partialScoring` (boolean, required)

Indicates if partial scoring is enabled

# `graph` (object, required)

Properties of the `graph` object:

## `arrows` (object, required)

Properties of the `arrows` object:

### `left` (boolean, required)

### `right` (boolean, required)

## `width` (number, required)

Indicates domain representation width

## `domain` (object, required)

Properties of the `domain` object:

### `min` (number, required)

### `max` (number, required)

## `maxNumberOfPoints` (number, required)

Indicates the maximum number of correct response values

## `tick` (object, required)

Properties of the `tick` object:

### `minor` (number, required)

smallest tick - These ticks don't have labels.

### `major` (number, required)

larger tick - These ticks have labels.

## `title` (string)

the title under the graph

## `exhibitOnly` (boolean, required)

Indicates if the exhibit mode is enabled

## `initialType` (string, enum, required)

Indicates the initial type of response

This element must be one of the following enum values:

* `LEE`
* `LEF`
* `LFE`
* `LFF`
* `PF`
* `REN`
* `REP`
* `RFN`
* `RFP`

## `availableTypes` (object, required)

Indicates the available types of responses

Properties of the `availableTypes` object:

### `PF` (boolean, required)

Indicates if full point is available

### `LFF` (boolean, required)

Indicates if line with full left & right point is available

### `LEF` (boolean, required)

Indicates if line with empty left & full right point is available

### `LFE` (boolean, required)

Indicates if line with full left & empty right point is available

### `LEE` (boolean, required)

Indicates if line with empty left & right point is available

### `RFN` (boolean, required)

Indicates if ray with full point and negative direction is available

### `REN` (boolean, required)

Indicates if ray with empty point and negative direction is available

### `RFP` (boolean, required)

Indicates if ray with full point and positive direction is available

### `REP` (boolean, required)

Indicates if ray with empty point and positive direction is available

## `initialElements` (object, required)

Array that returns responses

## `labelStep` (string, required)

Indicates the fractional step between 2 labeled ticks

# `prompt` (string)

The question prompt or item stem

# `spellCheckEnabled` (boolean, required)

Indicates if spellcheck is enabled for the author. Default value is true

# `toolbarEditorPosition` (string, enum)

Indicates the editor's toolbar position which can be 'bottom' or 'top'

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

## `ComplexFeedbackType` (object)

Properties of the `ComplexFeedbackType` object:

### `correct` (, required)

Indicates the configuration for feedback when answer is correct

### `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

### `partial`

Indicates the configuration for feedback when answer is partially correct

## `DefaultFeedbackType` (object)

Properties of the `DefaultFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `default`
* `none`

### `default` (string)

Indicates the feedback value

## `CustomFeedbackType` (object)

Properties of the `CustomFeedbackType` object:

### `type` (string, enum, required)

Indicates the feedback type

This element must be one of the following enum values:

* `custom`

### `custom` (string, required)

Indicates the feedback custom value

## `ResponsePoint` (object)

Properties of the `ResponsePoint` object:

### `pointType` (string, enum, required)

Indicates point type

This element must be one of the following enum values:

* `empty`
* `full`

### `type` (string, enum, required)

Indicates the response type

This element must be one of the following enum values:

* `line`
* `point`
* `ray`

### `domainPosition` (number, required)

Indicates response domain position

## `ResponseLine` (object)

Properties of the `ResponseLine` object:

### `leftPoint` (string, enum, required)

Indicates left point (left limit for the line) type

This element must be one of the following enum values:

* `empty`
* `full`

### `rightPoint` (string, enum, required)

Indicates right point (left limit for the line) type

This element must be one of the following enum values:

* `empty`
* `full`

### `size` (number, required)

Indicates line size

### `type` (string, enum, required)

Indicates the response type

This element must be one of the following enum values:

* `line`
* `point`
* `ray`

### `domainPosition` (number, required)

Indicates response domain position

## `ResponseRay` (object)

Properties of the `ResponseRay` object:

### `pointType` (string, enum, required)

Indicates point type

This element must be one of the following enum values:

* `empty`
* `full`

### `direction` (string, enum, required)

Indicates ray direction

This element must be one of the following enum values:

* `negative`
* `positive`

### `type` (string, enum, required)

Indicates the response type

This element must be one of the following enum values:

* `line`
* `point`
* `ray`

### `domainPosition` (number, required)

Indicates response domain position

## `NumberLineDomainConfiguration` (object)

Properties of the `NumberLineDomainConfiguration` object:

### `arrows` (object, required)

Properties of the `arrows` object:

#### `left` (boolean, required)

#### `right` (boolean, required)

### `width` (number, required)

Indicates domain representation width

### `domain` (object, required)

Properties of the `domain` object:

#### `min` (number, required)

#### `max` (number, required)

### `maxNumberOfPoints` (number, required)

Indicates the maximum number of correct response values

### `tick` (object, required)

Properties of the `tick` object:

#### `minor` (number, required)

smallest tick - These ticks don't have labels.

#### `major` (number, required)

larger tick - These ticks have labels.

### `title` (string)

the title under the graph

### `exhibitOnly` (boolean, required)

Indicates if the exhibit mode is enabled

### `initialType` (string, enum, required)

Indicates the initial type of response

This element must be one of the following enum values:

* `LEE`
* `LEF`
* `LFE`
* `LFF`
* `PF`
* `REN`
* `REP`
* `RFN`
* `RFP`

### `availableTypes` (object, required)

Indicates the available types of responses

Properties of the `availableTypes` object:

#### `PF` (boolean, required)

Indicates if full point is available

#### `LFF` (boolean, required)

Indicates if line with full left & right point is available

#### `LEF` (boolean, required)

Indicates if line with empty left & full right point is available

#### `LFE` (boolean, required)

Indicates if line with full left & empty right point is available

#### `LEE` (boolean, required)

Indicates if line with empty left & right point is available

#### `RFN` (boolean, required)

Indicates if ray with full point and negative direction is available

#### `REN` (boolean, required)

Indicates if ray with empty point and negative direction is available

#### `RFP` (boolean, required)

Indicates if ray with full point and positive direction is available

#### `REP` (boolean, required)

Indicates if ray with empty point and positive direction is available

### `initialElements` (object, required)

Array that returns responses

### `labelStep` (string, required)

Indicates the fractional step between 2 labeled ticks

## `Arrows` (object)

Properties of the `Arrows` object:

### `left` (boolean, required)

### `right` (boolean, required)

## `Domain` (object)

Properties of the `Domain` object:

### `min` (number, required)

### `max` (number, required)

## `Ticks` (object)

Properties of the `Ticks` object:

### `minor` (number, required)

smallest tick - These ticks don't have labels.

### `major` (number, required)

larger tick - These ticks have labels.