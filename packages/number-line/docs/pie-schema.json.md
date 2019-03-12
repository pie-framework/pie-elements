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

# `allowPartialScoring` (boolean, required)

Indicates if partial scoring is enabled

# `partialScoring` (array, required)

Partial scoring rules

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `numberOfCorrect` (number, required)

Number of correct answers

## `scorePercentage` (number, required)

The percentage for partial scoring

# `config` (object, required)

Properties of the `config` object:

## `width` (number, required)

Indicates domain representation width

## `height` (number, required)

Indicates domain representation height

## `domain` (array, required)

Domain limits

Additional restrictions:

* Minimum items: `2`

## `maxNumberOfPoints` (number, required)

Indicates the maximum number of correct response values

## `tickFrequency` (number, required)

Indicates number of ticks on the domain representation

## `showMinorTicks` (boolean, required)

Indicates if minor ticks should be displayed

## `snapPerTick` (number, required)

The number of minor ticks between the ticks

## `tickLabelOverrides` (array, required)

The object is an array with all elements of the type `string`.

## `exhibitOnly` (boolean, required)

Indicates if the exhibit mode is enabled

## `initialType` (string, enum, required)

Indicates the initial type of response

This element must be one of the following enum values:

* `LEE`
* `LEF`
* `LFE`
* `LFF`
* `PE`
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

### `PE` (boolean, required)

Indicates if empty point is available

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

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name

---

# Sub Schemas

The schema defines the following additional types:

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

## `PartialScoringRule` (object)

Properties of the `PartialScoringRule` object:

### `numberOfCorrect` (number, required)

Number of correct answers

### `scorePercentage` (number, required)

The percentage for partial scoring

## `NumberLineDomainConfiguration` (object)

Properties of the `NumberLineDomainConfiguration` object:

### `width` (number, required)

Indicates domain representation width

### `height` (number, required)

Indicates domain representation height

### `domain` (array, required)

Domain limits

Additional restrictions:

* Minimum items: `2`

### `maxNumberOfPoints` (number, required)

Indicates the maximum number of correct response values

### `tickFrequency` (number, required)

Indicates number of ticks on the domain representation

### `showMinorTicks` (boolean, required)

Indicates if minor ticks should be displayed

### `snapPerTick` (number, required)

The number of minor ticks between the ticks

### `tickLabelOverrides` (array, required)

The object is an array with all elements of the type `string`.

### `exhibitOnly` (boolean, required)

Indicates if the exhibit mode is enabled

### `initialType` (string, enum, required)

Indicates the initial type of response

This element must be one of the following enum values:

* `LEE`
* `LEF`
* `LFE`
* `LFF`
* `PE`
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

#### `PE` (boolean, required)

Indicates if empty point is available

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