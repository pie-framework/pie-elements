import { shallow } from 'enzyme';
import React from 'react';
import { Design } from '../index';
import util from 'util';

const model = extras => ({
  choices: [{ id: '1', content: 'content' }],
  correctResponse: [{ category: '1', choices: ['1'] }],
  categories: [{ id: '1', label: 'Category Title' }],
  ...extras
});

describe('Design', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: { design: 'design', text: 'text' },
      className: 'className',
      onChange,
      model: model(),
      uid: '1'
    };
    const props = { ...defaults, ...extras };

    return shallow(<Design {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    beforeEach(() => {
      w = wrapper();
    });

    const callsOnChange = function() {
      let args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === 'string') {
        args = [wrapper()].concat(args);
      }
      const er = args[0];
      const method = args[1];
      const expected = args[args.length - 1];
      const fnArgs = args.splice(2, args.length - 3);
      const argString = fnArgs
        .map(o => util.inspect(o, { colors: true }))
        .join(', ');
      it(`${method}(${argString}) calls onChange with ${util.inspect(expected, {
        colors: true
      })}`, () => {
        onChange.mockReset();
        er.instance()[method].apply(w.instance(), fnArgs);

        expect(onChange).toBeCalledWith(expect.objectContaining(expected));
      });
    };

    describe('changeCategoryColumns', () => {
      const config = { config: { categories: { columns: 4 } } };
      callsOnChange('changeCategoryColumns', { target: { value: 4 } }, config);
    });

    describe('changeCategories', () => {
      callsOnChange('changeCategories', [{ id: '10' }], {
        categories: [{ id: '10' }]
      });
    });

    describe('changeChoices', () => {
      describe('with multiple choices in correctResponse', () => {
        const extras = {
          model: {
            ...model(),
            choices: [{ id: '10', categoryCount: 0 }],
            correctResponse: [{ category: '1', choices: ['10', '10'] }]
          }
        };
        callsOnChange(
          wrapper(extras),
          'changeChoices',
          [{ id: '10', categoryCount: 1 }],
          {
            choices: [{ id: '10', categoryCount: 1 }],
            categories: [{ id: '1', label: 'Category Title' }],
            correctResponse: [{ category: '1', choices: ['10'] }]
          }
        );
      });
    });

    describe('deleteChoice', () => {
      callsOnChange('deleteChoice', { id: '1' }, { choices: [] });
    });

    describe('addChoice', () => {
      callsOnChange(wrapper(), 'addChoice', {
        choices: [
          { id: '1', content: 'content', categoryCount: undefined },
          { id: '1', content: 'Choice 1', categoryCount: undefined }
        ]
      });
    });

    describe('deleteCategory', () => {
      callsOnChange('deleteCategory', { id: '1' }, { categories: [] });
    });

    describe('addCategory', () => {
      callsOnChange(
        wrapper({ model: { ...model(), categories: [] } }),
        'addCategory',
        {
          categories: [{ id: '1', label: 'Category 1' }]
        }
      );
    });

    describe('addChoiceToCategory', () => {
      callsOnChange('addChoiceToCategory', { id: '2', content: 'foo' }, '1', {
        correctResponse: [{ category: '1', choices: ['1', '2'] }]
      });
    });

    describe('deleteChoiceFromCategory', () => {
      callsOnChange('deleteChoiceFromCategory', { id: '1' }, { id: '1' }, 0, {
        correctResponse: [{ category: '1', choices: [] }]
      });
    });

    describe('changeChoicesConfig', () => {
      callsOnChange(
        'changeChoicesConfig',
        { columns: 10 },
        { config: { choices: { columns: 10 } } }
      );
    });

    describe('countInCorrectResponse', () => {
      it('counts', () => {
        let w = wrapper();
        const result = w.instance().countChoiceInCorrectResponse({ id: '1' });
        expect(result).toEqual(1);
      });
    });
  });
});
