import React from 'react';
import { render } from '@testing-library/react';
import StimulusTabs from '../stimulus-tabs';

const props = {
  tabs: [
    {
      id: 1,
      label: 'Tab One',
      title: 'one',
      text: 'text for one',
    },
    {
      id: 2,
      label: 'Tab Two',
      title: 'two',
      text: 'text for two',
    },
  ],
};

describe('stimulus tabs', () => {
  describe('snapshot', () => {
    it('should render component', () => {
      const { container } = render(<StimulusTabs tabs={props.tabs} />);
      expect(container).toMatchSnapshot();
    });
  });
});
