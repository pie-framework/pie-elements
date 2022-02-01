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
      toolbarEditorPosition: 'bottom',
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

const simpleItem = {
  "text": "A. Almost never\n\nB. Once in a while\n\nC. Sometimes\n\nD. Often\n\nE. Almost all the time",
  "tokens": [
    {
      "text": "A. Almost never",
      "end": 15,
      "start": 0,
      "correct": true
    },
    {
      "start": 17,
      "end": 35,
      "correct": false,
      "text": "B. Once in a while"
    },
    {
      "correct": false,
      "end": 49,
      "start": 37,
      "text": "C. Sometimes"
    },
    {
      "text": "D. Often",
      "correct": false,
      "end": 59,
      "start": 51
    },
    {
      "start": 61,
      "correct": false,
      "end": 83,
      "text": "E. Almost all the time"
    }
  ],
  "rationale": "<p>answers vary</p>",
  "partialScoring": true,
  "teacherInstructions": "",
  "prompt": "<p>I got my work done right away instead of waiting until the last minute.</p>",
  "maxSelections": 1,
};

exports.model = (id, element) => {
  return Object.assign({}, { id, element }, base(     {
    "partialScoring": true,
    "tokens": [
      {
        "correct": false,
        "start": 3,
        "end": 6,
        "text": "Our"
      },
      {
        "correct": false,
        "start": 7,
        "end": 16,
        "text": "challenge"
      },
      {
        "correct": false,
        "start": 18,
        "end": 21,
        "text": "not"
      },
      {
        "correct": false,
        "start": 22,
        "end": 30,
        "text": "tomorrow"
      },
      {
        "correct": false,
        "start": 31,
        "end": 34,
        "text": "but"
      },
      {
        "correct": false,
        "start": 35,
        "end": 40,
        "text": "today"
      },
      {
        "correct": false,
        "start": 42,
        "end": 44,
        "text": "is"
      },
      {
        "correct": false,
        "start": 45,
        "end": 47,
        "text": "to"
      },
      {
        "correct": false,
        "start": 48,
        "end": 58,
        "text": "accomplish"
      },
      {
        "correct": false,
        "start": 59,
        "end": 69,
        "text": "objectives"
      },
      {
        "correct": false,
        "start": 70,
        "end": 75,
        "text": "which"
      },
      {
        "correct": false,
        "start": 76,
        "end": 80,
        "text": "have"
      },
      {
        "correct": false,
        "start": 81,
        "end": 87,
        "text": "eluded"
      },
      {
        "correct": false,
        "start": 88,
        "end": 95,
        "text": "mankind"
      },
      {
        "correct": false,
        "start": 96,
        "end": 101,
        "text": "since"
      },
      {
        "correct": false,
        "start": 102,
        "end": 105,
        "text": "the"
      },
      {
        "correct": false,
        "start": 106,
        "end": 115,
        "text": "beginning"
      },
      {
        "correct": false,
        "start": 116,
        "end": 118,
        "text": "of"
      },
      {
        "correct": false,
        "start": 119,
        "end": 123,
        "text": "time"
      },
      {
        "correct": false,
        "start": 125,
        "end": 127,
        "text": "We"
      },
      {
        "correct": false,
        "start": 128,
        "end": 132,
        "text": "must"
      },
      {
        "correct": false,
        "start": 133,
        "end": 138,
        "text": "bring"
      },
      {
        "correct": false,
        "start": 139,
        "end": 144,
        "text": "equal"
      },
      {
        "correct": false,
        "start": 145,
        "end": 152,
        "text": "justice"
      },
      {
        "correct": false,
        "start": 153,
        "end": 155,
        "text": "to"
      },
      {
        "correct": false,
        "start": 156,
        "end": 159,
        "text": "all"
      },
      {
        "correct": false,
        "start": 160,
        "end": 163,
        "text": "our"
      },
      {
        "correct": false,
        "start": 164,
        "end": 172,
        "text": "citizens"
      },
      {
        "correct": false,
        "start": 174,
        "end": 176,
        "text": "We"
      },
      {
        "correct": false,
        "start": 177,
        "end": 181,
        "text": "must"
      },
      {
        "correct": false,
        "start": 182,
        "end": 189,
        "text": "abolish"
      },
      {
        "correct": false,
        "start": 190,
        "end": 195,
        "text": "human"
      },
      {
        "correct": true,
        "start": 196,
        "end": 203,
        "text": "poverty"
      },
      {
        "correct": false,
        "start": 205,
        "end": 207,
        "text": "We"
      },
      {
        "correct": false,
        "start": 208,
        "end": 212,
        "text": "must"
      },
      {
        "correct": false,
        "start": 213,
        "end": 222,
        "text": "eradicate"
      },
      {
        "correct": false,
        "start": 223,
        "end": 230,
        "text": "killing"
      },
      {
        "correct": false,
        "start": 231,
        "end": 234,
        "text": "and"
      },
      {
        "correct": false,
        "start": 235,
        "end": 244,
        "text": "crippling"
      },
      {
        "correct": true,
        "start": 245,
        "end": 252,
        "text": "disease"
      },
      {
        "correct": false,
        "start": 253,
        "end": 256,
        "text": "and"
      },
      {
        "correct": false,
        "start": 257,
        "end": 265,
        "text": "lengthen"
      },
      {
        "correct": false,
        "start": 266,
        "end": 269,
        "text": "the"
      },
      {
        "correct": false,
        "start": 270,
        "end": 274,
        "text": "span"
      },
      {
        "correct": false,
        "start": 275,
        "end": 277,
        "text": "of"
      },
      {
        "correct": false,
        "start": 278,
        "end": 282,
        "text": "life"
      },
      {
        "correct": false,
        "start": 283,
        "end": 285,
        "text": "to"
      },
      {
        "correct": false,
        "start": 286,
        "end": 289,
        "text": "100"
      },
      {
        "correct": false,
        "start": 290,
        "end": 292,
        "text": "or"
      },
      {
        "correct": false,
        "start": 293,
        "end": 296,
        "text": "200"
      },
      {
        "correct": false,
        "start": 297,
        "end": 302,
        "text": "years"
      },
      {
        "correct": false,
        "start": 304,
        "end": 306,
        "text": "We"
      },
      {
        "correct": false,
        "start": 307,
        "end": 311,
        "text": "must"
      },
      {
        "correct": false,
        "start": 312,
        "end": 321,
        "text": "eliminate"
      },
      {
        "correct": true,
        "start": 322,
        "end": 332,
        "text": "illiteracy"
      },
      {
        "correct": false,
        "start": 333,
        "end": 338,
        "text": "among"
      },
      {
        "correct": false,
        "start": 339,
        "end": 342,
        "text": "all"
      },
      {
        "correct": false,
        "start": 343,
        "end": 345,
        "text": "of"
      },
      {
        "correct": false,
        "start": 346,
        "end": 349,
        "text": "our"
      },
      {
        "correct": false,
        "start": 350,
        "end": 356,
        "text": "people"
      }
    ],
    // "id": "0",
    "text": "<p>Our challenge, not tomorrow but today, is to accomplish objectives which have eluded mankind since the beginning of time. We must bring equal justice to all our citizens. We must abolish human poverty. We must eradicate killing and crippling disease and lengthen the span of life to 100 or 200 years. We must eliminate illiteracy among all of our people.</p>\n",
    "prompt": "<p>Select the <span class=\"relative-emphasis\">three</span> words from below that specifically describe the &#8220;enemies&#8221; which Johnson wants to eliminate.</p>",
    "rationale": "<p>In paragraph 6, Johnson refers to the &#8220;ancient enemies&#8221;&#8212;which he defines as poverty, disease, illiteracy, strife, and bigotry. In paragraph 3, he talks about this idea by explaining that he wants to &#8220;accomplish objectives which have eluded mankind;&#8221; that is, to eliminate these enemies.</p>",
    // "element": "select-text",
    "maxSelections": 3
  }  ));
};
