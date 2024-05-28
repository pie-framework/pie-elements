import React from 'react';
import ReactDOM from 'react-dom';
import {SessionChangedEvent, ModelSetEvent} from '@pie-framework/pie-player-events';
import Main from './main';
import _ from 'lodash';

export default class MathTemplated extends HTMLElement {
    constructor() {
        super();
        this.sessionChangedEventCaller = _.debounce(() => {
            this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), true));
        }, 1000);
    }

    set model(m) {
        this._model = m;

        this.render();
        this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this.isSessionComplete(), this._model !== undefined));
    }

    get model() {
        return this._model;
    }

    set session(s) {
        this._session = s;

        this.render();
    }

    get session() {
        return this._session;
    }

    isSessionComplete() {
        // a method to check if student answered the question
        return true;
    }

    onSessionChange(session) {
        // you can add an extra step here to validate session
        Object.keys(session).map((key) => {
            this._session[key] = session[key];
        });

        this.sessionChangedEventCaller();
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        console.log('In Player Render, session.answers', this._session?.answers);
        // this._model = {
        //   "config": {
        //     "responses": [
        //       {
        //         "allowSpaces": true,
        //         "answer": "1+2=3",
        //         "id": "1",
        //         "validation": "literal",
        //         "allowTrailingZeros": false,
        //         "ignoreOrder": false
        //       }
        //     ],
        //     "showNote": false,
        //     "note": "Note: The answer shown above is the primary correct answer specified by the author for this item, but other answers may also be recognized as correct.",
        //     "env": {
        //       "mode": "evaluate"
        //     }
        //   },
        //   "correctness": {
        //     "correctness": "incorrect",
        //     "score": "0%",
        //     "correct": false
        //   },
        //   "disabled": true,
        //   "view": false,
        //   "correctResponse": {},
        //   "rationale": null,
        //   "teacherInstructions": null
        // };

        if (this._model && this._session) {
            const el = React.createElement(Main, {
        model: this._model,
                session: this._session,
                onSessionChange: this.onSessionChange.bind(this),
            });

            ReactDOM.render(el, this);
        }
    }
}
