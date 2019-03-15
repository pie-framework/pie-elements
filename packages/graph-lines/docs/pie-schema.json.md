Model Object for @pie-elements/graph-lines

The schema defines the following properties:

# `feedback` (object)

Properties of the `feedback` object:

## `correct` (, required)

Indicates the configuration for feedback when answer is correct

## `incorrect` (, required)

Indicates the configuration for feedback when answer is incorrect

## `partial`

Indicates the configuration for feedback when answer is partially correct

# `multiple` (boolean)

Indicates if the graph can have multiple lines

# `partialScoring` (boolean)

Indicates if partial scoring rules is enabled

# `partialScoringRules` (array)

Indicates partial scoring rules

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `numberOfCorrect` (number, required)

Number of correct answers

## `scorePercentage` (number, required)

Score percentage for partial scoring

# `model` (object, required)

Properties of the `model` object:

## `config` (object, required)

Properties of the `config` object:

### `lines` (array, required)

The lines that should appear on the graph

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `label` (string, required)

Label for the line

#### `correctLine` (string, required)

Correct line equation

#### `initialView` (string, required)

Initial view for the line

### `graphTitle` (string, required)

Indicates the title for the graph

### `graphWidth` (number, required)

Indicated the width for the graph

### `graphHeight` (number, required)

Indicates the height for the graph

### `domainLabel` (string, required)

Indicates the domain label for the graph

### `domainMin` (number, required)

Indicates the left limit (for the x axis)

### `domainMax` (number, required)

Indicates the right limit (for the x axis)

### `domainStepValue` (number, required)

Indicates step value (for the x axis)

### `domainSnapValue` (number, required)

Indicates snap value (for the x axis)

### `domainLabelFrequency` (number, required)

Indicates domain label frequency (for the x axis)

### `domainGraphPadding` (number, required)

Indicates domain graph padding (for the x axis)

### `rangeLabel` (string, required)

Indicates the range label for the graph

### `rangeMin` (number, required)

Indicates the bottom limit (for the y axis)

### `rangeMax` (number, required)

Indicates the top limit (for the y axis)

### `rangeStepValue` (number, required)

Indicates step value (for the y axis)

### `rangeSnapValue` (number, required)

Indicates snap value (for the y axis)

### `rangeLabelFrequency` (number, required)

Indicates range label frequency (for the y axis)

### `rangeGraphPadding` (number, required)

Indicates range graph padding (for the y axis)

### `sigfigs` (number, required)

### `showCoordinates` (boolean, required)

Indicates if coordinates should be displayed

### `showPointLabels` (boolean, required)

Indicates if point labels should be displayed

### `showInputs` (boolean, required)

Indicates if inputs should be displayed

### `showAxisLabels` (boolean, required)

Indicates if axis labels should be displayed

### `showFeedback` (boolean, required)

Indicates if feedback should be displayed

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

## `PartialScoringRule` (object)

Properties of the `PartialScoringRule` object:

### `numberOfCorrect` (number, required)

Number of correct answers

### `scorePercentage` (number, required)

Score percentage for partial scoring

## `GraphLineModel` (object)

Properties of the `GraphLineModel` object:

### `config` (object, required)

Properties of the `config` object:

#### `lines` (array, required)

The lines that should appear on the graph

The object is an array with all elements of the type `object`.

The array object has the following properties:

##### `label` (string, required)

Label for the line

##### `correctLine` (string, required)

Correct line equation

##### `initialView` (string, required)

Initial view for the line

#### `graphTitle` (string, required)

Indicates the title for the graph

#### `graphWidth` (number, required)

Indicated the width for the graph

#### `graphHeight` (number, required)

Indicates the height for the graph

#### `domainLabel` (string, required)

Indicates the domain label for the graph

#### `domainMin` (number, required)

Indicates the left limit (for the x axis)

#### `domainMax` (number, required)

Indicates the right limit (for the x axis)

#### `domainStepValue` (number, required)

Indicates step value (for the x axis)

#### `domainSnapValue` (number, required)

Indicates snap value (for the x axis)

#### `domainLabelFrequency` (number, required)

Indicates domain label frequency (for the x axis)

#### `domainGraphPadding` (number, required)

Indicates domain graph padding (for the x axis)

#### `rangeLabel` (string, required)

Indicates the range label for the graph

#### `rangeMin` (number, required)

Indicates the bottom limit (for the y axis)

#### `rangeMax` (number, required)

Indicates the top limit (for the y axis)

#### `rangeStepValue` (number, required)

Indicates step value (for the y axis)

#### `rangeSnapValue` (number, required)

Indicates snap value (for the y axis)

#### `rangeLabelFrequency` (number, required)

Indicates range label frequency (for the y axis)

#### `rangeGraphPadding` (number, required)

Indicates range graph padding (for the y axis)

#### `sigfigs` (number, required)

#### `showCoordinates` (boolean, required)

Indicates if coordinates should be displayed

#### `showPointLabels` (boolean, required)

Indicates if point labels should be displayed

#### `showInputs` (boolean, required)

Indicates if inputs should be displayed

#### `showAxisLabels` (boolean, required)

Indicates if axis labels should be displayed

#### `showFeedback` (boolean, required)

Indicates if feedback should be displayed

## `GraphLineModelConfig` (object)

Properties of the `GraphLineModelConfig` object:

### `lines` (array, required)

The lines that should appear on the graph

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `label` (string, required)

Label for the line

#### `correctLine` (string, required)

Correct line equation

#### `initialView` (string, required)

Initial view for the line

### `graphTitle` (string, required)

Indicates the title for the graph

### `graphWidth` (number, required)

Indicated the width for the graph

### `graphHeight` (number, required)

Indicates the height for the graph

### `domainLabel` (string, required)

Indicates the domain label for the graph

### `domainMin` (number, required)

Indicates the left limit (for the x axis)

### `domainMax` (number, required)

Indicates the right limit (for the x axis)

### `domainStepValue` (number, required)

Indicates step value (for the x axis)

### `domainSnapValue` (number, required)

Indicates snap value (for the x axis)

### `domainLabelFrequency` (number, required)

Indicates domain label frequency (for the x axis)

### `domainGraphPadding` (number, required)

Indicates domain graph padding (for the x axis)

### `rangeLabel` (string, required)

Indicates the range label for the graph

### `rangeMin` (number, required)

Indicates the bottom limit (for the y axis)

### `rangeMax` (number, required)

Indicates the top limit (for the y axis)

### `rangeStepValue` (number, required)

Indicates step value (for the y axis)

### `rangeSnapValue` (number, required)

Indicates snap value (for the y axis)

### `rangeLabelFrequency` (number, required)

Indicates range label frequency (for the y axis)

### `rangeGraphPadding` (number, required)

Indicates range graph padding (for the y axis)

### `sigfigs` (number, required)

### `showCoordinates` (boolean, required)

Indicates if coordinates should be displayed

### `showPointLabels` (boolean, required)

Indicates if point labels should be displayed

### `showInputs` (boolean, required)

Indicates if inputs should be displayed

### `showAxisLabels` (boolean, required)

Indicates if axis labels should be displayed

### `showFeedback` (boolean, required)

Indicates if feedback should be displayed

## `GraphLine` (object)

Properties of the `GraphLine` object:

### `label` (string, required)

Label for the line

### `correctLine` (string, required)

Correct line equation

### `initialView` (string, required)

Initial view for the line