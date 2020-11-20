import {LIKERT_TYPE, LIKERT_SCALE} from './likertEntities'

const likert3Agreement = [
  {
    label: 'Disagree',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Agree',
    value: 1
  }
];

const likert5Agreement = [
  {
    label: 'Strongly Disagree',
    value: -2
  },
  ...likert3Agreement,
  {
    label: 'Strongly Agree',
    value: 2
  }
];

const likert7Agreement = [
  {
    label: 'Extremely Disagree',
    value: -3
  },
  ...likert5Agreement,
  {
    label: 'Extremely Agree',
    value: 3
  }
];

const likert3Frequency = [
  {
    label: 'Infrequently',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Frequently',
    value: 1
  }
];

const likert5Frequency = [
  {
    label: 'Very Infrequently',
    value: -2
  },
  ...likert3Frequency,
  {
    label: 'Very Frequently',
    value: 2
  }
];

const likert7Frequency = [
  {
    label: 'Never',
    value: -3
  },
  ...likert5Frequency,
  {
    label: 'Always',
    value: 3
  }
];

const likert3YesNo = [
  {
    label: 'No',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Yes',
    value: 1
  }
];

const likert5YesNo = [
  {
    label: 'No',
    value: -2
  },
  {
    label: 'Not really',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Sometimes',
    value: 1
  },
  {
    label: 'Yes',
    value: 2
  }
];

const likert7YesNo = [
  {
    label: 'No',
    value: -3
  },
  {
    label: 'Rarely',
    value: -2
  },
  {
    label: 'Not really',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Sometimes',
    value: 1
  },
  {
    label: 'Very Often',
    value: 2
  },
  {
    label: 'Always',
    value: 3
  }
];


const likert3Likelihood = [
  {
    label: 'Not Likely',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Likely',
    value: 1
  }
];

const likert5Likelihood = [
  {
    label: 'Very Unlikely',
    value: -2
  },
  ...likert3Likelihood,
  {
    label: 'Very Likely',
    value: 2
  }
];

const likert7Likelihood = [
  {
    label: 'Extremely Unlikely',
    value: -3
  },
  ...likert5Likelihood,
  {
    label: 'Extremely Likely',
    value: 3
  }
];

const likert3Importance = [
  {
    label: 'Not Important',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Important',
    value: 1
  }
];

const likert5Importance = [
  {
    label: 'Very Not Important',
    value: -2
  },
  ...likert3Importance,
  {
    label: 'Very Important',
    value: 2
  }
];

const likert7Importance = [
  {
    label: 'Extremely Not Important',
    value: -3
  },
  ...likert5Importance,
  {
    label: 'Extremely Important',
    value: 3
  }
];

const likert3Like = [
  {
    label: 'Dislike',
    value: -1
  },
  {
    label: 'Unsure',
    value: 0
  },
  {
    label: 'Like',
    value: 1
  }
];

const likert5Like = [
  {
    label: 'Really Dislike',
    value: -2
  },
  ...likert3Like,
  {
    label: 'Really Like',
    value: 2
  }
];

const likert7Like = [
  {
    label: 'Extremely Dislike',
    value: -3
  },
  ...likert5Like,
  {
    label: 'Extremely Like',
    value: 3
  }
];


const generateChoices = (likertScale, likertType) => {
  switch (`${likertScale}-${likertType}`) {
    case `${LIKERT_SCALE.likert3}-${LIKERT_TYPE.agreement}`:
      return [...likert3Agreement];
    case `${LIKERT_SCALE.likert5}-${LIKERT_TYPE.agreement}`:
      return [...likert5Agreement];
    case `${LIKERT_SCALE.likert7}-${LIKERT_TYPE.agreement}`:
      return [...likert7Agreement];
    case `${LIKERT_SCALE.likert3}-${LIKERT_TYPE.frequency}`:
      return [...likert3Frequency];
    case `${LIKERT_SCALE.likert5}-${LIKERT_TYPE.frequency}`:
      return [...likert5Frequency];
    case `${LIKERT_SCALE.likert7}-${LIKERT_TYPE.frequency}`:
      return [...likert7Frequency];
    case `${LIKERT_SCALE.likert3}-${LIKERT_TYPE.yesNo}`:
      return [...likert3YesNo];
    case `${LIKERT_SCALE.likert5}-${LIKERT_TYPE.yesNo}`:
      return [...likert5YesNo];
    case `${LIKERT_SCALE.likert7}-${LIKERT_TYPE.yesNo}`:
      return [...likert7YesNo];
    case `${LIKERT_SCALE.likert3}-${LIKERT_TYPE.likelihood}`:
      return [...likert3Likelihood];
    case `${LIKERT_SCALE.likert5}-${LIKERT_TYPE.likelihood}`:
      return [...likert5Likelihood];
    case `${LIKERT_SCALE.likert7}-${LIKERT_TYPE.likelihood}`:
      return [...likert7Likelihood];
    case `${LIKERT_SCALE.likert3}-${LIKERT_TYPE.importance}`:
      return [...likert3Importance];
    case `${LIKERT_SCALE.likert5}-${LIKERT_TYPE.importance}`:
      return [...likert5Importance];
    case `${LIKERT_SCALE.likert7}-${LIKERT_TYPE.importance}`:
      return [...likert7Importance];
    case `${LIKERT_SCALE.likert3}-${LIKERT_TYPE.like}`:
      return [...likert3Like];
    case `${LIKERT_SCALE.likert5}-${LIKERT_TYPE.like}`:
      return [...likert5Like];
    case `${LIKERT_SCALE.likert7}-${LIKERT_TYPE.like}`:
      return [...likert7Like];
    default:
      return []
  }
};

export default generateChoices;
