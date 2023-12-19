exports.model = (id, element) => ({
  toolbarEditorPosition: 'bottom',
  correctResponse: [
    {
      pointType: 'full',
      type: 'point',
      domainPosition: 0,
    },
  ],
  graph: {
    maxNumberOfPoints: 1,
    ticks: {
      minor: 0.125,
      major: 1,
      labelStep: '1',
      tickIntervalType: 'Fraction',
      tickStep: '1/8',
    },
    arrows: {
      left: true,
      right: true,
    },
    domain: {
      min: 0,
      max: 1,
    },
    width: 350,
    tickLabelOverrides: ['1/6', '1/3', '1/2', '2/3', '5/6'],
    initialElements: [],
    initialType: 'PF',
    availableTypes: {
      PF: true,
    },
    title: '',
  },
  widthEnabled: true,
  id,
  teacherInstructions: '',
  prompt: '',
  element,
});
