import { shallow } from 'enzyme';
import React from 'react';

import { ImageContainer } from '../image-container';

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

describe('ImageContainer', () => {
  const onUpdateImageDimension = jest.fn();
  const onImageUpload = jest.fn();
  let wrapper;

  beforeEach(() => {
    const props = {
      classes: {},
      imageUrl: 'url',
      onUpdateImageDimension,
      onImageUpload
    };
    wrapper = () => shallow(<ImageContainer {...props} />);
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;
    let oldFileReader;

    beforeAll(() => {
      const dummyFileReader = {};

      w = wrapper();
      w.instance().resize = { addEventListener: jest.fn() };

      oldFileReader = window.FileReader;

      dummyFileReader.readAsDataURL = (result) => {
        dummyFileReader.result = result;
        dummyFileReader.onloadend();
      };
      window.FileReader = jest.fn(() => dummyFileReader);
    });

    it('handleFileRead calls onImageUpload', () => {
      w.instance().handleFileRead('file');

      expect(onImageUpload).toBeCalled();
      expect(onImageUpload).toHaveBeenCalledTimes(1);
    });

    it('handleUploadImage calls handleFileRead which calls onImageUpload', () => {
      w.instance().handleUploadImage({ target: { files: ['file'] }, preventDefault: jest.fn() });

      expect(onImageUpload).toBeCalled();
      expect(onImageUpload).toHaveBeenCalledTimes(2);
    });

    it('handleOnDrop calls handleFileRead which calls onImageUpload if item is file and image', () => {
      w.instance().handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [{
            kind: 'file',
            getAsFile: jest.fn().mockReturnValue({ type: 'image', key: 'item' })
          }
          ],
          files: []
        }
      });

      expect(onImageUpload).toBeCalledWith({ type: 'image', key: 'item' });
      expect(onImageUpload).toHaveBeenCalledTimes(3);
    });

    it('handleOnDrop calls handleFileRead which doesn\'t call onImageUpload if item is file but not image', () => {
      w.instance().handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [{
            kind: 'file',
            getAsFile: jest.fn().mockReturnValue({ type: 'jpg' })
          }
          ],
          files: []
        }
      });

      // same times number as in previous test, meaning that is was not called again
      expect(onImageUpload).toHaveBeenCalledTimes(3);
    });

    it('handleOnDrop calls handleFileRead which calls onImageUpload if item is not file, but file is image', () => {
      w.instance().handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [{
            kind: 'something else',
            getAsFile: jest.fn().mockReturnValue({ type: 'image' })
          }
          ],
          files: [{ type: 'image', key: 'file' }]
        }
      });

      expect(onImageUpload).toBeCalledWith({ type: 'image', key: 'file' });
      expect(onImageUpload).toHaveBeenCalledTimes(4);
    });

    it('handleOnDrop calls handleFileRead which doesn\'t call onImageUpload if item is not file and file is not image', () => {
      w.instance().handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [{
            kind: 'something else',
            getAsFile: jest.fn().mockReturnValue({ type: 'image' })
          }
          ],
          files: [{ type: 'something else', key: 'file' }]
        }
      });

      // same times number as in previous test, meaning that is was not called again
      expect(onImageUpload).toHaveBeenCalledTimes(4);
    });

    it('handleOnImageLoad calls onUpdateImageDimension', () => {
      w.instance().handleOnImageLoad({ target: { offsetHeight: 50, offsetWidth: 50 }});

      expect(onUpdateImageDimension).toHaveBeenCalledWith({
        height: 50,
        width: 50
      });
    });

    it('stopResizing calls onUpdateImageDimension', () => {
      w.instance().handleOnImageLoad({ target: { offsetHeight: 50, offsetWidth: 50 }});

      expect(onUpdateImageDimension).toHaveBeenCalledWith(w.instance().state.dimensions);
    });

    afterAll(() => {
      window.FileReader = oldFileReader;
    });
  });
});

