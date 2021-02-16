Model for the MultiTraitRubric Interaction

The schema defines the following properties:

# `halfScoring` (boolean)

Indicates if half scoring is enabled

# `pointLabels` (boolean)

Indicates if point labels should be shown

# `visibleToStudent` (boolean)

Indicates if should be visible to student

# `description` (boolean)

Indicates if description should be shown

# `standards` (boolean)

Indicates if standards should be shown

# `excludeZero` (boolean)

Indicates if scoring should start at 0 or 1

# `scales` (array, required)

scales

The object is an array with all elements of the type `object`.

The array object has the following properties:

## `maxPoints` (number, required)

Indicates max limit for scoring points

## `scorePointsLabels` (array, required)

Score labels. Starting from 0 to max.

The object is an array with all elements of the type `string`.

## `traitLabel` (string, required)

Trait label

## `traits` (array, required)

Traits

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `name` (string, required)

Trait name

### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

### `description` (string, required)

Trait description

### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.

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

## `Scale` (object)

Properties of the `Scale` object:

### `maxPoints` (number, required)

Indicates max limit for scoring points

### `scorePointsLabels` (array, required)

Score labels. Starting from 0 to max.

The object is an array with all elements of the type `string`.

### `traitLabel` (string, required)

Trait label

### `traits` (array, required)

Traits

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `name` (string, required)

Trait name

#### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

#### `description` (string, required)

Trait description

#### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.

## `Trait` (object)

Properties of the `Trait` object:

### `name` (string, required)

Trait name

### `standards` (array, required)

Trait standards

The object is an array with all elements of the type `string`.

### `description` (string, required)

Trait description

### `scorePointsDescriptors` (array, required)

Score point descriptors. Starting from 0 to max.

The object is an array with all elements of the type `string`.