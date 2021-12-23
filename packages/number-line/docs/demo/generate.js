exports.oldModel = (id, element) => ({
  id,
  element,
  correctResponse: [
    {
      type: 'point',
      pointType: 'full',
      domainPosition: 1
    },
    {
      type: 'line',
      leftPoint: 'full',
      rightPoint: 'empty',
      domainPosition: 1,
      size: 2
    }
  ],
  feedback: {
    correct: {
      type: 'default',
      default: 'Correct'
    },
    partial: {
      type: 'default',
      default: 'Nearly'
    },
    incorrect: {
      type: 'custom',
      custom: '<h1>Incorrect</h1>'
    }
  },
  prompt: 'Set correct answer.',
  graph: {
    title: 'This is the title <span data-latex="">\\frac{1}{2}</span>',
    arrows: {
      left: true,
      right: true
    },
    width: 500,
    domain: { min: -5, max: 5 },
    ticks: {
      minor: 1,
      major: 2
    },
    initialElements: [
      {
        type: 'point',
        pointType: 'full',
        domainPosition: -1
      }
    ],
    maxNumberOfPoints: 20,
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
      REP: true
    }
  }
});

exports.model = (id, element) => ({
  toolbarEditorPosition: 'bottom',
  correctResponse: [
    {
      pointType: 'full',
      type: 'point',
      domainPosition: 0.41666664999999997
    }
  ],
  graph: {
    maxNumberOfPoints: 1,
    ticks: {
      major: 0.08333333,
      minor: 0.08333333
    },
    domain: {
      min: 0,
      max: 1
    },
    width: 500,
    initialElements: [],
    initialType: 'PF',
    availableTypes: {
      PF: true
    },
    title: '<div></div>'
  },
  id,
  prompt:
    '<div>Part B:<br/><br/>On the number line, plot the probability that a card selected at random from the set of cards will have a rhombus or a rectangle.</div>',
  element
});
