exports.model = (id, element) => ({
  id,
  element,
  choiceMode: 'checkbox',
  choicePrefix: 'numbers',
  choices: [
    {
      correct: true,
      value: 'sweden',
      label:
        'Sweden <math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true"><mi>x</mi><mo>=</mo><mi>y</mi><mo>+</mo><mn>1</mn></mstyle></math>',
      feedback: {
        type: 'none',
        value: '',
      },
      accessibility: 'sweden',
    },
    {
      value: 'iceland',
      label: `Iceland <math style="display: block;"> <mtable columnalign="right center left"> <mtr> <mtd> <msup> <mrow> <mo> ( </mo> <mi> a </mi> <mo> + </mo> <mi> b </mi> <mo> ) </mo> </mrow> <mn> 2 </mn> </msup> </mtd> <mtd> <mo> = </mo> </mtd> <mtd> <msup><mi> c </mi><mn>2</mn></msup> <mo> + </mo> <mn> 4 </mn> <mo> ⋅ </mo> <mo>(</mo> <mfrac> <mn> 1 </mn> <mn> 2 </mn> </mfrac> <mi> a </mi><mi> b </mi> <mo>)</mo>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</mtd> </mtr> <mtr> <mtd> <msup><mi> a </mi><mn>2</mn></msup> <mo> + </mo> <mn> 2 </mn><mi> a </mi><mi> b </mi> <mo> + </mo> <msup><mi> b </mi><mn>2</mn></msup> </mtd> <mtd> <mo> = </mo> </mtd> <mtd> <msup><mi> c </mi><mn>2</mn></msup> <mo> + </mo> <mn> 2 </mn><mi> a </mi><mi> b</mi></mtd></mtr><mtr><mtd></mtd></mtr><mtr><mtd><msup><mi>a </mi><mn>2</mn></msup> <mo> + </mo> <msup><mi> b </mi><mn>2</mn></msup> </mtd> <mtd> <mo> = </mo> </mtd> <mtd> <msup><mi> c </mi><mn>2</mn></msup> </mtd> </mtr> </mtable> </math>`,
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Iceland',
      accessibility: 'iceland',
    },
    {
      label:
        'Norway <img src="https://app.corespring.org/v2/player/player/item/5de6c332e4b06f03c8ed256a:0/1575404359081-Capture.PNG"></img>',
      value: 'norway',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Norway',
      accessibility: 'norway',
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Finland',
      accessibility: 'finland',
    },
  ],
  prompt:
    'Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math>',
  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
});
