# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

     <a name="2.0.0"></a>
# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler@1.3.0...@pie-element/ruler@2.0.0) (2018-05-11)


### Features

* **model:** move to new model ([3e5e747](https://github.com/pie-framework/pie-elements/commit/3e5e747))


### BREAKING CHANGES

* **model:** Model has changed.

FROM:

```javascript

 {
   model: {
     config: {
       units: 'metric',
       label: 'm',
       length: 20,
       pixelsPerUnit: 30,
       ticks: 10
     }
   }
 }

```

TO:

```javascript
{
   measure: 'metric',
   label: 'm',
   units: 10,
   width: 500,
   imperialTicks: undefined
 }
```




     <a name="1.3.0"></a>
# [1.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler@1.2.1...@pie-element/ruler@1.3.0) (2018-05-03)


### Features

* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))




<a name="1.2.1"></a>
## [1.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler@1.2.0...@pie-element/ruler@1.2.1) (2018-05-01)


### Bug Fixes

* **dependencies:** use [@pie-ui](https://github.com/pie-ui)/ruler@^1.2.0 ([4944688](https://github.com/pie-framework/pie-elements/commit/4944688))




<a name="1.2.0"></a>
# 1.2.0 (2018-05-01)


### Bug Fixes

* **dependencies:** use [@pie-ui](https://github.com/pie-ui)/ruler@^1.1.1 ([6760220](https://github.com/pie-framework/pie-elements/commit/6760220))


### Features

* **configure:** add configuration ui for ruler ([84462ab](https://github.com/pie-framework/pie-elements/commit/84462ab))
* **ruler:** add new ruler component ([0943e49](https://github.com/pie-framework/pie-elements/commit/0943e49))
