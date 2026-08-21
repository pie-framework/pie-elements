# PIE-927 — math prompt repro harness (archived)

Reported as **DNAFORM-2099**: `extended-text-entry` prompts showed their raw latex source
(`P\left(x\right)=-2x^{3}...`) instead of typeset math.

This file archives the throwaway demo harness built to reproduce it. The demo itself was reverted to
its plain single-item form once the fix landed — everything needed to rebuild the harness is below.

## Cause and fix

The prompt container was located by a **shared DOM id**. With several items of the same element on
one page, every item resolved that id to the *first* match, so an item would request math
typesetting against another item's node — leaving its own prompt untypeset.

Fixed in two halves:

| Repo | Change |
| --- | --- |
| `pie-lib` | `fix(render-ui)!: scope PreviewPrompt to its own node instead of a shared id` — breaking, shipped in `@pie-lib/render-ui@7.0.0` |
| `pie-elements` | `fix: read the prompt container by class, not by the id pie-lib removed` |

## Why the harness needed several items

**A single item on a page typesets fine.** The id collision cannot happen with one item, so a
one-item demo shows nothing. Any future repro must mount **more than one** item of the same element.

The harness mounted 5 items × 6 expressions = **30 tagged prompt expressions**, each prefixed with a
unique tag (`[3.E2]`) so a mis-rendered one could be named exactly. Two extra tags per item —
`[n.T1]` in teacher instructions, `[n.F1]` in feedback — need `role=instructor` (with `mode=view` or
`evaluate`) and `mode=evaluate` respectively to appear at all.

## Expression shapes covered

The two forms below both appeared in the reported items and both must render. `E1`'s wrapper holds no
delimiters and braces its exponents; `E2`'s holds the delimiters and leaves exponents unbraced.

| Tag | Shape |
| --- | --- |
| `E1` | wrapper without delimiters, braced exponents — `P\left(x\right)=-2x^{3}-4x^{2}+18x+36` |
| `E2` | wrapper with delimiters, unbraced exponents — `P\left(x\right)=-2x^3-4x^2+18x+36` |
| `E3` | fraction and radical — `x=\frac{-b\pm\sqrt{b^{2}-4ac}}{2a}` |
| `E4` | radical, no delimiters — `\sqrt[3]{27x^{6}}=3x^{2}` |
| `E5` | series with limits — `\sum_{n=1}^{\infty}\frac{1}{n^{2}}=\frac{\pi^{2}}{6}` |
| `E6` | MathML pasted raw, no `data-latex` wrapper (exercises the other code path) |
| `T1` | teacher instructions (needs `role=instructor`) |
| `F1` | feedback (needs `mode=evaluate`) |

Two wrapper builders drove `E1`–`E5`:

```js
// no delimiters inside the wrapper: renderMath() adds them itself, via fixMathElements()
const bare = (latex) => `<span data-latex="" data-raw="${latex}">${latex}</span>`;

// already delimited - the form that shipped in the item that failed to render
const delimited = (latex) => `<span data-latex="" data-raw="${latex}">\\(${latex}\\)</span>`;
```

## Rebuilding it

Run with `yarn pie-install` / the usual demo flow from `packages/extended-text-entry`. Restore these
four files, then remember that `ITEM_COUNT` drives `config.js` and `session.js` **but not**
`index.html`, which hardcodes its elements — raising the count means adding matching markup there.

### `generate.js`

```js
const LATEX = {
  polyBraced: 'P\\left(x\\right)=-2x^{3}-4x^{2}+18x+36',
  polyPlain: 'P\\left(x\\right)=-2x^3-4x^2+18x+36',
  quadratic: 'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}',
  radical: '\\sqrt[3]{27x^{6}}=3x^{2}',
  series: '\\sum_{n=1}^{\\infty}\\frac{1}{n^{2}}=\\frac{\\pi^{2}}{6}',
  inequality: '-3\\le x\\le 2',
};

const MATHML =
  '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
  '<mfrac><mrow><mn>3</mn><mi>x</mi></mrow><mn>4</mn></mfrac></math>';

const bare = (latex) => `<span data-latex="" data-raw="${latex}">${latex}</span>`;
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

exports.model = (id, element) => ({
  id,
  element,
  customKeys: ['\\square'],
  feedback: {
    type: 'custom',
    default: 'this is default feedback',
    custom: line(`${id}.F1`, 'feedback', delimited(LATEX.inequality)),
  },
  feedbackEnabled: true,
  prompt: prompt(id),
  promptEnabled: true,
  teacherInstructions: line(`${id}.T1`, 'teacher instructions', delimited(LATEX.polyPlain)),
  teacherInstructionsEnabled: true,
  mathInput: true,
  playersToolbarPosition: 'bottom',
  toolbarEditorPosition: 'bottom',
  spellCheckEnabled: true,
  rubricEnabled: false,
  annotationsEnabled: false,
});

exports.ITEM_COUNT = 5;
exports.PROMPT_EXPRESSIONS_PER_ITEM = 6;
```

### `config.js`

```js
const { model, ITEM_COUNT } = require('./generate');

const ids = Array.from({ length: ITEM_COUNT }, (_, i) => `${i + 1}`);

module.exports = {
  elements: {
    'extended-text-entry': '../..',
  },
  models: ids.map((id) => model(id, 'extended-text-entry')),
};
```

### `session.js`

One session per model — the player needs a session whose `id` matches each model's `id`, so this must
stay the same length as `config.js`.

```js
const { ITEM_COUNT } = require('./generate');

module.exports = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  id: `${i + 1}`,
  element: 'extended-text-entry',
}));
```

### `index.html`

Five `<extended-text-entry>` elements with `pie-id="1"`…`"5"`, each wrapped in a labelled box:

```html
<div class="body">
  <div class="math-demo-item">
    <h5>item 1 &mdash; 1.E1&ndash;1.E6</h5>
    <extended-text-entry pie-id="1"></extended-text-entry>
  </div>
  <!-- repeat for pie-id 2..5 -->
</div>
```

## Regression check

Nothing here is covered by the Jest suite — it needs a real browser to observe typesetting. Rebuild
this harness and eyeball all 30 tags after any change to prompt rendering or to the math-rendering
libs (`@pie-lib/render-ui`, `@pie-lib/math-rendering`, `@pie-lib/math-rendering-accessible`).
