import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ECRToolbar } from '../ecr-toolbar';

jest.mock('@pie-lib/editable-html-tip-tap', () => ({
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
  let editor;

  beforeEach(() => {
    jest.clearAllMocks();
    editor = {
      commands: {
        updateAttributes: jest.fn()
      },
      state: {
        selection: {
          from: 0,
        },
        tr: {
          setNodeMarkup: jest.fn(),
        },
      },
      view: {
        dispatch: jest.fn(),
        nodeDOM: jest.fn().mockReturnValue({
          nodeType: 1,
          getBoundingClientRect: jest.fn().mockReturnValue({
            top: 100,
            left: 50,
            width: 200,
            height: 30,
          }),
          closest: jest.fn().mockReturnValue({
            getBoundingClientRect: jest.fn().mockReturnValue({
              top: 0,
              left: 0,
            }),
          }),
        }),
      },
    };
  });

  const renderToolbar = () => {
    const defaults = {
      onChangeResponse,
      onToolbarDone,
      classes: {},
      node: {
        key: 1,
        attrs: {
          index: '2',
          value: 'moon',
        },
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
      pos: 5,
      editor,
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
      const mockTr = {
        setNodeMarkup: jest.fn(),
      };
      const testEditor = {
        ...editor,
        state: {
          ...editor.state,
          tr: mockTr,
        },
      };
      const testInstance = new ECRToolbar({
        onChangeResponse,
        onToolbarDone,
        classes: {},
        node: {
          key: 1,
          attrs: {
            index: '2',
            value: 'moon',
          },
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
        pos: 5,
        editor: testEditor,
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

      testInstance.onDone('test markup');

      expect(mockTr.setNodeMarkup).toHaveBeenCalledWith(5, undefined, {
        index: '2',
        value: 'test markup',
      });
      expect(testEditor.view.dispatch).toHaveBeenCalledWith(mockTr);
      expect(onToolbarDone).toHaveBeenCalledWith(true);
      expect(onChangeResponse).toHaveBeenCalledWith('test markup');
    });

    it('onRespAreaChange updates state', () => {
      const testInstance = new ECRToolbar({
        onChangeResponse,
        onToolbarDone,
        classes: {},
        node: {
          key: 1,
          attrs: {
            index: '2',
            value: 'moon',
          },
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
        pos: 5,
        editor,
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
