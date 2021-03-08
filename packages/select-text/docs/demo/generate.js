const tokens = () => [
  {
    text: 'Rachel cut out 8 stars in 6 minutes.',
    start: 0,
    end: 36,
    correct: true
  },
  {
    text: 'Lovelle cut out 6 stars in 4 minutes.',
    start: 37,
    end: 74,
    correct: true
  },
  {
    text: 'Lovelle and Rachel cut the same number of stars in 6 minutes.',
    start: 117,
    end: 177
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
      maxSelections: 2,
      mode: 'sentence',
      rationale: 'Rationale goes here.',
      prompt: 'What sentences contain the character 6 in them?',
      promptEnabled: true,
      // text: `<p>Warhol was born in 1928 in Pittsburgh, Pennsylvania. When he was eight years old, he became very sick and had to stay in bed for months. To help him pass the time his mother, who was an artist, taught him how to draw. He took to it like a fish to water. Art became the center of Andy's world. A year later he added picture-taking to his interests when his mother gave him a camera. He also became fascinated with movies.</p><p>Andy studied art in school and learned many ways to make art. He learned how to use different art materials, such as oil paints, metal, clay, and wood. In 1949 he moved to New York City, where he got a job drawing and painting pictures for magazines.</p>`,
      text: `<p>If 'tweren't for sight and sound and smell,<br />
I'd like the city pretty well,<br />
But when it comes to getting rest,<br />
I like the country lots the best.</p>

<p>Sometimes it seems to me I must<br />
Just quit the city's din and dust,<br />
And get out where the sky is blue,<br />
And say, now, how does it seem to you?</p>`,
      tokens: tokens(),
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
