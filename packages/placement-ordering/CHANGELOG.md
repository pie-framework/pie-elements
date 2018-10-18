# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="3.1.0"></a>
# [3.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering@3.0.4...@pie-element/placement-ordering@3.1.0) (2018-10-18)


### Features

* **ch467:** updated 2 packages ([04fdd85](https://github.com/pie-framework/pie-elements/commit/04fdd85))





<a name="3.0.4"></a>
## [3.0.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering@3.0.3...@pie-element/placement-ordering@3.0.4) (2018-08-06)


### Bug Fixes

* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))




      <a name="3.0.3"></a>
## [3.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering@3.0.1...@pie-element/placement-ordering@3.0.3) (2018-07-18)


### Bug Fixes

* **placement-ordering:** fix drag context import and export ([5b4a99c](https://github.com/pie-framework/pie-elements/commit/5b4a99c))
* [@material-ui](https://github.com/material-ui)/* version bump ([db58db9](https://github.com/pie-framework/pie-elements/commit/db58db9))




    <a name="3.0.1"></a>
## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering@2.1.0...@pie-element/placement-ordering@3.0.1) (2018-05-25)




**Note:** Version bump only for package @pie-element/placement-ordering

  <a name="2.1.0"></a>
# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering@2.0.0...@pie-element/placement-ordering@2.1.0) (2018-05-22)


### Features

* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([02ac71a](https://github.com/pie-framework/pie-elements/commit/02ac71a))




<a name="2.0.0"></a>
# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering@1.7.0...@pie-element/placement-ordering@2.0.0) (2018-05-11)


### Bug Fixes

* **controller:** bump feedback version ([a07c9ec](https://github.com/pie-framework/pie-elements/commit/a07c9ec))
* **dependecies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([4be839f](https://github.com/pie-framework/pie-elements/commit/4be839f))


### Features

* **model:** move away from old model ([048571e](https://github.com/pie-framework/pie-elements/commit/048571e))


### BREAKING CHANGES

* **model:** The model has changed.

* `model` is gone, all properties within it have moved to the root.
* `config` is gone, all properties within it have moved to the root.
* `feedback` is using the new model.

From:

```javascript
{
id: '1',
element: 'placement-ordering',
correctResponse: [
{
id: 'c1',
weight: 0.2
},
{
id: 'c4',
weight: 0.2
},
{
id: 'c3',
weight: 0.3
},
{
id: 'c2',
weight: 0.3
}
],
model: {
prompt: 'Arrange the fruits alphabetically',
choices: [
{
id: 'c2',
label: 'Lemon',
shuffle: false,
moveOnDrag: true
},
{
id: 'c3',
label: 'Melon',
moveOnDrag: true
},
{
id: 'c1',
label: 'Blueberry',
moveOnDrag: false
},
{
id: 'c4',
label: 'Pear',
moveOnDrag: false
}
]
},
config: {
shuffle: false,
placementType: 'none',
choiceAreaLayout: 'vertical',
choiceAreaLabel: 'choices: ',
answerAreaLabel: 'Answer Area Label',
showOrdering: true
},
feedback: {
correctFeedbackType: 'custom',
correctFeedback: 'foo',
incorrectFeedbackType: 'custom',
incorrectFeedback: 'foo',
partialFeedbackType: 'custom',
partialFeedback: 'foo',
}
}
```

To:

```javascript

{
id: '1',
element: 'placement-ordering',
correctResponse: [
{
id: 'c1',
weight: 0.2
},
{
id: 'c4',
weight: 0.2
},
{
id: 'c3',
weight: 0.3
},
{
id: 'c2',
weight: 0.3
}
],
prompt: 'Arrange the fruits alphabetically',
choices: [
{
id: 'c2',
label: 'Lemon',
shuffle: false,
moveOnDrag: true
},
{
id: 'c3',
label: 'Melon',
moveOnDrag: true
},
{
id: 'c1',
label: 'Blueberry',
moveOnDrag: false
},
{
id: 'c4',
label: 'Pear',
moveOnDrag: false
}
],
shuffle: false,
placementType: 'none',
choiceAreaLayout: 'vertical',
choiceAreaLabel: 'choices: ',
answerAreaLabel: 'Answer Area Label',
showOrdering: true,
feedback: {
correct: {
type: 'custom',
custom: 'foo'
},
incorrect: {
type: 'custom',
custom: 'no'
},
partial: {
type: 'custom',
custom: 'nearly'
}
}
}

```




<a name="1.7.0"></a>
# [1.7.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering@1.6.0...@pie-element/placement-ordering@1.7.0) (2018-05-03)


### Features

* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))




<a name="1.6.0"></a>
# 1.6.0 (2018-05-02)



<a name="1.5.0"></a>
# 1.5.0 (2018-04-17)


### Features

* **dependencies:** use latest [@pie-ui](https://github.com/pie-ui)/placement-ordering ([fd9d12d](https://github.com/pie-framework/pie-elements/commit/fd9d12d))



<a name="1.2.2"></a>
## 1.2.2 (2018-03-06)


### Bug Fixes

* **dependencies:** fix dependencies ([38ec3f6](https://github.com/pie-framework/pie-elements/commit/38ec3f6))
* **dependencies:** update dependency names ([dc789ac](https://github.com/pie-framework/pie-elements/commit/dc789ac))




<a name="1.5.0"></a>
# [1.5.0](https://github.com/pie-framework/pie-elements/compare/v1.4.1...v1.5.0) (2018-04-17)


### Features

* **dependencies:** use latest [@pie-ui](https://github.com/pie-ui)/placement-ordering ([fd9d12d](https://github.com/pie-framework/pie-elements/commit/fd9d12d))




<a name="1.2.2"></a>
## 1.2.2 (2018-03-06)


### Bug Fixes

* **dependencies:** fix dependencies ([38ec3f6](https://github.com/pie-framework/pie-elements/commit/38ec3f6))
* **dependencies:** update dependency names ([dc789ac](https://github.com/pie-framework/pie-elements/commit/dc789ac))
