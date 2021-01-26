# @pie-element/matrix


A [pie][pie]matrix component.


## Usage

To use this pie, you need to configure it within an Assessment Item. This means that you'll need to add it to the `index.html` and `config.json` files.

```html
<matrix-element pie-id="1"></matrix-element>
```

```javascript
{
  elements: {
    'matrix': '@pie-element/matrix-element@^0.0.1'
  },
  models: [
    {
      id : "1",
      element: 'matrix',
      prompt : "How likely are you to report a problem?",
      labelType: 'agreement',
      rowLabels: ['I\'m interested in politics.', 'I\'m interested in economics.'],
      columnLabels: ['Disagree', 'Unsure', 'Agree'],
      matrixValues: {},
      prompt: 'How interested are you in the following domains?'
    }
  ]
```

### Pie Demo
There is a demo in `docs/demo` that you can run to see an example of it's usage.

To preview it in that context you'll need the [pie][pie] tool.

```shell
npm install -g pie
cd matrix/docs/demo
pie serve #will build and serve the pie... then go to http://localhost:4000
```

## Test

```shell
npm test # run client and controller tests
npm run client-test # run client tests
npm run controller-test # run controller tests
```
## Release

```shell
gulp release
git checkout master
npm publish
```
[pie]: http://npmjs.org/package/pie
