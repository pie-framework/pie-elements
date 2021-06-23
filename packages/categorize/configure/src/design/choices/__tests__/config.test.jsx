import { shallow } from 'enzyme';
import React from 'react';

import { Config } from '../config';


describe('config', () => {
  let onModelChanged;
  let allChoicesHaveCount;
  let config;

  beforeEach(() => {
    onModelChanged = jest.fn();
    allChoicesHaveCount = jest.fn();
    config = {
      choices: [
        {
          id: '0',
          content: 'Choice 0'
        },
      ],
      choicesPosition: 'below',
      choicesLabel: '',
      lockChoiceOrder: true,
      removeTilesAfterPlacing: false,
      categoriesPerRow: 2,
      categories: [
        {
          id: '0',
          label: 'Category 0',
          choices: []
        },
      ],
      rowLabels: [''],
      correctResponse: [],
      partialScoring: true,
    };
  });
  const wrapper = extras => {
    const props = { classes: {}, onModelChanged, allChoicesHaveCount, config, ...extras };
    return shallow(<Config {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('toggleRemoveAllTiles', () => {
      let w;

      it('adds categoryCount as 1 to choices if it was undefined', () => {
        w = wrapper();
        w.instance().toggleRemoveAllTiles();
        expect(onModelChanged).toBeCalledWith({ choices: [
          { id: '0', content: 'Choice 0', categoryCount: 1 }]});
      });

      it('sets categoryCount to 1 in every choice if it was 0', () => {
        w = wrapper({
          choices: [{ id: '0', content: 'Choice 0', categoryCount: 0 }]
        });
        w.instance().toggleRemoveAllTiles();
        expect(onModelChanged).toBeCalledWith({ choices: [
            { id: '0', content: 'Choice 0', categoryCount: 1 }]});
      });

      it('sets categoryCount to 0 in every choice if it was 1', () => {
        w = wrapper({
          choices: [{ id: '0', content: 'Choice 0', categoryCount: 1 }]
        });
        w.setProps({ allChoicesHaveCount: () => true });
        w.instance().toggleRemoveAllTiles();
        expect(onModelChanged).toBeCalledWith({ choices: [
            { id: '0', content: 'Choice 0', categoryCount: 0 }
          ]});
      });
    });

    it('changeLabel', () => {
      let w = wrapper();

      w.instance().changeLabel({ target: { value: 'foo' } });

      expect(onModelChanged).toBeCalledWith({
        choicesLabel: 'foo'
      });
    });

    it('toggleShuffle', () => {
      let w = wrapper();

      w.instance().toggleShuffle();

      expect(onModelChanged).toBeCalledWith({
        lockChoiceOrder: false
      });
    });

    it('changePosition', () => {
      let w = wrapper();

      w.instance().changePosition({ value: 'below' });

      expect(onModelChanged).toBeCalledWith({
        choicesPosition: 'below'
      });
    });

  });
});
