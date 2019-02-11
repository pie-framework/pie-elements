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
  { start: 583, end: 1465 },
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
      prompt: 'What sentences contain the character 6 in them?',
      text:
        'Rachel cut out 8 stars in 6 minutes. Lovelle cut out 6 stars in 4 minutes. Rachel cut out 4 more stars than Lovelle. Lovelle and Rachel cut the same number of stars in 6 minutes.',
      tokens: tokens(),
      configure: {
        /**
         * These are the configurable options
         */
        /*
        promptLabel: 'Item Stem',
        contentLabel : 'Contents',
        highlightChoicesLabel: 'Type of Answer',
        tokensLabel: 'Tokens',
        setCorrectAnswersLabel: 'Set correct answers',
        modeLabel: '',
        availableSelectionsLabel: '',
        correctAnswersLabel: '',
        selectionCountLabel: '',
        enableContentChange: false,
        enableHighlightChoices: false,
        enableTokensChange: false,
        showMode: false,
        showSelections: false,
        showCorrectAnswersNumber: false,
        showSelectionCount: false,
        enableFeedback: false*/
      }
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
      text: mathSampleText,
      tokens: mathSampleTokens,
      configure: {}
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
