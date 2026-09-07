/**
 * Mirrors the "Number Line Demo" item that reproduced PIE-1005 (blank number
 * line / BigInt TypeError in the author). Keep this in sync with that item so
 * the failure stays reproducible from `pie-website` / the local demo.
 */
exports.model = (id, element) => ({
  correctResponse: [
    { type: 'point', pointType: 'full', domainPosition: 1 },
    { type: 'line', leftPoint: 'full', rightPoint: 'empty', domainPosition: 1, size: 2 },
  ],
  feedback: {
    correct: { type: 'default', default: 'Correct' },
    partial: { type: 'default', default: 'Nearly' },
    incorrect: { type: 'custom', custom: '<h1>Incorrect</h1>' },
  },
  prompt: 'Set correct answer.',
  graph: {
    title: 'This is the title <span data-latex="">\\frac{1}{2}</span>',
    arrows: { left: true, right: true },
    width: 500,
    height: 400,
    domain: { min: -5, max: 5 },
    ticks: {
      minor: 1,
      major: 2,
      tickIntervalType: 'Integer',
      integerTick: 1,
      decimalTick: 0.2,
      fractionTick: '1/5',
    },
    initialElements: [],
    maxNumberOfPoints: 20,
    showMinorTicks: true,
    snapPerTick: 1,
    tickLabelOverrides: [],
    initialType: 'PF',
    exhibitOnly: false,
    availableTypes: {
      PF: true,
      LFF: true,
      LEF: true,
      LFE: true,
      LEE: true,
      RFN: true,
      RFP: true,
      REN: true,
      REP: true,
    },
  },
  promptEnabled: true,
  rationale: '',
  rationaleEnabled: true,
  teacherInstructions: '',
  teacherInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
  widthEnabled: true,
  language: '',
  titleEnabled: true,
  id,
  element,
});
