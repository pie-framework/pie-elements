import { shallow } from 'enzyme';
import React from 'react';

import { Choices } from '../index';

describe('choices', () => {
  let onChange;
  let onConfigChange;
  let onAdd;
  let onDelete;

  beforeEach(() => {
    onChange = jest.fn();
    onConfigChange = jest.fn();
    onAdd = jest.fn();
    onDelete = jest.fn();
  });

  const wrapper = extras => {
    const props = {
      onChange,
      onConfigChange,
      onAdd,
      onDelete,
      classes: {},
      choices: [{ id: '1', content: 'content' }],
      config: {
        columns: 2
      },
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
    describe('toggleRemoveAllTiles', () => {
      it('adds categoryCount as 1 to choices if it was undefined', () => {
        w = wrapper();
        w.instance().toggleRemoveAllTiles();
        expect(onChange).toBeCalledWith([
          { id: '1', content: 'content', categoryCount: 1 }
        ]);
      });

      it('sets categoryCount to 1 in every choice if it was 0', () => {
        w = wrapper({
          choices: [{ id: '1', content: 'content', categoryCount: 0 }]
        });
        w.instance().toggleRemoveAllTiles();
        expect(onChange).toBeCalledWith([
          { id: '1', content: 'content', categoryCount: 1 }
        ]);
      });

      it('sets categoryCount to 0 in every choice if it was 1', () => {
        w = wrapper({
          choices: [{ id: '1', content: 'content', categoryCount: 1 }]
        });
        w.instance().toggleRemoveAllTiles();
        expect(onChange).toBeCalledWith([
          { id: '1', content: 'content', categoryCount: 0 }
        ]);
      });
    });

    describe('changeChoice', () => {
      it('calls onChange with updated choice', () => {
        w = wrapper();
        w.instance().changeChoice({ id: '1', content: 'update' });
        expect(onChange).toBeCalledWith([{ id: '1', content: 'update' }]);
      });
    });

    describe('allChoicesHaveCount', () => {
      it('returns false if all choices dont have count 1', () => {
        w = wrapper();
        expect(w.instance().allChoicesHaveCount(1)).toEqual(false);
      });

      it('returns true if all choices have count 1', () => {
        w = wrapper({ choices: [{ id: '1', categoryCount: 1 }] });
        expect(w.instance().allChoicesHaveCount(1)).toEqual(true);
      });

      it('returns false if some choices have count 1', () => {
        w = wrapper({ choices: [{ id: '0' }, { id: '1', categoryCount: 1 }] });
        expect(w.instance().allChoicesHaveCount(1)).toEqual(false);
      });
    });
  });
});
