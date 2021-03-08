import React from 'react';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import MultipleChoice from '@pie-elements/multiple-choice';
import { isSessionComplete } from '..';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
jest.mock('@pie-elements/multiple-choice', () => jest.fn());

const PART_A = 'partA';
const PART_B = 'partB';

const defaultModel = {
  disabled: false,
  mode: 'gather',
  partA: {
    choiceMode: 'radio',
    choices: [
      { value: 'a', label: 'label a' },
      { value: 'b', label: 'label b' },
      { value: 'c', label: 'label c', correct: true, feedback: 'great' }
    ],
    choicePrefix: 'numbers',
    prompt: `prompt ${PART_A}`
  },
  partB: {
    choiceMode: 'radio',
    choices: [
      { value: 'd', label: 'label d', correct: true, feedback: 'great' },
      { value: 'e', label: 'label e' },
      { value: 'f', label: 'label f' }
    ],
    choicePrefix: 'numbers',
    prompt: `prompt ${PART_B}`
  }
};

const defaultSession = { id: 1 };

describe('ebsr', () => {
  let Def;
  let el;
  let ebsr;

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.connectedCallback();
    ebsr = {
      partA: new HTMLElement(),
      partB: new HTMLElement()
    };
    el.querySelector = jest.fn(s => {
      if (s === '#part-a') {
        return ebsr.partA;
      } else {
        return ebsr.partB;
      }
    });
    el.tagName = 'ebsr-element';
    el.model = defaultModel;
    el.session = defaultSession;
  });

  describe('model', () => {
    it('should have set the model', () => {
      expect(el._model).toEqual(defaultModel);
    });
  });

  describe('session', () => {
    const dispatchesSessionEvent = (key, value) => {
      it(`${key} dispatches session changed event`, () => {
        const session = { id: key, value };
        el.dispatchSessionChanged(session, key);

        expect(el.dispatchEvent).toBeCalledWith(
          new SessionChangedEvent('ebsr-element', false)
        );
        expect(el._session.value[key]).toEqual(session);
      });
    };

    it('should have set the session', () => {
      expect(el._session).toEqual(defaultSession);
    });

    describe('changeAnswers', () => {
      dispatchesSessionEvent(PART_A, 'a');
      dispatchesSessionEvent(PART_B, 'd');
    });
  });

  describe('setPartSession', () => {
    it('sets the session object even if missing from session.value', () => {
      const part = {};
      el.model = {};
      el.session = {
        value: {}
      };
      el.setPartSession(part, 'partA');
      expect(part.session).toEqual({ id: 'partA' });
    });
  });
});

describe('isSessionComplete', () => {
  const assertComplete = (s, expected) => {
    it(`${JSON.stringify(s)} => ${expected}`, () => {
      const result = isSessionComplete(s);
      expect(result).toEqual(expected);
    });
  };

  assertComplete({}, false);
  assertComplete(
    { value: { partA: { value: [1] }, partB: { value: [2] } } },
    true
  );
});
