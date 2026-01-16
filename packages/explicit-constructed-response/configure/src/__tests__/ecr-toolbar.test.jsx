import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ECRToolbar } from '../ecr-toolbar';

jest.mock('@pie-lib/editable-html', () => ({
  __esModule: true,
  default: ({ markup, onChange }) => (
    <div data-testid="editable-html" onClick={() => onChange && onChange('test')}>
      {markup}
    </div>
  ),
}));

const theme = createTheme();

describe('ECRToolbar', () => {
  let onChangeResponse = jest.fn();
  let onToolbarDone = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderToolbar = () => {
    const defaults = {
      onChangeResponse,
      onToolbarDone,
      classes: {},
      node: {
        key: 1,
        data: {
          get: (prop) => {
            if (prop === 'index') {
              return '2';
            }

            return 'moon';
          },
          toJSON: jest.fn(),
        },
      },
      value: {
        change: jest.fn().mockReturnValue({
          setNodeByKey: jest.fn().mockReturnValue({
            moveFocusTo: jest.fn().mockReturnValue({
              moveAnchorTo: jest.fn(),
            }),
          }),
        }),
        document: {
          getNextText: jest.fn().mockReturnValue({
            key: 1,
          }),
        },
      },
      correctChoice: { value: '0', label: 'moon' },
    };
    const props = { ...defaults };

    return render(
      <ThemeProvider theme={theme}>
        <ECRToolbar {...props} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('onDone: calls onToolbarDone and onChangeResponse', () => {
      // Create an instance to test the internal method
      const testInstance = new ECRToolbar({
        onChangeResponse,
        onToolbarDone,
        classes: {},
        node: {
          key: 1,
          data: {
            get: (prop) => {
              if (prop === 'index') {
                return '2';
              }
              return 'moon';
            },
            toJSON: jest.fn(),
          },
        },
        value: {
          change: jest.fn().mockReturnValue({
            setNodeByKey: jest.fn().mockReturnValue({
              moveFocusTo: jest.fn().mockReturnValue({
                moveAnchorTo: jest.fn(),
              }),
            }),
          }),
          document: {
            getNextText: jest.fn().mockReturnValue({
              key: 1,
            }),
          },
        },
        correctChoice: { value: '0', label: 'moon' },
      });

      testInstance.onDone();

      expect(onToolbarDone).toBeCalled();
      expect(onChangeResponse).toBeCalled();
    });

    it('onRespAreaChange updates state', () => {
      const testInstance = new ECRToolbar({
        onChangeResponse,
        onToolbarDone,
        classes: {},
        node: {
          key: 1,
          data: {
            get: (prop) => {
              if (prop === 'index') {
                return '2';
              }
              return 'moon';
            },
            toJSON: jest.fn(),
          },
        },
        value: {
          change: jest.fn().mockReturnValue({
            setNodeByKey: jest.fn().mockReturnValue({
              moveFocusTo: jest.fn().mockReturnValue({
                moveAnchorTo: jest.fn(),
              }),
            }),
          }),
          document: {
            getNextText: jest.fn().mockReturnValue({
              key: 1,
            }),
          },
        },
        correctChoice: { value: '0', label: 'moon' },
      });

      // Spy on setState to verify it's called with the right value
      const setStateSpy = jest.spyOn(testInstance, 'setState');

      testInstance.onRespAreaChange('test');

      expect(setStateSpy).toHaveBeenCalledWith({ respAreaMarkup: 'test' });
    });
  });
});
