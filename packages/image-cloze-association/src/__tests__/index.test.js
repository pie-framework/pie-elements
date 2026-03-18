import React from 'react';
import { render } from '@testing-library/react';
import { createRoot } from 'react-dom/client';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import { ImageClozeAssociationComponent } from '../root';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));

jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div>{children}</div>,
  useDraggable: () => ({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
  }),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div>{children}</div>,
  ICADroppablePlaceholder: ({ children }) => <div>{children}</div>,
}));

const mockRender = jest.fn();
const mockUnmount = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
  unmount: mockUnmount,
}));

jest.mock('react-dom/client', () => ({
  createRoot: (...args) => mockCreateRoot(...args),
}));

jest.mock('../index', () => {
  const { ModelSetEvent, SessionChangedEvent } = require('@pie-framework/pie-player-events');

  class MockHTMLElement {
    constructor() {
      this._root = null;
      this._model = null;
      this._session = null;
      this.dispatchEvent = jest.fn();
      this.audioComplete = false;
      this.tagName = 'image-cloze-association';
    }

    querySelector() {
      return null;
    }
  }

  return {
    __esModule: true,
    default: class ImageClozeAssociation extends MockHTMLElement {
      constructor() {
        super();
      }

      set model(m) {
        this._model = m;
        this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this.isComplete(), !!this._model));
        this._render();
      }

      set session(s) {
        this._session = s;
        this._render();
      }

      updateAnswer = (answers) => {
        this._session = { ...this._session, answers };
        this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete()));
      };

      isComplete() {
        const { responseAreasToBeFilled } = this._model || {};
        if (!this._session || !this._session.answers) {
          return false;
        }
        const { answers } = this._session;
        if (!Array.isArray(answers)) {
          return false;
        }
        const filledResponseAreas = [...new Map(answers.map((item) => [item.containerIndex, item])).values()].length;
        return filledResponseAreas >= responseAreasToBeFilled;
      }

      _render() {
        if (!this._root) {
          this._root = mockCreateRoot(global.document.createElement('div'));
        }
        this._root.render(null);
      }
    },
  };
});

const ImageClozeAssociation = require('../index').default;

describe('image-cloze-association', () => {
  beforeEach(() => {
    mockRender.mockClear();
    mockCreateRoot.mockClear();
  });

  describe('events', () => {
    describe('model', () => {
      it('dispatches model set event', () => {
        const el = new ImageClozeAssociation();
        el.tagName = 'ica-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('ica-el', false, true));
      });

      it('calls render', () => {
        const el = new ImageClozeAssociation();
        el.model = {};
        const rootInstance = mockCreateRoot.mock.results[0].value;
        expect(rootInstance.render).toHaveBeenCalled();
      });
    });

    describe('updateAnswer', () => {
      it('dispatches session changed event - add answer', () => {
        const el = new ImageClozeAssociation();
        el.tagName = 'ica-el';
        el.model = {
          responseAreasToBeFilled: 1,
        };
        el.session = { answers: [] };
        el.updateAnswer([{ id: '1', containerIndex: 0, value: '' }]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ica-el', true));
      });

      it('dispatches session changed event - remove answer', () => {
        const el = new ImageClozeAssociation();
        el.tagName = 'ica-el';
        el.model = {
          responseAreasToBeFilled: 1,
        };
        el.session = { answers: [{ id: '1', containerIndex: 0, value: '' }] };
        el.updateAnswer([]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ica-el', false));
      });

      it('dispatches session changed event - add/remove answer', () => {
        const el = new ImageClozeAssociation();
        el.tagName = 'ica-el';
        el.model = {
          responseAreasToBeFilled: 2,
        };
        el.session = { answers: [] };
        el.updateAnswer([{ id: '1', containerIndex: 0, value: '' }]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ica-el', false));

        el.updateAnswer([
          { id: '1', containerIndex: 0, value: '' },
          { id: '2', containerIndex: 1, value: '' },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ica-el', true));

        el.updateAnswer([{ id: '2', containerIndex: 1, value: '' }]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ica-el', false));

        el.updateAnswer([]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('ica-el', false));
      });
    });
  });
});
