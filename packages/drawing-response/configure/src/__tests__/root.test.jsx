import { shallow } from 'enzyme';
import React from 'react';

import { Root } from '../root';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn()
  },
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  }
}));

const model = {
  prompt: 'Test Prompt',
  promptEnabled: true,
  imageUrl: '',
  imageDimensions: {
    height: 100,
    width: 100
  }
};

describe('Root', () => {
  const onConfigurationChanged = jest.fn();
  const onModelChanged = jest.fn();
  let wrapper;

  beforeEach(() => {
    const props = {
      classes: {},
      model,
      configuration: defaults.configuration,
      onConfigurationChanged,
      onModelChanged,
    };
    wrapper = () => shallow(<Root {...props} />);
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeAll(() => {
      w = wrapper();
    });

    it('onPromptChanged calls onModelChanged', () => {
      w.instance().onPromptChanged('New Prompt');

      expect(onModelChanged).toHaveBeenCalledWith(
          expect.objectContaining({ prompt: 'New Prompt' }))
    });

    it('onTeacherInstructionsChanged calls onModelChanged', () => {
      w.instance().onTeacherInstructionsChanged('New Teacher Instructions');

      expect(onModelChanged).toHaveBeenCalledWith(
          expect.objectContaining({ teacherInstructions: 'New Teacher Instructions' }))
    });

    it('onUpdateImageDimension calls onModelChanged', () => {
      w.instance().onUpdateImageDimension({
        height: 200,
        width: 200
      });

      expect(onModelChanged).toHaveBeenCalledWith(
          expect.objectContaining({ imageDimensions: {
              height: 200,
              width: 200
            }
          }))
    });

    it('onImageUpload calls onModelChanged', () => {
      w.instance().onImageUpload('url');

      expect(onModelChanged).toHaveBeenCalledWith(
          expect.objectContaining({ imageUrl: 'url' }))
    });
  });
});

