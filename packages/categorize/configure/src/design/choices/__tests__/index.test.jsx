import { shallow } from 'enzyme';
import React from 'react';

import { Choices } from '../index';
import defaults from '../../../defaults';

describe('choices', () => {
  let onModelChanged = jest.fn();
  let model = defaults.model;
  let onConfigChange;
  let onAdd;
  let onDelete;

  beforeEach(() => {
    onConfigChange = jest.fn();
    onAdd = jest.fn();
    onDelete = jest.fn();
  });

  const wrapper = extras => {
    const props = {
      onModelChanged,
      model,
      classes: {},
      choices: [{ id: '0', content: 'Choice 0' }],
      ...extras
    };
    return shallow(<Choices {...props} />);
  };

  let w;
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('changeChoice', () => {
      it('calls onModelChanged with updated choice', () => {
        w = wrapper();
        w.instance().changeChoice({ id: '0', content: 'update' });
        expect(onModelChanged).toBeCalledWith({ choices: [{ id: '0', content: 'update' }] });
      });
    });

    describe('allChoicesHaveCount', () => {
      it('returns false if all choices dont have count 1', () => {
        w = wrapper();
        expect(w.instance().allChoicesHaveCount(1)).toEqual(false);
      });

      it('returns true if all choices have count 1', () => {
        w = wrapper({ choices: [{ id: '0', categoryCount: 1 }] });
        expect(w.instance().allChoicesHaveCount(1)).toEqual(true);
      });

      it('returns false if some choices have count 1', () => {
        w = wrapper({ choices: [{ id: '0' }, { id: '1', categoryCount: 1 }] });
        expect(w.instance().allChoicesHaveCount(1)).toEqual(false);
      });
    });

    describe('addChoice', () => {
      w = wrapper();
      w.instance().addChoice();

      expect(onModelChanged).toBeCalledWith({ choices: [{ id: '0', content: 'Choice 0' }, { id: '1', content: 'Choice 1' }] });
    });

    describe('deleteChoice', () => {
      w = wrapper();
      w.instance().deleteChoice({ id: '0' });

      expect(onModelChanged).toBeCalledWith(expect.objectContaining({
        choices: [],
        correctResponse: []
      }));
    });
  });
});
