import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import ImageClozeAssociation from '../index';
import { ImageClozeAssociationComponent } from '../root';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
jest.spyOn(ReactDOM, 'render').mockImplementation(() => {});

describe('image-cloze-association', () => {
  describe('renders', () => {
    let wrapper = (props) => {
      let defaultProps = {
        model: { ...props },
        session: {},
        classes: {},
      };

      return shallow(<ImageClozeAssociationComponent {...defaultProps} />);
    };

    it('snapshot', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('snapshot with rationale', () => {
      const w = wrapper({ rationale: 'This is rationale' });
      expect(w).toMatchSnapshot();
    });

    it('snapshot with teacherInstructions', () => {
      const w = wrapper({ teacherInstructions: 'These are teacher instructions' });
      expect(w).toMatchSnapshot();
    });
  });

  describe('events', () => {
    describe('model', () => {
      it('dispatches model set event', () => {
        const el = new ImageClozeAssociation();
        el.tagName = 'ica-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('ica-el', false, true));
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
