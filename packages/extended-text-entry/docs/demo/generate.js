/**
 * Demo models for extended-text-entry.
 *
 * The prompts carry the math markup from the reported items (DNAFORM-2099) plus a few other shapes,
 * and `config.js` mounts several items at once - a single item on a page usually renders fine, so
 * only a multi-item page shows whether math typesetting is timed correctly.
 *
 * Every expression is prefixed with a unique tag like [3.E2] so a mis-rendered one can be named
 * exactly. Per item: E1-E6 in the prompt, T1 in the teacher instructions, F1 in the feedback.
 */

// The two forms found in the reported items. E1's span holds no delimiters and braces its exponents;
// E2's span holds the delimiters and leaves the exponents unbraced. Both have to render.
const LATEX = {
  polyBraced: 'P\\left(x\\right)=-2x^{3}-4x^{2}+18x+36',
  polyPlain: 'P\\left(x\\right)=-2x^3-4x^2+18x+36',
  quadratic: 'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}',
  radical: '\\sqrt[3]{27x^{6}}=3x^{2}',
  series: '\\sum_{n=1}^{\\infty}\\frac{1}{n^{2}}=\\frac{\\pi^{2}}{6}',
  inequality: '-3\\le x\\le 2',
};

// mathml pasted straight into the markup - no data-latex wrapper, so it exercises the other path
const MATHML =
  '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
  '<mfrac><mrow><mn>3</mn><mi>x</mi></mrow><mn>4</mn></mfrac></math>';

// no delimiters inside the wrapper: renderMath() adds them itself, via fixMathElements()
const bare = (latex) => `<span data-latex="" data-raw="${latex}">${latex}</span>`;

// already delimited - the form that shipped in the item that failed to render
const delimited = (latex) => `<span data-latex="" data-raw="${latex}">\\(${latex}\\)</span>`;

const tag = (label) => `<strong style="color:#b00020;font-family:ui-monospace,Menlo,monospace">[${label}]</strong>`;

const line = (label, note, markup) => `<div>${tag(label)} ${note}: ${markup}</div>`;

const prompt = (item) =>
  [
    `<p>Item ${item}. Every expression below must show as typeset math &mdash; ` +
      'if any shows its raw latex source instead, report it by its tag.</p>',
    line(`${item}.E1`, 'wrapper without delimiters, braced exponents', bare(LATEX.polyBraced)),
    line(`${item}.E2`, 'wrapper with delimiters, unbraced exponents', delimited(LATEX.polyPlain)),
    line(`${item}.E3`, 'fraction and radical', delimited(LATEX.quadratic)),
    line(`${item}.E4`, 'radical, no delimiters', bare(LATEX.radical)),
    line(`${item}.E5`, 'series with limits', delimited(LATEX.series)),
    line(`${item}.E6`, 'mathml, no data-latex wrapper', MATHML),
  ].join('');

/**
 * One demo item. `id` doubles as the tag prefix, so each item's expressions are named [1.E1], [2.E1]...
 */
exports.model = (id, element) => ({
  id,
  element,
  customKeys: ['\\square'],
  // only surfaces in mode=evaluate with feedbackEnabled
  feedback: {
    type: 'custom',
    default: 'this is default feedback',
    custom: line(`${id}.F1`, 'feedback', delimited(LATEX.inequality)),
  },
  feedbackEnabled: true,
  prompt: prompt(id),
  promptEnabled: true,
  // only surfaces for role=instructor in mode=view or evaluate
  teacherInstructions: line(`${id}.T1`, 'teacher instructions', delimited(LATEX.polyPlain)),
  teacherInstructionsEnabled: true,
  mathInput: true,
  playersToolbarPosition: 'bottom',
  toolbarEditorPosition: 'bottom',
  spellCheckEnabled: true,
  rubricEnabled: false,
  annotationsEnabled: false,
});

// how many items config.js and index.html mount together
exports.ITEM_COUNT = 5;

// 6 prompt expressions per item; T1 and F1 need role=instructor / mode=evaluate to show
exports.PROMPT_EXPRESSIONS_PER_ITEM = 6;
