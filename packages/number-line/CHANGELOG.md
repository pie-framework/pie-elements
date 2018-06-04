# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

      <a name="3.0.1"></a>
## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line@2.1.0...@pie-element/number-line@3.0.1) (2018-05-25)




**Note:** Version bump only for package @pie-element/number-line

      <a name="2.1.0"></a>
# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line@2.0.0...@pie-element/number-line@2.1.0) (2018-05-22)


### Features

* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([4a29a98](https://github.com/pie-framework/pie-elements/commit/4a29a98))




   <a name="2.0.0"></a>
# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line@1.6.0...@pie-element/number-line@2.0.0) (2018-05-11)


### Bug Fixes

* **controller:** bump feedback version ([a07c9ec](https://github.com/pie-framework/pie-elements/commit/a07c9ec))
* **dependencies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([6fea7bb](https://github.com/pie-framework/pie-elements/commit/6fea7bb))


### Features

* **model:** move away from legacy model ([9153342](https://github.com/pie-framework/pie-elements/commit/9153342))


### BREAKING CHANGES

* **model:** Model has moved from:

* `model.config` -> `config`
* `feedback` - uses new feedback structure

Full example:

From:

```javascript

{
id: '1',
element: 'number-line',
correctResponse: [
  {
    type: 'point',
    pointType: 'full',
    domainPosition: 1
  },
  {
    type: 'line',
    leftPoint: 'full',
    rightPoint: 'empty',
    domainPosition: 1,
    size: 2
  }
],
feedback: {
  correctFeedbackType: 'default',
  partialFeedbackType: 'default',
  incorrectFeedbackType: 'custom',
  incorrectFeedback: '<h1>incorrect</h1>'
},
allowPartialScoring: true,
partialScoring: [
  {
    numberOfCorrect: 1,
    scorePercentage: 35
  }
],
model: {
  config: {
    width: 500,
    height: 400,
    domain: [
      -5,
      5
    ],
    initialElements: [
      {
        type: 'point',
        pointType: 'empty',
        domainPosition: -1
      }
    ],
    maxNumberOfPoints: 20,
    tickFrequency: 6,
    showMinorTicks: true,
    snapPerTick: 1,
    tickLabelOverrides: [],
    initialType: 'PF',
    exhibitOnly: false,
    availableTypes: {
      PF: true,
      PE: true,
      LFF: true,
      LEF: true,
      LFE: true,
      LEE: true,
      RFN: true,
      RFP: true,
      REN: true,
      REP: true
    }
  }
}
}

```

To:

```javascript

{
id: '1',
element: 'number-line',
correctResponse: [
  {
    type: 'point',
    pointType: 'full',
    domainPosition: 1
  },
  {
    type: 'line',
    leftPoint: 'full',
    rightPoint: 'empty',
    domainPosition: 1,
    size: 2
  }
],
feedback: {
  correct: {
    type: 'default',
    default: 'Correct'
  },
  partial: {
    type: 'default',
    default: 'Nearly'
  },
  incorrect: {
    type: 'custom',
    custom: '<h1>Incorrect</h1>'
  }
},
allowPartialScoring: true,
partialScoring: [
  {
    numberOfCorrect: 1,
    scorePercentage: 35
  }
],
config: {
  width: 500,
  height: 400,
  domain: [-5, 5],
  initialElements: [
    {
      type: 'point',
      pointType: 'empty',
      domainPosition: -1
    }
  ],
  maxNumberOfPoints: 20,
  tickFrequency: 6,
  showMinorTicks: true,
  snapPerTick: 1,
  tickLabelOverrides: [],
  initialType: 'PF',
  exhibitOnly: false,
  availableTypes: {
    PF: true,
    PE: true,
    LFF: true,
    LEF: true,
    LFE: true,
    LEE: true,
    RFN: true,
    RFP: true,
    REN: true,
    REP: true
  }
}
}

```




  <a name="1.6.0"></a>
# 1.6.0 (2018-05-03)


### Features

* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))



<a name="1.5.0"></a>
# 1.5.0 (2018-04-17)


### Features

* **dependencies:** use latest [@pie-ui](https://github.com/pie-ui)/number-line ([e8fcdba](https://github.com/pie-framework/pie-elements/commit/e8fcdba))



<a name="1.2.2"></a>
## 1.2.2 (2018-03-06)


### Bug Fixes

* **dependencies:** update dependencies ([2868681](https://github.com/pie-framework/pie-elements/commit/2868681))
* **dependencies:** update dependency names ([dc789ac](https://github.com/pie-framework/pie-elements/commit/dc789ac))




<a name="1.5.0"></a>
# [1.5.0](https://github.com/pie-framework/pie-elements/compare/v1.4.1...v1.5.0) (2018-04-17)


### Features

* **dependencies:** use latest [@pie-ui](https://github.com/pie-ui)/number-line ([e8fcdba](https://github.com/pie-framework/pie-elements/commit/e8fcdba))




<a name="1.2.2"></a>
## 1.2.2 (2018-03-06)


### Bug Fixes

* **dependencies:** update dependencies ([2868681](https://github.com/pie-framework/pie-elements/commit/2868681))
* **dependencies:** update dependency names ([dc789ac](https://github.com/pie-framework/pie-elements/commit/dc789ac))
