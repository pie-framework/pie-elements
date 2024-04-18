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
    ...defaults.model,
    ...extras,
});
const configuration = (c) => ({...defaults.configuration, ...c});

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
        it('should call _render method on configuration change and overwrite the defaults with the new values', () => {
            const newConfiguration = configuration({"minNoOfTraits": 2});
            const renderSpy = jest.spyOn(element, '_render');
            element.onConfigurationChanged(newConfiguration);
            expect(element._configuration.minNoOfTraits).toEqual(2);
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
                        scorePointsLabels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
                        traits: null,
                    },
                    {
                        maxPoints: 2,
                        scorePointsLabels: ['Label 1', 'Label 2', 'Label 3'],
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
            expect(validatedModel.scales[0].scorePointsLabels).toEqual(['', '', '', '']);
            expect(validatedModel.scales[1].scorePointsLabels).toEqual(['', '']);
        });

        it('should handle undefined or null scorePointsDescriptors array within traits', () => {
            const inputModel = model({
                scales: [
                    {
                        maxPoints: 4,
                        scorePointsLabels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
                        traits: [
                            {
                                scorePointsDescriptors: null,
                            },
                        ],
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(inputModel);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors).toEqual(['', '' ,'', '', '']);
        });

        it('should adjust the model if scorePointsLabels and scorePointsDescriptors do not match the expected length', () => {
            const invalidModel = model({
                excludeZero: false,
                scales: [
                    {
                        maxPoints: 3,
                        scorePointsLabels: ['Label 1', 'Label 2', 'Label 3'],
                        traitLabel: 'Trait',
                        traits: [
                            {
                                scorePointsDescriptors: ['Descriptor 1', 'Descriptor 2', 'Descriptor 3'],
                            },
                        ],
                    },
                ],
            });
            const validatedModel = element.updateModelAccordingToReceivedProps(invalidModel);
            expect(validatedModel.scales[0].scorePointsLabels).toEqual(['Label 1', 'Label 2', 'Label 3','']);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors).toEqual(['Descriptor 1', 'Descriptor 2', 'Descriptor 3', '']);


        });

        it('should handle excludeZero option correctly', () => {
            const invalidModel = model({
                excludeZero: true,
                scales: [
                    {
                        maxPoints: 3,
                        scorePointsLabels: ['Label 1', 'Label 2', 'Label 3'],
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
            expect(validatedModel.scales[0].scorePointsLabels).toEqual(['Label 1', 'Label 2', 'Label 3']);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors.length).toBe(3);
            expect(validatedModel.scales[0].traits[0].scorePointsDescriptors).toEqual(['Descriptor 1', 'Descriptor 2', 'Descriptor 3']);
        });
    });
    
});