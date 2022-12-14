Model for the @pie-elements/ruler

The schema defines the following properties:

# `measure` (string, enum, required)

Type of the ruler

This element must be one of the following enum values:

* `imperial`
* `metric`

# `label` (string, enum, required)

Ruler label
for measure: imperial it can be 'in' | 'ft' | 'yd' | 'm'
for measure: metric it can be ''mm' | 'cm' | 'm' | 'km' |

This element must be one of the following enum values:

* `cm`
* `ft`
* `in`
* `km`
* `m`
* `mm`
* `yd`

# `imperialTicks` (number, enum)

Number of ticks to display if metric is imperial

This element must be one of the following enum values:

* `16`
* `4`
* `8`

Default: `"is 8"`

# `units` (number, required)

Units number for the ruler

# `width` (number, required)

Ruler width

# `id` (string, required)

Identifier to identify the Pie Element in html markup, Must be unique within a pie item config.

# `element` (string, required)

The html Element tag name