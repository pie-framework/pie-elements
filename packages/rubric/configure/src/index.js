import {
    ModelUpdatedEvent,
    InsertImageEvent,
    DeleteImageEvent
} from '@pie-framework/pie-configure-events';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import Main from './main';
import defaults from './defaults';

const modelWithDefaults = (m) => ({...defaults.model, ...m});
const configurationWithDefaults = (c) => ({...defaults.configuration, ...c});

export default class RubricElement extends HTMLElement {


    constructor() {
        super();
        debug.log('constructor called');
        this._model = modelWithDefaults();
        this._configuration = configurationWithDefaults();
        this.onModelChanged = this.onModelChanged.bind(this);
        this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
    }

    updateModelAccordingToReceivedProps = (nextModel) => {
        const currentModel = {...this._model};
        if (!nextModel) {
            return currentModel;
        }

        const validatedModel = nextModel;
        const { maxPoints, excludeZero } = validatedModel || {};

        validatedModel.points = validatedModel.points ? [...validatedModel.points] : [];
        validatedModel.sampleAnswers = validatedModel.sampleAnswers ? [...validatedModel.sampleAnswers] : [];

        const howManyPointsShouldHave = excludeZero ? maxPoints : maxPoints + 1;
        const howManyPointsDoesItHave = validatedModel.points.length;

        const excludeZeroChanged = currentModel?.excludeZero !== nextModel?.excludeZero;
        const maxPointsChanged = currentModel?.maxPoints !== nextModel?.maxPoints;

        if (howManyPointsDoesItHave < howManyPointsShouldHave) {
            if (excludeZeroChanged && !excludeZero) {
                validatedModel.points = ['', ...validatedModel.points];
                validatedModel.sampleAnswers = [null, ...validatedModel.sampleAnswers];
            }
            if (maxPointsChanged) {
                for (let i = 0; i < howManyPointsShouldHave - howManyPointsDoesItHave; i++) {
                    validatedModel.points.push('');
                    validatedModel.sampleAnswers.push(null);
                }
            }
        } 
        else if (howManyPointsDoesItHave > howManyPointsShouldHave) {
            if (excludeZeroChanged && excludeZero) {
                validatedModel.points = validatedModel.points.slice(1);
                validatedModel.sampleAnswers = validatedModel.sampleAnswers.slice(1);
            }
            if (maxPointsChanged) {
                validatedModel.points = validatedModel.points.slice(0, howManyPointsShouldHave);
                validatedModel.sampleAnswers = validatedModel.sampleAnswers.slice(0, howManyPointsShouldHave);
            }
        }

        return validatedModel;
    }

    set model(m) {
        this._model = this.updateModelAccordingToReceivedProps(modelWithDefaults(m));
        this._render();
    }

    set configuration(c) {
        this._configuration = configurationWithDefaults(c);
        this._render();
    }

    onModelChanged(m) {
        this._model = this.updateModelAccordingToReceivedProps(m);
        this._render();
        this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
    }

    onConfigurationChanged = (c) => {
        this._configuration = configurationWithDefaults(c);

        if (this._model) {
            this.onModelChanged(this._model);
        }

        this._render();
    };

    insertImage(handler) {
        this.dispatchEvent(new InsertImageEvent(handler));
    }

    onDeleteImage(src, done) {
        this.dispatchEvent(new DeleteImageEvent(src, done));
    }

    connectedCallback() {
        this._render();
    }

    _render() {
        console.log('THE MODEL', this._model);
        if (this._model) {
            let element = React.createElement(Main, {
                model: this._model,
                configuration: this._configuration,
                onModelChanged: this.onModelChanged,
                onConfigurationChanged: this.onConfigurationChanged,
                imageSupport: {
                    add: this.insertImage.bind(this),
                    delete: this.onDeleteImage.bind(this),
                },
            });

            ReactDOM.render(element, this);
        }
    }
}
