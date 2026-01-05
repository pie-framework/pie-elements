import * as React from 'react';
import { render } from '@testing-library/react';
import { ChoicesList } from '../choices-list';
import { model } from '../../docs/demo/config';

jest.mock('../answer', () => (props) => <div data-testid="drag-drop-answer" {...props} />);
jest.mock('@pie-lib/drag', () => ({
  MatchDroppablePlaceholder: (props) => <div data-testid="match-droppable-placeholder">{props.children}</div>,
}));

describe('ChoicesList', () => {
  const defaultProps = {
    model: model('1'),
    session: {},
    classes: {},
    instanceId: '1',
    disabled: false,
  };

  const wrapper = (props = {}) => {
    return render(<ChoicesList {...defaultProps} {...props} />);
  };

  describe('render', () => {
    it('renders correctly', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });
  });
});
