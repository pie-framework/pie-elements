const choice = (v, id) => ({ value: v, id });

const markup = '<table class=\\"lrn_width_auto table table-bordered table-striped\\">\\n\\t<tbody>\\n\\t\\t<tr>\\n\\t\\t\\t<td>&#160;<\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/c2ce91c6ad0348bb959684f4bb645fe8\\" /><\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/87a1d06c2e5e499592b259857e0ab649\\" /><\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/ed7512e44ef84ad298229601f959bf34\\" /><\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/32e46bab010941a19814abb10aaaa699\\" /><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>2<\\/mn> <mn>6<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td>{{0}}<\\/td>\\n\\t\\t\\t<td>Equivalent<\\/td>\\n\\t\\t\\t<td>{{1}}<\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{2}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>4<\\/mn> <mn>8<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{3}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{4}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{5}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{6}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>6<\\/mn> <mn>10<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{7}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{8}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{9}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{10}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>9<\\/mn> <mn>12<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{11}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{12}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{13}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{14}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t<\\/tbody>\\n<\\/table>\\n\\n<p>&#160;<\\/p>\\n';

exports.model = (id, element) => ({
  id,
  element,
  disabled: false,
  markup: markup,
  choices: [
    {
      id: '0',
      value: 'Equivalent'
    }
  ],
  correctResponse: {
    0: '-1',
    1: '-1',
    2: '-1',
    3: '0',
    4: '-1',
    5: '-1',
    6: '-1',
    7: '-1',
    8: '-1',
    9: '-1',
    10: '0',
    11: '-1',
    12: '-1',
    13: '0',
    14: '-1'
  },
  prompt: '<p>Drag and drop the word Equivalent into the correct box for each equivalent fraction.</p>',
  choicesPosition: 'below',
  rationale: '<p>A correct response is shown below:</p><ul><li>2/6 = 1/3</li><li>4/8 = 1/2</li><li>6/10 = 3/5</li><li>9/12 = 3/4</li></ul>',
});
