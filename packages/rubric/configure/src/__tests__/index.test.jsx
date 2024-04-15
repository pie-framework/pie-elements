import RubricElement from '../index';
import defaults from '../defaults';
import { ModelUpdatedEvent, InsertSoundEvent, DeleteSoundEvent } from '@pie-framework/pie-configure-events';
import React from "react";

jest.mock('react-dom', () => ({
    render: jest.fn(),
}));

const model = (extras) => ({
    id: '1',
    element: 'pie-rubric',
    points: ['A', 'B', 'C', 'D'],
    sampleAnswers: [true, true, false, false],
    maxPoints: 3,
    excludeZero: false,
    excludeZeroEnabled: true,
    maxPointsEnabled: true,
    ...extras,
});
const configuration = () => ({
    baseInputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
    },
    rubriclessInstruction: {
        inputConfiguration: {
            audio: { disabled: false },
            video: { disabled: false },
            image: { disabled: false },
        },
    },
    showExcludeZero: {
        settings: true,
        label: 'Ability to exclude zero',
    },
    showMaxPoint: {
        settings: true,
        label: 'Show max points dropdown',
    },
    settingsPanelDisabled: false,
    mathMlOptions: {
        mmlOutput: false,
        mmlEditing: false,
    },
    maxMaxPoints: 9,
    });

describe('RubricElement', () => {
    let element;

    beforeEach(() => {
        element = new RubricElement();
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

        it('should handle undefined properties in the input model', () => {
            const validatedModel = element.updateModelAccordingToReceivedProps({});
            expect(validatedModel).toEqual({"points": [], "sampleAnswers": []});
        });

        it('should handle null properties in the input model', () => {
            const validatedModel = element.updateModelAccordingToReceivedProps({ maxPoints: null, excludeZero: null });
            expect(validatedModel).toEqual( {"excludeZero": null, "maxPoints": null, "points": ["", ""], "sampleAnswers": [null, null]});
        });

        it('should handle undefined points and sampleAnswers arrays', () => {
            const validatedModel = element.updateModelAccordingToReceivedProps({ maxPoints: 5, excludeZero: false });
            expect(validatedModel.points).toEqual(["", "", "", "", "", ""]);
            expect(validatedModel.sampleAnswers).toEqual([null, null, null, null, null, null]);
        });

        it('should handle case when howManyPointsDoesItHave is less than howManyPointsShouldHave, maxPointsChanged & excludeZeroChanged', () => {
            const nextModel = {
                maxPoints: 7,
                excludeZero: true,
                points: ['A','B', 'C', 'D'],
                sampleAnswers: [true, true, false, false],
            };
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['A', 'B', 'C', 'D', '', '', '']);
            expect(result.sampleAnswers).toEqual([true, true, false, false, null, null, null]);
        });

        it('should handle case when howManyPointsDoesItHave is less than howManyPointsShouldHave and maxPointsChanged', () => {
            const nextModel = {
                maxPoints: 4,
                excludeZero: false,
                points: ['A', 'B', 'C', 'D'],
                sampleAnswers: [true, true, false, false],
            };
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['A', 'B', 'C', 'D', '']);
            expect(result.sampleAnswers).toEqual([true, true, false, false, null]);
        });

        it('should handle case when howManyPointsDoesItHave is greater than howManyPointsShouldHave and excludeZeroChanged', () => {
            const nextModel = {
                maxPoints: 3,
                excludeZero: true,
                points: ['A', 'B', 'C', 'D'],
                sampleAnswers: [true, true, false, false],
            };
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['B', 'C', 'D']);
            expect(result.sampleAnswers).toEqual([true, false, false]);
        });

        it('should handle case when howManyPointsDoesItHave is greater than howManyPointsShouldHave and maxPointsChanged', () => {
            const nextModel = {
                maxPoints: 1,
                excludeZero: false,
                points: ['A', 'B', 'C', 'D'],
                sampleAnswers: [true, true, false, false],
            };
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['A','B']);
            expect(result.sampleAnswers).toEqual([true, true]);
        });

        it('should handle case when howManyPointsDoesItHave is greater than howManyPointsShouldHave, maxPointsChanged & excludeZeroChanged', () => {
            const nextModel = {
                maxPoints: 1,
                excludeZero: true,
                points: ['A', 'B', 'C', 'D'],
                sampleAnswers: [true, true, false, false],
            };
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['B']);
            expect(result.sampleAnswers).toEqual([true]);
        });
    });
    
});