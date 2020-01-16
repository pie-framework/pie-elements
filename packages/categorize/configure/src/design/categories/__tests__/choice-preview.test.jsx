import { shallow } from 'enzyme';
import React from 'react';
import { ChoicePreview } from '../choice-preview';
jest.mock('@pie-lib/render-ui', () => ({
  renderMath: jest.fn(),
  HtmlAndMath: props => <div>{props.html}</div>
}));

describe('ChoicePreview', () => {
  let w;
  let onDelete = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      choice: {
        content: 'content',
        id: '1'
      },
      onDelete
    };
    const props = { ...defaults, ...extras };
    return shallow(<ChoicePreview {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    describe('delete', () => {
      it('calls onDelete', () => {
        w = wrapper();
        w.instance().delete();
        expect(onDelete).toBeCalledWith({ content: 'content', id: '1' });
      });
    });
  });
});
