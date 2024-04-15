import MultiTraitRubricElement from '../index';
import defaults from '../defaults';
import { ModelUpdatedEvent, InsertSoundEvent, DeleteSoundEvent } from '@pie-framework/pie-configure-events';
import React from "react";

jest.mock('react-dom', () => ({
    render: jest.fn(),
}));

const model = (extras) => ({
    id: '1',
    element: 'multi-trait-rubric',
    visibleToStudent: true,
    halfScoring: false,
    pointLabels: true,
    description: false,
    standards: false,
    excludeZero: false,
    addScaleEnabled: true,
    maxPointsEnabled: true,
    scales: [
        {
            maxPoints: 4,
            scorePointsLabels: ['Non-Scorable', 'Developing', 'Progressing', 'Effective', 'Strong'],
            traitLabel: 'Trait',
            traits: [
                {
                    name: 'Ideas',
                    standards: [],
                    description: 'the main message',
                    scorePointsDescriptors: [
                        'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
                        'Topic undefined and/or difficult to follow\n' + '\n' + 'Details are unclear',
                        'Topic too broad\n' + '\n' + 'Details are limited',
                        'Writing stays on topic\n' + '\n' + 'Complete details given',
                        'Strong control of topic\n' + '\n' + 'Relevant, accurate, specific details that support topic',
                    ],
                },
                {
                    name: 'Organization',
                    standards: [],
                    description: 'the internal structure of the piece',
                    scorePointsDescriptors: [
                        'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
                        'Does not have a beginning, middle and/or end\n' +
                        '\n' +
                        'Does not have a lead and/or conclusion\n' +
                        '\n' +
                        'Transitions confusing and/or not present\n' +
                        '\n' +
                        'Not written in logical order\n' +
                        '\n' +
                        'No sign of paragraphing / incorrect paragraphing',
                        'Weak beginning, middle and end\n' +
                        '\n' +
                        'Has evidence of a lead and/or conclusion but missing elements\n' +
                        '\n' +
                        'Transitions are used sometimes\n' +
                        '\n' +
                        'Some logical order\n' +
                        '\n' +
                        'Most paragraphing incorrect',
                        'Has an acceptable beginning, middle and end\n' +
                        '\n' +
                        'Includes a lead and conclusion\n' +
                        '\n' +
                        'Transitions are used correctly\n' +
                        '\n' +
                        'Mostly logical order\n' +
                        '\n' +
                        'Mostly correct paragraphing',
                        'Has an effective beginning, middle and end\n' +
                        '\n' +
                        'Powerful introduction / lead and conclusion\n' +
                        '\n' +
                        'Effective transitions\n' +
                        '\n' +
                        'Logical order / sequencing\n' +
                        '\n' +
                        'Uses appropriate paragraphing',
                    ],
                },
                {
                    name: 'Word Choice',
                    standards: [],
                    description: 'the vocabulary a writer chooses to convey meaning',
                    scorePointsDescriptors: [
                        'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
                        'Vocabulary is limited/used incorrectly\n' + '\n' + 'No figurative language; words do not convey meaning',
                        'Generally correct words\n' +
                        '\n' +
                        'Attempt at figurative language\n' +
                        '\n' +
                        'and/or words convey general meaning',
                        'Some active verbs and precise nouns\n' +
                        '\n' +
                        'Effective use of figurative language and/or words that enhance meaning',
                        'Powerful and engaging words\n' + '\n' + 'Artful use of figurative language and/or sensory detail',
                    ],
                },
                {
                    name: 'Sentence Fluency',
                    standards: [],
                    description: 'the rhythm and flow of the language',
                    scorePointsDescriptors: [
                        'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
                        'No sentences are clear\n' +
                        '\n' +
                        'No variety in sentence structure\n' +
                        '\n' +
                        'Frequent run-ons and/or fragments are present',
                        'Some sentences are clear\n' +
                        '\n' +
                        'Sentence variety used rarely\n' +
                        '\n' +
                        'Some run-ons and/or fragments are present',
                        'Most sentences are clear\n' +
                        '\n' +
                        'Some sentence variety is used\n' +
                        '\n' +
                        'Run-ons and/or fragments are rare',
                        'All Sentences are clear\n' +
                        '\n' +
                        'Variety of sentence structure is used\n' +
                        '\n' +
                        'Run-ons and/or fragments are not present',
                    ],
                },
                {
                    name: 'Conventions',
                    standards: [],
                    description: 'the mechanical correctness',
                    scorePointsDescriptors: [
                        'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
                        'Many distracting errors are present in grammar, punctuation, capitalization and/or spelling',
                        'Errors in grammar, punctuation, capitalization and/or spelling are present and some distract from meaning',
                        'Errors in grammar, punctuation, capitalization and/or spelling are present but don’t distract from meaning',
                        'Few errors in grammar, punctuation,\n' + '\n' + 'capitalization and/or spelling',
                    ],
                },
                {
                    name: 'Voice',
                    standards: [],
                    description: "the personal tone and flavor of the author's message",
                    scorePointsDescriptors: [
                        'Student’s response is blank, not in English, not legible, or does not respond to the prompt.',
                        'Not concerned with audience or purpose\n' +
                        '\n' +
                        'No viewpoint (perspective) used\n' +
                        '\n' +
                        'Writing is mechanical and lifeless',
                        'Shows beginning awareness of audience/purpose\n' +
                        '\n' +
                        'Some viewpoint (perspective) used throughout the piece\n' +
                        '\n' +
                        'Writing is distant, too formal or informal',
                        'Awareness of audience; purpose is clear most of the time\n' +
                        '\n' +
                        'Uses viewpoint (perspective) throughout most of the paper\n' +
                        '\n' +
                        'Writing is pleasant, agreeable and satisfying',
                        'Powerful connection with audience; purpose is clearly communicated\n' +
                        '\n' +
                        'Maintains strong viewpoint (perspective) throughout entire piece\n' +
                        '\n' +
                        'Writing is expressive, engaging and has lots of energy',
                    ],
                },
            ],
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
            ],
        },
    ],
    ...extras,
});
const configuration = () => ({
        baseInputConfiguration: {
            audio: { disabled: false },
            video: { disabled: false },
            image: { disabled: false },
        },
        expandedInput: {
            inputConfiguration: {
                math: { disabled: true },
                audio: { disabled: false },
                video: { disabled: false },
                image: { disabled: true },
            },
        },
        labelInput: {
            inputConfiguration: {
                math: { disabled: true },
                audio: { disabled: true },
                video: { disabled: true },
                image: { disabled: true },
            },
        },
        excludeZeroDialogBoxContent: {
            title: 'Exclude 0 (Zero) from Score Point Values.',
            text: `<div>
        You are about to exclude 0 from score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the left
          </li>
          <li>
            remove 0 column with its Label and Description
          </li>
        </ul>
      </div>`,
        },
        includeZeroDialogBoxContent: {
            title: 'Include 0 (Zero) in Score Point Values.',
            text: `<div>
        You are about to include 0 in score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the right
          </li>
          <li>
            add 0 column with empty Label and Descriptions
          </li>
        </ul>
      </div>`,
        },
        deleteScaleDialogBoxContent: {
            title: 'Delete Scale',
            text: 'Are you sure you want to delete this scale?',
        },
        maxPointsDialogBoxContent: {
            title: 'Decreasing Max Points.',
            text: ` You are about to decrease max score point value.
        <br/>
        All the Labels and Descriptions for scores above Max Point will be deleted.`,
        },
        settingsPanelDisabled: false,
        spellCheck: {
            label: 'Spellcheck',
            settings: false,
            enabled: true,
        },
        showExcludeZero: {
            settings: true,
            label: 'Exclude Zero',
        },
        showScorePointLabels: {
            settings: true,
            label: 'Show Score Point Labels',
        },
        showDescription: {
            settings: true,
            label: 'Show Description',
        },
        showVisibleToStudent: {
            settings: true,
            label: 'Visible to Student',
        },
        showHalfScoring: {
            settings: true,
            label: 'Half Scoring',
        },
        showStandards: {
            settings: false,
            label: 'Show Standards',
        },
        showLevelTagInput: {
            settings: false,
            label: 'Show Level Tag Input',
            enabled: false,
        },
        dragAndDrop: {
            settings: true,
            label: 'Enable Drag and Drop',
            enabled: false,
        },
        showMaxPoint: {
            settings: true,
            label: 'Show Max Points Dropdown',
        },
        addScale: {
            settings: true,
            label: 'Add Scale Available',
        },
        minNoOfTraits: 1,
        maxNoOfTraits: 10,
        minNoOfScales: 1,
        maxNoOfScales: 10,
        defaultTraitLabel: 'Trait',
        mathMlOptions: {
            mmlOutput: false,
            mmlEditing: false,
        },
        maxMaxPoints: 10,
    });

describe('MultiTraitRubricElement', () => {
    let element;

    beforeEach(() => {
        element = new MultiTraitRubricElement();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('set model', () => {
        it('should set the model correctly', () => {
            const newModel = model();
            element.model = newModel;
            expect(element._model).toEqual(newModel);
        });
    });

    describe('onModelChanged', () => {
        it('should dispatch ModelUpdatedEvent on model change', () => {
            const newModel = model();
            const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');
            element.onModelChanged(newModel);
            expect(element._model).toEqual(newModel);
            expect(dispatchEventSpy).toHaveBeenCalledWith(new ModelUpdatedEvent(newModel, false));
        });
    });

    describe('set configuration', () => {
        it('should set the configuration correctly', () => {
            const newConfiguration = configuration();
            element.configuration = newConfiguration;
            expect(element._configuration).toEqual(newConfiguration);
        });
    });

    describe('onConfigurationChanged', () => {
        it('should call _render method on configuration change', () => {
            const newConfiguration = configuration();
            const renderSpy = jest.spyOn(element, '_render');
            element.onConfigurationChanged(newConfiguration);
            expect(element._configuration).toEqual(newConfiguration);
            expect(renderSpy).toHaveBeenCalled();
        });
    });

    describe('insertSound', () => {
        it('should dispatch InsertSoundEvent', () => {
            const handler = jest.fn();
            const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');
            element.insertSound(handler);
            expect(dispatchEventSpy).toHaveBeenCalledWith(new InsertSoundEvent(handler));
        });
    });

    describe('onDeleteSound', () => {
        it('should dispatch DeleteSoundEvent', () => {
            const src = 'test.mp3';
            const done = jest.fn();
            const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');
            element.onDeleteSound(src, done);
            expect(dispatchEventSpy).toHaveBeenCalledWith(new DeleteSoundEvent(src, done));
        });
    });

    describe('updateModelAccordingToReceivedProps', () => {
        it('should return the same model if it is already valid', () => {
            const validModel = model();
            const validatedModel = element.updateModelAccordingToReceivedProps(validModel);
            expect(validatedModel).toEqual(validModel);
        });

        it('should return an empty model if the input model is undefined', () => {
            const validatedModel = element.updateModelAccordingToReceivedProps(undefined);
            expect(validatedModel).toEqual(defaults.model);
        });

        it('should return an empty model if the input model is null', () => {
            const validatedModel = element.updateModelAccordingToReceivedProps(null);
            expect(validatedModel).toEqual(defaults.model);
        });

        it('should handle undefined or null traits array within scales', () => {
            const inputModel = model({
                scales: [
                    {
                        maxPoints: 4,
                        scorePointsLabels: ['Non-Scorable', 'Developing', 'Progressing', 'Effective', 'Strong'],
                        traits: null,
                    },
                    {
                        maxPoints: 2,
                        scorePointsLabels: ['Non-Scorable', 'Unsatisfactory', 'Satisfactory'],
                        traits: undefined,
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(inputModel);
            expect(validatedModel.scales[0].traits).toEqual([]);
            expect(validatedModel.scales[1].traits).toEqual([]);
        });

        it('should handle undefined or null scorePointsLabels array within scales', () => {
            const inputModel = model({
                excludeZero: true,
                scales: [
                    {
                        maxPoints: 4,
                        scorePointsLabels: null,
                        traits: [
                            {
                                scorePointsDescriptors: ['Descriptor 1', 'Descriptor 2', 'Descriptor 3', 'Descriptor 4'],
                            },
                        ],
                    },
                    {
                        maxPoints: 2,
                        scorePointsLabels: undefined,
                        traits: [
                            {
                                scorePointsDescriptors: ['Descriptor 1', 'Descriptor 2'],
                            },
                        ],
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(inputModel);
            expect(validatedModel.scales[0].scorePointsLabels).toEqual(["", "", "", ""]);
            expect(validatedModel.scales[1].scorePointsLabels).toEqual(["", ""]);
        });

        it('should handle undefined or null scorePointsDescriptors array within traits', () => {
            const inputModel = model({
                scales: [
                    {
                        maxPoints: 4,
                        scorePointsLabels: ['Non-Scorable', 'Developing', 'Progressing', 'Effective', 'Strong'],
                        traits: [
                            {
                                scorePointsDescriptors: null,
                            },
                        ],
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(inputModel);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors).toEqual(["", "" ,"", "", ""]);
        });

        it('should adjust the model if scorePointsLabels do not match the expected length', () => {
            const invalidModel = model({
                excludeZero: false,
                scales: [
                    {
                        maxPoints: 3,
                        scorePointsLabels: ['Non-Scorable', 'Developing', 'Effective', 'Strong'],
                        traitLabel: 'Trait',
                        traits: [
                            {
                                scorePointsDescriptors: ['Descriptor 1', 'Descriptor 2', 'Descriptor 3', 'Descriptor 4'],
                            },
                        ],
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(invalidModel);
            expect(validatedModel.scales[0].scorePointsLabels.length).toBe(4);
        });

        it('should adjust the model if scorePointsDescriptors do not match the expected length', () => {
            const invalidModel = model({
                excludeZero: false,
                scales: [
                    {
                        maxPoints: 3,
                        scorePointsLabels: ['Non-Scorable', 'Developing', 'Effective', 'Strong'],
                        traits: [
                            {
                                scorePointsDescriptors: ['Descriptor 1', 'Descriptor 2'],
                            },
                        ],
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(invalidModel);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors.length).toBe(4);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors).toEqual(['Descriptor 1', 'Descriptor 2','','']);
        });

        it('should handle excludeZero option correctly', () => {
            const invalidModel = model({
                excludeZero: true,
                scales: [
                    {
                        maxPoints: 3,
                        scorePointsLabels: ['Non-Scorable', 'Developing', 'Effective'],
                        traits: [
                            {
                                scorePointsDescriptors: ['Descriptor 1', 'Descriptor 2', 'Descriptor 3'],
                            },
                        ],
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(invalidModel);
            expect(validatedModel.scales[0].scorePointsLabels.length).toBe(3);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors.length).toBe(3);
        });
    });
    
});