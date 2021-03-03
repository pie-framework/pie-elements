import {shallow} from 'enzyme';
import React from 'react';

import {Main} from '../main';
import {choiceUtils as utils} from '@pie-lib/config-ui';
import {excludeZeroTypes} from '../modals';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: props => <div {...props} />,
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: jest.fn().mockReturnValue('black'),
    secondaryBackground: jest.fn().mockReturnValue('grey'),
    background: jest.fn().mockReturnValue('transparent'),
    primary: jest.fn().mockReturnValue('blue'),
  }
}));

const model = (extras) => ({
  id: '1',
  element: 'multi-trait-rubric',
  visibleToStudent: true,
  halfScoring: false,
  pointLabels: true,
  description: false,
  standards: false,
  excludeZero: true,
  scales: [
    {
      'maxPoints': 4,
      'scorePointsLabels': ['Non-Scorable', 'Developing', 'Progressing', 'Effective', 'Strong'],
      'traitLabel': 'Trait',
      'traits': [
        {
          'name': 'Ideas',
          'standards': [],
          'description': 'the main message',
          'scorePointsDescriptors': [
            'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
            'Topic undefined and/or difficult to follow\n' + '\n' + 'Details are unclear',
            'Topic too broad\n' + '\n' + 'Details are limited',
            'Writing stays on topic\n' + '\n' + 'Complete details given',
            'Strong control of topic\n' + '\n' + 'Relevant, accurate, specific details that support topic',
          ],
        },
        {
          'name': 'Organization',
          'standards': [],
          'description': 'the internal structure of the piece',
          'scorePointsDescriptors': [
            'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
            'Does not have a beginning, middle and/or end\n' + '\n' + 'Does not have a lead and/or conclusion\n' + '\n' + 'Transitions confusing and/or not present\n' + '\n' + 'Not written in logical order\n' + '\n' + 'No sign of paragraphing / incorrect paragraphing',
            'Weak beginning, middle and end\n' + '\n' + 'Has evidence of a lead and/or conclusion but missing elements\n' + '\n' + 'Transitions are used sometimes\n' + '\n' + 'Some logical order\n' + '\n' + 'Most paragraphing incorrect',
            'Has an acceptable beginning, middle and end\n' + '\n' + 'Includes a lead and conclusion\n' + '\n' + 'Transitions are used correctly\n' + '\n' + 'Mostly logical order\n' + '\n' + 'Mostly correct paragraphing',
            'Has an effective beginning, middle and end\n' + '\n' + 'Powerful introduction / lead and conclusion\n' + '\n' + 'Effective transitions\n' + '\n' + 'Logical order / sequencing\n' + '\n' + 'Uses appropriate paragraphing',
          ],
        },
        {
          'name': 'Word Choice',
          'standards': [],
          'description': 'the vocabulary a writer chooses to convey meaning',
          'scorePointsDescriptors': [
            'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
            'Vocabulary is limited/used incorrectly\n' + '\n' + 'No figurative language; words do not convey meaning',
            'Generally correct words\n' + '\n' + 'Attempt at figurative language\n' + '\n' + 'and/or words convey general meaning',
            'Some active verbs and precise nouns\n' + '\n' + 'Effective use of figurative language and/or words that enhance meaning',
            'Powerful and engaging words\n' + '\n' + 'Artful use of figurative language and/or sensory detail',
          ],
        },
        {
          'name': 'Sentence Fluency',
          'standards': [],
          'description': 'the rhythm and flow of the language',
          'scorePointsDescriptors': [
            'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
            'No sentences are clear\n' + '\n' + 'No variety in sentence structure\n' + '\n' + 'Frequent run-ons and/or fragments are present',
            'Some sentences are clear\n' + '\n' + 'Sentence variety used rarely\n' + '\n' + 'Some run-ons and/or fragments are present',
            'Most sentences are clear\n' + '\n' + 'Some sentence variety is used\n' + '\n' + 'Run-ons and/or fragments are rare',
            'All Sentences are clear\n' + '\n' + 'Variety of sentence structure is used\n' + '\n' + 'Run-ons and/or fragments are not present',
          ],
        },
        {
          'name': 'Conventions',
          'standards': [],
          'description': 'the mechanical correctness',
          'scorePointsDescriptors': [
            'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
            'Many distracting errors are present in grammar, punctuation, capitalization and/or spelling',
            'Errors in grammar, punctuation, capitalization and/or spelling are present and some distract from meaning',
            'Errors in grammar, punctuation, capitalization and/or spelling are present but don’t distract from meaning',
            'Few errors in grammar, punctuation,\n' + '\n' + 'capitalization and/or spelling',
          ],
        },
        {
          'name': 'Voice',
          'standards': [],
          'description': 'the personal tone and flavor of the author\'s message',
          'scorePointsDescriptors': [
            'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
            'Not concerned with audience or purpose\n' + '\n' + 'No viewpoint (perspective) used\n' + '\n' + 'Writing is mechanical and lifeless',
            'Shows beginning awareness of audience/purpose\n' + '\n' + 'Some viewpoint (perspective) used throughout the piece\n' + '\n' + 'Writing is distant, too formal or informal',
            'Awareness of audience; purpose is clear most of the time\n' + '\n' + 'Uses viewpoint (perspective) throughout most of the paper\n' + '\n' + 'Writing is pleasant, agreeable and satisfying',
            'Powerful connection with audience; purpose is clearly communicated\n' + '\n' + 'Maintains strong viewpoint (perspective) throughout entire piece\n' + '\n' + 'Writing is expressive, engaging and has lots of energy',
          ],
        }
      ]
    },
    {
      maxPoints: 2,
      scorePointsLabels: ['Non-Scorable', 'Unsatisfactory', 'Satisfactory'],
      traitLabel: 'Category',
      traits: [
        {
          name: 'Presentation',
          standards: [],
          description: '',
          scorePointsDescriptors: [
            'Handwriting is unreadable, or response is blank, not in English, or too brief to evaluate. ',
            'Handwriting poor\n' + '\n' + 'Overall appearance is distracting to unacceptable',
            'Handwriting is generally legible\n' + '\n' + 'Overall appearance is acceptable or better',
          ],
        },
      ]
    }
  ],
  ...extras
});

describe('Main', () => {
  let initialModel = model();
  let onModelChanged;
  let onConfigurationChanged;

  const wrapper = extras => {
    const defaults = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: model(extras),
      configuration: {
        showStandards: {
          settings: false,
          label: 'Show Standards',
          enabled: false
        },
        showExcludeZero: {
          settings: true,
          label: 'Exclude Zero',
          enabled: false
        },
        showScorePointLabels: {
          settings: true,
          label: 'Show Score Point Labels',
          enabled: false
        },
        showLevelTagInput: {
          settings: true,
          label: 'Show Level Tag Input',
          enabled: false
        },
        showDescription: {
          settings: true,
          label: 'Show Description',
          enabled: false
        },
        showVisibleToStudent: {
          settings: true,
          label: 'Visible to Student',
          enabled: false
        },
        showHalfScoring: {
          settings: true,
          label: 'Half Scoring',
          enabled: false
        },
        dragAndDrop: {
          settings: false,
          label: 'Enable Drag and Drop',
          enabled: false,
        }
      },
    };
    const props = {...defaults};

    return shallow(<Main {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders without scales', () => {
      const w = wrapper({scales: []});
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    beforeEach(() => {
      onModelChanged = jest.fn();
      onConfigurationChanged = jest.fn();
    });

    describe('changeExcludeZero', () => {
      it('scales is empty array', () => {
        const w = wrapper({scales: null});

        w.instance().changeExcludeZero(excludeZeroTypes.remove0);
        expect(onModelChanged).not.toBeCalled();
      })

      it('removes zero', () => {
        const w = wrapper({
          scales: [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['Zero', 'One', 'Two', 'Three', 'Four'],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['Zero', 'One', 'Two'],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['a', 'b', 'c'],
                },
              ]
            }
          ]
        })
        const {excludeZero} = w.instance().props.model;

        w.instance().changeExcludeZero(excludeZeroTypes.remove0);

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales:  [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['One', 'Two', 'Three', 'Four'],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['b', 'c', 'd', 'e'],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['b', 'c', 'd', 'e'],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['One', 'Two'],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['b', 'c'],
                },
              ]
            }
          ],
          excludeZero: !excludeZero
        });
      });

      it('add0 zero', () => {
        const w = wrapper({
          scales: [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['Zero', 'One', 'Two', 'Three', 'Four'],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['Zero', 'One', 'Two'],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['a', 'b', 'c'],
                },
              ]
            }
          ]
        })
        const {excludeZero} = w.instance().props.model;

        w.instance().changeExcludeZero(excludeZeroTypes.add0);

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales:  [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['', 'Zero', 'One', 'Two', 'Three', 'Four'],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['', 'a', 'b', 'c', 'd', 'e'],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['', 'a', 'b', 'c', 'd', 'e'],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['', 'Zero', 'One', 'Two'],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['', 'a', 'b', 'c'],
                },
              ]
            }
          ],
          excludeZero: !excludeZero
        });
      });

      it('shift to Left', () => {
        const w = wrapper({
          scales: [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['Zero', 'One', 'Two', 'Three', 'Four'],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['Zero', 'One', 'Two'],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['a', 'b', 'c'],
                },
              ]
            }
          ]
        })
        const {excludeZero} = w.instance().props.model;

        w.instance().changeExcludeZero(excludeZeroTypes.shiftLeft);

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales:  [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['Zero', 'One', 'Two', 'Three'],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd'],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd'],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['Zero', 'One'],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['a', 'b'],
                },
              ]
            }
          ],
          excludeZero: !excludeZero
        });
      });

      it('shift to Right', () => {
        const w = wrapper({
          scales: [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['Zero', 'One', 'Two', 'Three', 'Four'],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e'],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['Zero', 'One', 'Two'],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['a', 'b', 'c'],
                },
              ]
            }
          ]
        })
        const {excludeZero} = w.instance().props.model;

        w.instance().changeExcludeZero(excludeZeroTypes.shiftRight);

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales:  [
            {
              'maxPoints': 4,
              'scorePointsLabels': ['Zero', 'One', 'Two', 'Three', 'Four', ''],
              'traitLabel': 'Trait',
              'traits': [
                {
                  'name': 'Ideas',
                  'standards': [],
                  'description': 'the main message',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e', ''],
                },
                {
                  'name': 'Organization',
                  'standards': [],
                  'description': 'the internal structure of the piece',
                  'scorePointsDescriptors': ['a', 'b', 'c', 'd', 'e', ''],
                },
              ]
            },
            {
              maxPoints: 2,
              scorePointsLabels: ['Zero', 'One', 'Two', ''],
              traitLabel: 'Category',
              traits: [
                {
                  name: 'Presentation',
                  standards: [],
                  description: '',
                  scorePointsDescriptors: ['a', 'b', 'c', ''],
                },
              ]
            }
          ],
          excludeZero: !excludeZero
        });
      });
    });

    describe('onScaleAdded', () => {
      it('adds a scale', () => {
        const w = wrapper();
        w.instance().onScaleAdded();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales: [
            ...initialModel.scales,
            {
              excludeZero: false,
              maxPoints: 1,
              scorePointsLabels: ['', ''],
              traitLabel: '',
              traits: []
            }
          ]
        });
      });
    });

    describe('onScaleChanged', () => {
      it('does not call onModelChanged if index less than 0', () => {
        const w = wrapper();
        w.instance().onScaleChanged(-1);

        expect(onModelChanged).not.toBeCalled();
      });

      it('does not call onModelChanged if index more than length', () => {
        const w = wrapper();
        w.instance().onScaleChanged(100);

        expect(onModelChanged).not.toBeCalled();
      });

      it('does not call onModelChanged if params null', () => {
        const w = wrapper();
        w.instance().onScaleChanged(0, null);

        expect(onModelChanged).not.toBeCalled();
      });

      it('does not call onModelChanged if params undefined', () => {
        const w = wrapper();
        w.instance().onScaleChanged(0, undefined);

        expect(onModelChanged).not.toBeCalled();
      });

      it('does not call onModelChanged if params empty', () => {
        const w = wrapper();
        w.instance().onScaleChanged(0, {});

        expect(onModelChanged).not.toBeCalled();
      });

      it('changes a scale\'s excludeZero', () => {
        const w = wrapper();
        const [firstScale, ...scales] = w.instance().props.model.scales;
        w.instance().onScaleChanged(0, {excludeZero: true});

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales: [
            {...firstScale, excludeZero: true},
            ...scales
          ]
        });
      });

      it('changes a scale\'s maxPoints', () => {
        const w = wrapper();
        const [firstScale, ...scales] = w.instance().props.model.scales;
        w.instance().onScaleChanged(0, {maxPoints: 3});

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales: [
            {...firstScale, maxPoints: 3},
            ...scales
          ]
        });
      });

      it('changes a scale\'s scorePointsLabels', () => {
        const w = wrapper();
        const [firstScale, ...scales] = w.instance().props.model.scales;
        w.instance().onScaleChanged(0, {scorePointsLabels: []});

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales: [
            {...firstScale, scorePointsLabels: []},
            ...scales
          ]
        });
      });

      it('changes a scale\'s traitLabel', () => {
        const w = wrapper();
        const [firstScale, ...scales] = w.instance().props.model.scales;
        w.instance().onScaleChanged(0, {traitLabel: 'Test'});

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales: [
            {...firstScale, traitLabel: 'Test'},
            ...scales
          ]
        });
      });

      it('changes a scale\'s traits', () => {
        const w = wrapper();
        const [firstScale, ...scales] = w.instance().props.model.scales;
        w.instance().onScaleChanged(0, {traits: []});

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales: [
            {...firstScale, traits: []},
            ...scales
          ]
        });
      });
    });

    describe('onScaleRemoved', () => {
      it('does not call change scales if index less than 0', () => {
        const w = wrapper();
        w.instance().onScaleRemoved(-1);

        expect(onModelChanged).not.toBeCalled();
      });

      it('does not call change scales if index more then length', () => {
        const w = wrapper();
        w.instance().onScaleRemoved(100);

        expect(onModelChanged).not.toBeCalled();
      });

      it('removes scale', () => {
        const w = wrapper();
        const [firstScale, ...scales] = w.instance().props.model.scales;

        w.instance().onScaleRemoved(0);

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          scales
        });
      });
    });

    describe('onHalfScoringChanged', () => {
      it('changes half scoring', () => {
        const w = wrapper();
        const {halfScoring} = w.instance().props.model;
        w.instance().onHalfScoringChanged();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          halfScoring: !halfScoring
        });
      });
    });

    describe('onVisibleToStudentChanged', () => {
      it('changes visible to student', () => {
        const w = wrapper();
        const {visibleToStudent} = w.instance().props.model;
        w.instance().onVisibleToStudentChanged();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          visibleToStudent: !visibleToStudent
        });
      });
    });

    describe('changeShowScorePointLabels', () => {
      it('changes show score point labels', () => {
        const w = wrapper();
        const {pointLabels} = w.instance().props.model;
        w.instance().changeShowScorePointLabels();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          pointLabels: !pointLabels
        });
      });
    });

    describe('changeShowDescription', () => {
      it('changes show description', () => {
        const w = wrapper();
        const {description} = w.instance().props.model;
        w.instance().changeShowDescription();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          description: !description
        });
      });
    });

    describe('changeShowStandards', () => {
      it('changes show standards', () => {
        const w = wrapper();
        const {standards} = w.instance().props.model;
        w.instance().changeShowStandards();

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          standards: !standards
        });
      });
    });
  });
});
