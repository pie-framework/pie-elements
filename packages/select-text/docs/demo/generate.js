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
      // highlightChoices: true,
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
  'text': 'A. Almost never\n\nB. Once in a while\n\nC. Sometimes\n\nD. Often\n\nE. Almost all the time',
  'tokens': [
    {
      'text': 'A. Almost never',
      'end': 15,
      'start': 0,
      'correct': true
    },
    {
      'start': 17,
      'end': 35,
      'correct': false,
      'text': 'B. Once in a while'
    },
    {
      'correct': false,
      'end': 49,
      'start': 37,
      'text': 'C. Sometimes'
    },
    {
      'text': 'D. Often',
      'correct': false,
      'end': 59,
      'start': 51
    },
    {
      'start': 61,
      'correct': false,
      'end': 83,
      'text': 'E. Almost all the time'
    }
  ],
  'rationale': '<p>answers vary</p>',
  'partialScoring': true,
  'teacherInstructions': '',
  'prompt': '<p>I got my work done right away instead of waiting until the last minute.</p>',
  'maxSelections': 1,
};

exports.model = (id, element) => {
  return Object.assign({}, { id, element }, base(     {
    // "id": "8a808081701d693801703174fb900421",
    'teacherInstructions': '',
    'partialScoring': true,
    'prompt': '<p>Select the sentence from&#160;&#34;The Gymnast&#34; that <span class="relative-emphasis">best</span> represents the theme.</p>',
    'rationale': '<p>The final sentence of the passage best exemplifies the theme of the short story because Natasha&#39;s practice and determination finally pays off.</p>',
    'tokens': [
      {
        'text': 'She thought about what she had to do, struggling to rein in her wild, fearful thoughts.',
        'end': 90,
        'start': 3,
        'correct': false
      },
      {
        'start': 449,
        'end': 585,
        'text': 'Just for a hair of a moment, Natasha wondered if she really wanted a perfect 10, so weary was she of trying for but never achieving one.',
        'correct': false
      },
      {
        'end': 627,
        'correct': false,
        'text': 'At last Natasha\'s moment arrived.',
        'start': 594
      },
      {
        'end': 743,
        'text': 'The faces of past giants of gymnastics swam before her mind\'s eye, now razor&#8211;sharp with fierce determination.',
        'correct': false,
        'start': 628
      },
      {
        'text': 'Suddenly, the din of the gymnasium was silent to her.',
        'end': 997,
        'correct': false,
        'start': 944
      },
      {
        'end': 1087,
        'start': 998,
        'correct': false,
        'text': 'Forcing all sound out of her mind, she focused on the gleaming balance beam ahead of her.'
      },
      {
        'correct': true,
        'start': 1088,
        'end': 1225,
        'text': 'Taking a deep breath, Natasha made her graceful, yet powerful approach, mounted the beam flawlessly, and...executed her first perfect 10.'
      }
    ],
    // "element": "select-text",
    'text': '<p>She thought about what she had to do, struggling to rein in her wild, fearful thoughts. Coach Cummings always said that an undisciplined mind never scored a perfect 10. Natasha wanted to please her Coach, yet sometimes his approval wasn\'t as exciting as his anger. The gymnasts were unanimous about one thing: Coach Cummings\'s fits of disapproving rage were much more humorous to witness than his infrequent, backslapping moments of high praise. Just for a hair of a moment, Natasha wondered if she really wanted a perfect 10, so weary was she of trying for but never achieving one.</p>\n\n<p>At last Natasha\'s moment arrived. The faces of past giants of gymnastics swam before her mind\'s eye, now razor&#8211;sharp with fierce determination. "I am talented. I am not afraid. I will make a perfect 10," she spoke aloud to herself, as she approached the mat, dusted her hands with chalk to prevent slippage, and returned to her starting point. Suddenly, the din of the gymnasium was silent to her. Forcing all sound out of her mind, she focused on the gleaming balance beam ahead of her. Taking a deep breath, Natasha made her graceful, yet powerful approach, mounted the beam flawlessly, and...executed her first perfect 10.</p>\n'
  }  ));
};
