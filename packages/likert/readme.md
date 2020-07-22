# @pie-element/likert


A [pie][pie]likert component.


## Usage

To use this pie, you need to configure it within an Assessment Item. This means that you'll need to add it to the `index.html` and `config.json` files.

```html
<likert-element pie-id="1"></likert-element>
```

```javascript
{
  elements: {
    'likert': '@pie-element/likert-element@^0.0.1'
  },
  models: [
    {
      id : "1",
      element: 'likert',
      prompt : "How likely are you to report a problem?",
      // more configuration...
    }
  ]
```

### Pie Demo
There is a demo in `docs/demo` that you can run to see an example of it's usage.

To preview it in that context you'll need the [pie][pie] tool.

```shell
npm install -g pie
cd likert/docs/demo
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
