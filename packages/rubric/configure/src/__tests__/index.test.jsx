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

const invalidModel = (extras) => ({
    id: '2',
    element: 'pie-rubric',
    points: ['A', 'B', 'C', 'D'],
    sampleAnswers: [true, true, false, false],
    maxPoints: 5,
    excludeZero: false,
    excludeZeroEnabled: true,
    maxPointsEnabled: true,
    ...extras,
});
const configuration = (c) => ({...defaults.configuration, ...c});

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
        it('should call _render method on configuration change and overwrite the defaults with the new values', () => {
            const newConfiguration = configuration({maxMaxPoints: 10});
            const renderSpy = jest.spyOn(element, '_render');
            element.onConfigurationChanged(newConfiguration);
            expect(element._configuration.maxMaxPoints).toEqual(10);
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
            expect(validatedModel.points).toEqual(['', '', '', '', '', '']);
            expect(validatedModel.sampleAnswers).toEqual([null, null, null, null, null, null]);
        });

        it('should handle case when howManyPointsDoesItHave is less than howManyPointsShouldHave with maxPoints & excludeZero changed', () => {
            const nextModel = model({
                maxPoints: 7,
                excludeZero: true,
            });
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['A', 'B', 'C', 'D', '', '', '']);
            expect(result.sampleAnswers).toEqual([true, true, false, false, null, null, null]);
        });

        it('should handle case when howManyPointsDoesItHave is less than howManyPointsShouldHave and maxPointsChanged', () => {
            const nextModel = model({
                maxPoints: 4,
                excludeZero: false
            });
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['A', 'B', 'C', 'D', '']);
            expect(result.sampleAnswers).toEqual([true, true, false, false, null]);
        });

        it('should handle case when howManyPointsDoesItHave is greater than howManyPointsShouldHave and excludeZeroChanged', () => {
            const nextModel = model({
                maxPoints: 3,
                excludeZero: true,
            });
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['B', 'C', 'D']);
            expect(result.sampleAnswers).toEqual([true, false, false]);
        });

        it('should handle case when howManyPointsDoesItHave is greater than howManyPointsShouldHave and maxPointsChanged', () => {
            const nextModel = model({
                maxPoints: 1,
                excludeZero: false,
            });
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['A','B']);
            expect(result.sampleAnswers).toEqual([true, true]);
        });

        it('should handle case when howManyPointsDoesItHave is greater than howManyPointsShouldHave, maxPointsChanged & excludeZeroChanged', () => {
            const nextModel = model({
                maxPoints: 1,
                excludeZero: true,
            });
            const result = element.updateModelAccordingToReceivedProps(nextModel);
            expect(result.points).toEqual(['B']);
            expect(result.sampleAnswers).toEqual([true]);
        });

        it('should handle case if invalid model is set, after updateModelAccordingToReceivedProps the returned model is valid', () => {
            const newModel = invalidModel();
            element.onModelChanged(newModel);
            expect(element._model.points).toEqual(["A", "B", "C", "D", "", ""]);
            expect(element._model.sampleAnswers).toEqual([true, true, false, false, null, null]);
        });
    });
    
});