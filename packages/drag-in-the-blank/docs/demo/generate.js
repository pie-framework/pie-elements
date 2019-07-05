const choice = (v, id) => ({ value: v, id });

const markup = '<table class=\\"lrn_width_auto table table-bordered table-striped\\">\\n\\t<tbody>\\n\\t\\t<tr>\\n\\t\\t\\t<td>&#160;<\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/c2ce91c6ad0348bb959684f4bb645fe8\\" /><\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/87a1d06c2e5e499592b259857e0ab649\\" /><\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/ed7512e44ef84ad298229601f959bf34\\" /><\\/td>\\n\\t\\t\\t<td><img alt=\\"\\" src=\\"https://app.fluence.net/ia/image/32e46bab010941a19814abb10aaaa699\\" /><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>2<\\/mn> <mn>6<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td>{{0}}<\\/td>\\n\\t\\t\\t<td>Equivalent<\\/td>\\n\\t\\t\\t<td>{{1}}<\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{2}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>4<\\/mn> <mn>8<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{3}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{4}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{5}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{6}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>6<\\/mn> <mn>10<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{7}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{8}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{9}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{10}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t\\t<tr>\\n\\t\\t\\t<td><math><mrow> <mfrac> <mn>9<\\/mn> <mn>12<\\/mn> <\\/mfrac> <\\/mrow><\\/math><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{11}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{12}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{13}}<\\/span><\\/td>\\n\\t\\t\\t<td><span style=\\"color:rgb(85, 85, 85)\\">{{14}}<\\/span><\\/td>\\n\\t\\t<\\/tr>\\n\\t<\\/tbody>\\n<\\/table>\\n\\n<p>&#160;<\\/p>\\n';

exports.model = (id, element) => ({
  id,
  element,
  "duplicates": true,
  "markup": "<div>Julie can use the equation <math><mrow> <mn>5<\/mn><mfrac> <mn>1<\/mn> <mn>5<\/mn> <\/mfrac> <\/mrow><\/math> {{0}} <math><mrow> <mfrac> <mn>2<\/mn> <mn>3<\/mn> <\/mfrac> <\/mrow><\/math> or the equation <math><mrow> <mfrac> <mrow> <mn>26<\/mn> <\/mrow> <mn>5<\/mn> <\/mfrac> <\/mrow><\/math> {{1}} <math><mrow> <mfrac> <mn>2<\/mn> <mn>3<\/mn> <\/mfrac> <\/mrow><\/math> to find the distance she runs each day. Julie runs {{2}} miles each day.&#160;</div>",
  "correctResponse": {
    "0": "0",
    "1": "0",
    "2": "5"
  },
  "choices": [
    {
      "id": "0",
      "value": "<math><mo>&#215;<\/mo><\/math>"
    },
    {
      "id": "1",
      "value": "<math><mo>&#247;<\/mo><\/math>"
    },
    {
      "id": "2",
      "value": "<math><mo>+<\/mo><\/math>"
    },
    {
      "id": "3",
      "value": "<math><mo>&#8722;<\/mo><\/math>"
    },
    {
      "id": "4",
      "value": "<math><mrow> <mn>7<\/mn><mfrac> <mn>8<\/mn> <mrow> <mn>10<\/mn> <\/mrow> <\/mfrac> <\/mrow><\/math>"
    },
    {
      "id": "5",
      "value": "<math><mrow> <mn>3<\/mn><mfrac> <mn>7<\/mn> <mrow> <mn>15<\/mn> <\/mrow> <\/mfrac> <\/mrow><\/math>"
    },
    {
      "id": "6",
      "value": "<math><mrow> <mn>4<\/mn><mfrac> <mrow> <mn>13<\/mn> <\/mrow> <mrow> <mn>15<\/mn> <\/mrow> <\/mfrac> <\/mrow><\/math>"
    }
  ],
  "prompt": "<p>Vanessa runs <math xmlns=\"http://www.w3.org/1998/Math/MathML\">\n <mrow>\n  <mn>5<\/mn><mfrac>\n   <mn>1<\/mn>\n   <mn>5<\/mn>\n  <\/mfrac>\n  \n <\/mrow>\n<\/math> miles every day.&#160;Julie runs <math xmlns=\"http://www.w3.org/1998/Math/MathML\">\n <mrow>\n  <mfrac>\n   <mn>2<\/mn>\n   <mn>3<\/mn>\n  <\/mfrac>\n  \n <\/mrow>\n<\/math> of that distance. Julie wants to know the distance she runs&#160;each day. Drag and drop the responses below to make each statement true.<\/p>",
  "choicesPosition": "below",
  "rationale": "<p>A correct response is shown below:<\/p><p>Julie can use the equation <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow> <mn>5<\/mn><mfrac> <mn>1<\/mn> <mn>5<\/mn> <\/mfrac> <mo>&#215;<\/mo><mfrac> <mn>2<\/mn> <mn>3<\/mn> <\/mfrac> <\/mrow><\/math> or the equation <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow> <mfrac> <mrow> <mn>26<\/mn> <\/mrow> <mn>5<\/mn> <\/mfrac> <mo>&#215;<\/mo><mfrac> <mn>2<\/mn> <mn>3<\/mn> <\/mfrac> <\/mrow><\/math><b> <\/b>to find the distance she runs each day. Julie runs <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mrow> <mn>3<\/mn><mfrac> <mn>7<\/mn> <mrow> <mn>15<\/mn> <\/mrow> <\/mfrac> <\/mrow><\/math> miles each day.<\/p>",
});
