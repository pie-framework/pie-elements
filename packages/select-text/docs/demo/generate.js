const tokens = () => [
  {
    text: 'If \'tweren\'t for sight and sound and smell,',
    start: 0,
    end: 43
  },
  {
    text: 'I\'d like the city pretty well,',
    start: 44,
    end: 74
  },
  {
    text: 'But when it comes to getting rest,',
    start: 75,
    end: 109
  },
  {
    text: 'I like the country lots the best.',
    start: 110,
    end: 143
  },
  {
    text: 'Sometimes it seems to me I must',
    start: 145,
    end: 176
  },
  {
    text: 'Just quit the city\'s din and dust,',
    start: 177,
    end: 211
  },
  {
    text: 'And get out where the sky is blue,',
    start: 212,
    end: 246
  },
  {
    text: 'And say, now, how does it seem to you?',
    start: 247,
    end: 285
  }
];

const mathSampleText =
  '<p><math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mstyle displaystyle="true">\n    <mrow>\n      <mo>(</mo>\n      <mn>6</mn>\n      <mi>x</mi>\n      <mo>+</mo>\n      <mn>2</mn>\n      <mo>)</mo>\n    </mrow>\n    <mrow>\n      <mo>(</mo>\n      <mo>-</mo>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>+</mo>\n      <mn>3</mn>\n      <mi>x</mi>\n      <mo>-</mo>\n      <mn>1</mn>\n      <mo>)</mo>\n    </mrow>\n    <mrow>\n      <mo>(</mo>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>)</mo>\n    </mrow>\n  </mstyle>\n</math></p>\n\n<p><span class="lrn_token"><math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mstyle displaystyle="true">\n    <mrow>\n      <mo>[</mo>\n      <mn>6</mn>\n      <mi>x</mi>\n      <mrow>\n        <mo>(</mo>\n        <mo>-</mo>\n        <msup>\n          <mi>x</mi>\n          <mn>2</mn>\n        </msup>\n        <mo>+</mo>\n        <mn>3</mn>\n        <mi>x</mi>\n        <mo>-</mo>\n        <mn>1</mn>\n        <mo>)</mo>\n      </mrow>\n      <mo>+</mo>\n      <mn>2</mn>\n      <mrow>\n        <mo>(</mo>\n        <mo>-</mo>\n        <msup>\n          <mi>x</mi>\n          <mn>2</mn>\n        </msup>\n        <mo>+</mo>\n        <mn>3</mn>\n        <mi>x</mi>\n        <mo>-</mo>\n        <mn>1</mn>\n        <mo>)</mo>\n      </mrow>\n      <mo>]</mo>\n    </mrow>\n    <mrow>\n      <mo>(</mo>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>)</mo>\n    </mrow>\n  </mstyle>\n</math></span></p>\n\n<p><span class="lrn_token"><math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mstyle displaystyle="true">\n    <mrow>\n      <mo>(</mo>\n      <mo>-</mo>\n      <mn>6</mn>\n      <msup>\n        <mi>x</mi>\n        <mn>3</mn>\n      </msup>\n      <mo>+</mo>\n      <mn>18</mn>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>-</mo>\n      <mn>6</mn>\n      <mi>x</mi>\n      <mo>-</mo>\n      <mn>2</mn>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>+</mo>\n      <mn>6</mn>\n      <mi>x</mi>\n      <mo>-</mo>\n      <mn>2</mn>\n      <mo>)</mo>\n    </mrow>\n    <mrow>\n      <mo>(</mo>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>)</mo>\n    </mrow>\n  </mstyle>\n</math></span></p>\n\n<p><span class="lrn_token"><math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mstyle displaystyle="true">\n    <mo>-</mo>\n    <mn>6</mn>\n    <msup>\n      <mi>x</mi>\n      <mn>3</mn>\n    </msup>\n    <mo>+</mo>\n    <mn>18</mn>\n    <msup>\n      <mi>x</mi>\n      <mn>2</mn>\n    </msup>\n    <mo>-</mo>\n    <mn>6</mn>\n    <mi>x</mi>\n    <mo>-</mo>\n    <mn>2</mn>\n    <msup>\n      <mi>x</mi>\n      <mn>2</mn>\n    </msup>\n    <mo>+</mo>\n    <mn>6</mn>\n    <mi>x</mi>\n    <mo>-</mo>\n    <mn>2</mn>\n    <msup>\n      <mi>x</mi>\n      <mn>2</mn>\n    </msup>\n  </mstyle>\n</math></span></p>\n\n<p><span class="lrn_token"><math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mstyle displaystyle="true">\n    <mo>-</mo>\n    <mn>6</mn>\n    <msup>\n      <mi>x</mi>\n      <mn>3</mn>\n    </msup>\n    <mo>+</mo>\n    <mn>14</mn>\n    <msup>\n      <mi>x</mi>\n      <mn>2</mn>\n    </msup>\n  </mstyle>\n</math></span></p>';

const mathSampleTokens = [
  {
    start: 583,
    end: 1465,
    text: '<span class="lrn_token"><math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mstyle displaystyle="true">\n    <mrow>\n      <mo>[</mo>\n      <mn>6</mn>\n      <mi>x</mi>\n      <mrow>\n        <mo>(</mo>\n        <mo>-</mo>\n        <msup>\n          <mi>x</mi>\n          <mn>2</mn>\n        </msup>\n        <mo>+</mo>\n        <mn>3</mn>\n        <mi>x</mi>\n        <mo>-</mo>\n        <mn>1</mn>\n        <mo>)</mo>\n      </mrow>\n      <mo>+</mo>\n      <mn>2</mn>\n      <mrow>\n        <mo>(</mo>\n        <mo>-</mo>\n        <msup>\n          <mi>x</mi>\n          <mn>2</mn>\n        </msup>\n        <mo>+</mo>\n        <mn>3</mn>\n        <mi>x</mi>\n        <mo>-</mo>\n        <mn>1</mn>\n        <mo>)</mo>\n      </mrow>\n      <mo>]</mo>\n    </mrow>\n    <mrow>\n      <mo>(</mo>\n      <msup>\n        <mi>x</mi>\n        <mn>2</mn>\n      </msup>\n      <mo>)</mo>\n    </mrow>\n  </mstyle>\n</math></span>', correct: true },
  { start: 1474, end: 2218 },
  { start: 2227, end: 2797 },
  { start: 2806, end: 3112 }
];

const base = extras =>
  Object.assign(
    {},
    {
      "teacherInstructions": "",
      "tokens": [
        {
          "start": 32,
          "text": "string",
          "end": 38,
          "correct": false
        },
        {
          "text": "paper.",
          "correct": false,
          "start": 61,
          "end": 74
        },
        {
          "end": 118,
          "start": 113,
          "correct": false,
          "text": "times"
        },
        {
          "start": 144,
          "text": "patterns",
          "correct": true,
          "end": 152
        },
        {
          "correct": false,
          "end": 267,
          "text": "colors.",
          "start": 253
        }
      ],
      "text": "<p>3. Drop the paint-covered <u>string</u> onto the piece of <u>paper</u>. Lift the string and drop it 2 or 3 <u>times</u> to make different <u>patterns</u>. Try wiggling the string to smear the paint.</p>\n\n<p>4. Repeat step three using the other paint <u>colors</u>.</p>\n",
      "partialScoring": true,
      "rationale": "<p><em>Patterns</em> in this context are decorations or designs, especially those that create&#160;a regular or repeated motif.</p>",
      "prompt": "<p>The author uses a word that means&#160;&#34;repeated decorations or designs.&#34; Select&#160;the underlined word in the sentences&#160;that <span class=\"relative-emphasis\">best</span> shows that meaning.<br />&#160;</p>"
    },
    extras
  );

const mathSample = extras => {
  return Object.assign(
    {},
    {
      highlightChoices: false,
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct'
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect'
        },
        partial: {
          type: 'default',
          default: 'Nearly'
        }
      },
      partialScoring: false,
      maxSelections: 2,
      prompt: 'What sentences contain the character 6 in them?',
      text: `<p>If 'tweren't for sight and sound and smell,<br />
I'd like the city pretty well,<br />
But when it comes to getting rest,<br />
I like the country lots the best.</p>

<p>Sometimes it seems to me I must<br />
Just quit the city's din and dust,<br />
And get out where the sky is blue,<br />
And say, now, how does it seem to you?</p>`,
      tokens: mathSampleTokens,
    },
    extras
  );
};

exports.model = (id, element) => {
  return Object.assign({}, { id, element }, base({}));
};

exports.mathSample = (id, element) => {
  return Object.assign({}, { id, element }, mathSample({}));
};

exports.htmlSample = (id, element) => {
  return Object.assign({}, { id, element },     {
    highlightChoices: true,
    feedback: {
      correct: {
        type: 'default',
        default: 'Correct'
      },
      incorrect: {
        type: 'default',
        default: 'Incorrect'
      },
      partial: {
        type: 'default',
        default: 'Nearly'
      }
    },
    partialScoring: false,
    text: '<p style=\'padding: 20px\'>A flicker and then gone. In its wake, only <span class="lrn_token">the after-echo of a distant high-pitched ringing that vibrated through him even as it returned to silence once again</span>, as he stared into the smiling faces of the crew and told himself that yes he was meant to be here, that <span class="lrn_token">it had been his destiny to succeed and so he had succeeded</span>, the sense of panic already replaced by the pride of his accomplishment, replaced so completely that he would not remember that flicker, would not allow himself to remember, <span class="lrn_token">even after everything else had happened</span>. In his memory of that moment, <span class="lrn_token">he was an astronaut and they were welcoming him aboard the space station</span>. And in his memory he was smiling. Is this not what he was meant to do? Is the answer not as fixed and indisputable as any equation he might have been tasked to solve?</p>\n',
    prompt: '<p>Select the <span class="relative-emphasis">one</span> phrase below that suggests that in the future, Keith may interpret this moment differently.</p>',
    maxSelections: 2,
    mode: 'sentence',
    rationale: 'Rationale goes here.',
    tokens: [
      {
        correct: false,
        start: 67,
        end: 215,
        text: '<span class="lrn_token">the after-echo of a distant high-pitched ringing that vibrated through him even as it returned to silence once again</span>'
      },
      {
        correct: false,
        start: 321,
        end: 410,
        text: '<span class="lrn_token">it had been his destiny to succeed and so he had succeeded</span>'
      },
      {
        correct: true,
        start: 585,
        end: 655,
        text: '<span class="lrn_token">even after everything else had happened</span>'
      },
      {
        correct: false,
        start: 687,
        end: 790,
        text: '<span class="lrn_token">he was an astronaut and they were welcoming him aboard the space station</span>'
      }
    ],
  });
};

exports.htmlAscii = (id, element) => ({
    id,
    element,
    highlightChoices: true,
    prompt: 'Select the parts that have references for Lucy',
    text: '<p>&#8220;Lucy? Are you using your time wisely to plan your project?&#8221; Mr. Wilson asked.</p><p>&nbsp;Lucy looked a little confused at first.</p>',
    tokens: [{
      start: 10,
      end: 68,
      text: 'Lucy? Are you using your time wisely to plan your project?'
    }, {
      start: 106,
      end: 145,
      text: 'Lucy looked a little confused at first.'
    }]
  }
);
