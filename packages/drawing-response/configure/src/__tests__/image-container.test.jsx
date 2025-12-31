import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ImageContainer } from '../image-container';

jest.mock('@pie-lib/config-ui', () => ({
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
}));

const theme = createTheme();

describe('ImageContainer', () => {
  const onUpdateImageDimension = jest.fn();
  const onImageUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderImageContainer = (props = {}) => {
    const defaultProps = {
      imageUrl: 'url',
      onUpdateImageDimension,
      onImageUpload,
      ...props,
    };
    return render(
      <ThemeProvider theme={theme}>
        <ImageContainer {...defaultProps} />
      </ThemeProvider>
    );
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderImageContainer();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let oldFileReader;
    let dummyFileReader;

    beforeAll(() => {
      oldFileReader = window.FileReader;
      dummyFileReader = {};

      dummyFileReader.readAsDataURL = (result) => {
        dummyFileReader.result = result;
        dummyFileReader.onloadend();
      };
      window.FileReader = jest.fn(() => dummyFileReader);
    });

    afterAll(() => {
      window.FileReader = oldFileReader;
    });

    it('handleFileRead calls onImageUpload', () => {
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      testInstance.handleFileRead('file');

      expect(onImageUpload).toBeCalled();
      expect(onImageUpload).toHaveBeenCalledTimes(1);
    });

    it('handleUploadImage calls handleFileRead which calls onImageUpload', () => {
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      testInstance.handleUploadImage({ target: { files: ['file'] }, preventDefault: jest.fn() });

      expect(onImageUpload).toBeCalled();
      expect(onImageUpload).toHaveBeenCalledTimes(1);
    });

    it('handleOnDrop calls handleFileRead which calls onImageUpload if item is file and image', () => {
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      testInstance.handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [
            {
              kind: 'file',
              getAsFile: jest.fn().mockReturnValue({ type: 'image', key: 'item' }),
            },
          ],
          files: [],
        },
      });

      expect(onImageUpload).toBeCalledWith({ type: 'image', key: 'item' });
      expect(onImageUpload).toHaveBeenCalledTimes(1);
    });

    it("handleOnDrop calls handleFileRead which doesn't call onImageUpload if item is file but not image", () => {
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      testInstance.handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [
            {
              kind: 'file',
              getAsFile: jest.fn().mockReturnValue({ type: 'jpg' }),
            },
          ],
          files: [],
        },
      });

      // Should not be called since 'jpg' doesn't start with 'image'
      expect(onImageUpload).not.toHaveBeenCalled();
    });

    it('handleOnDrop calls handleFileRead which calls onImageUpload if item is not file, but file is image', () => {
      jest.clearAllMocks();
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      testInstance.handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [
            {
              kind: 'something else',
              getAsFile: jest.fn().mockReturnValue({ type: 'image' }),
            },
          ],
          files: [{ type: 'image', key: 'file' }],
        },
      });

      expect(onImageUpload).toBeCalledWith({ type: 'image', key: 'file' });
      expect(onImageUpload).toHaveBeenCalledTimes(1);
    });

    it("handleOnDrop calls handleFileRead which doesn't call onImageUpload if item is not file and file is not image", () => {
      jest.clearAllMocks();
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      testInstance.handleOnDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [
            {
              kind: 'something else',
              getAsFile: jest.fn().mockReturnValue({ type: 'image' }),
            },
          ],
          files: [{ type: 'something else', key: 'file' }],
        },
      });

      // Should not be called since file type is 'something else', not 'image'
      expect(onImageUpload).not.toHaveBeenCalled();
    });

    it('handleOnImageLoad calls onUpdateImageDimension', () => {
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      testInstance.handleOnImageLoad({
        target: { offsetHeight: 50, offsetWidth: 50, naturalWidth: 50, naturalHeight: 50 },
      });

      expect(onUpdateImageDimension).toHaveBeenCalledWith({
        height: 50,
        width: 50,
      });
    });

    it('stopResizing calls onUpdateImageDimension with state dimensions', () => {
      jest.clearAllMocks();
      const testInstance = new ImageContainer({ imageUrl: 'url', onUpdateImageDimension, onImageUpload });
      testInstance.resize = { addEventListener: jest.fn() };

      // Set state dimensions directly
      testInstance.state = { ...testInstance.state, dimensions: { height: 75, width: 100 } };

      // Call stopResizing which should use the dimensions from state
      testInstance.stopResizing();

      expect(onUpdateImageDimension).toHaveBeenCalledWith({
        height: 75,
        width: 100,
      });
    });
  });
});
