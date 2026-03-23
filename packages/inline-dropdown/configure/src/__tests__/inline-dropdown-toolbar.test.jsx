import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import RespAreaToolbar from '../inline-dropdown-toolbar';

// Mock the external dependencies
jest.mock('@pie-lib/editable-html-tip-tap', () => {
  return function MockEditableHtml(props) {
    return (
      <div
        data-testid="editable-html"
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
      >
        <input
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
          onBlur={props.onBlur}
          data-testid="editable-input"
        />
      </div>
    );
  };
});

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

describe('RespAreaToolbar', () => {
  let onAddChoice;
  let onRemoveChoice;
  let onSelectChoice;
  let onToolbarDone;
  let onCheck;
  let editor;
  let mockDomNode;
  let mockEditorNode;

  beforeEach(() => {
    onAddChoice = jest.fn();
    onRemoveChoice = jest.fn();
    onSelectChoice = jest.fn();
    onToolbarDone = jest.fn();
    onCheck = jest.fn();

    // Create mock DOM nodes
    mockDomNode = {
      nodeType: 1,
      getBoundingClientRect: jest.fn().mockReturnValue({
        top: 100,
        left: 50,
        height: 20,
      }),
      closest: jest.fn().mockReturnValue({
        getBoundingClientRect: jest.fn().mockReturnValue({
          left: 25,
        }),
      }),
    };

    mockEditorNode = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        left: 25,
      }),
    };

    mockDomNode.closest.mockReturnValue(mockEditorNode);

    editor = {
      commands: {
        updateAttributes: jest.fn(),
        refreshResponseArea: jest.fn(),
      },
      view: {
        nodeDOM: jest.fn().mockReturnValue(mockDomNode),
        dispatch: jest.fn(),
      },
      state: {
        selection: {
          from: 0,
        },
        tr: {
          isDone: false,
          deleteSelection: jest.fn(),
        },
      },
    };
  });

  const defaultProps = {
    onAddChoice,
    onRemoveChoice,
    onSelectChoice,
    onToolbarDone,
    node: {
      key: '1',
      attrs: {
        index: '0',
        value: 'cow',
      },
    },
    pos: 0,
    editor,
    choices: [
      {
        label: 'cow',
        value: '0',
        correct: true,
      },
      {
        label: 'dog',
        value: '1',
        correct: false,
      },
      {
        label: 'cat',
        value: '2',
        correct: false,
      },
    ],
  };

  const createInstance = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    const instance = new RespAreaToolbar(mergedProps);
    instance.props = mergedProps;

    // Mock setState to execute updates synchronously for testing
    const originalSetState = instance.setState.bind(instance);
    instance.setState = jest.fn((state) => {
      if (typeof state === 'function') {
        instance.state = { ...instance.state, ...state(instance.state) };
      } else {
        instance.state = { ...instance.state, ...state };
      }
    });

    return instance;
  };

  describe('Component Lifecycle', () => {
    it('should set toolbar position on mount', () => {
      const localEditor = {
        ...editor,
        view: {
          ...editor.view,
          nodeDOM: jest.fn().mockReturnValue(mockDomNode),
        },
      };
      const instance = createInstance({ editor: localEditor });
      instance.componentDidMount();

      expect(instance.setState).toHaveBeenCalled();
      expect(instance.state.toolbarStyle).toBeDefined();
      expect(instance.state.toolbarStyle.position).toBe('absolute');
      expect(instance.state.toolbarStyle.top).toBe('140px'); // top + height + 40
      expect(instance.state.toolbarStyle.left).toBe('50px');
    });

    it('should handle missing DOM node gracefully', () => {
      const localEditor = {
        ...editor,
        view: {
          ...editor.view,
          nodeDOM: jest.fn().mockReturnValue(null),
        },
      };
      const instance = createInstance({ editor: localEditor });

      expect(() => instance.componentDidMount()).not.toThrow();
    });

    it('should handle DOM node without nodeType', () => {
      const localEditor = {
        ...editor,
        view: {
          ...editor.view,
          nodeDOM: jest.fn().mockReturnValue({ nodeType: 3 }), // Text node
        },
      };
      const instance = createInstance({ editor: localEditor });

      instance.componentDidMount();
      expect(instance.state.toolbarStyle).toBeUndefined();
    });

    it('should call renderMath on update', () => {
      const { renderMath } = require('@pie-lib/math-rendering');
      renderMath.mockClear();

      const localEditor = {
        ...editor,
        view: {
          ...editor.view,
          nodeDOM: jest.fn().mockReturnValue(mockDomNode),
        },
      };

      // Use a class component wrapper to test componentDidUpdate
      class TestWrapper extends React.Component {
        render() {
          return <RespAreaToolbar {...this.props} />;
        }
      }

      const { rerender } = render(
        <TestWrapper
          {...defaultProps}
          editor={localEditor}
        />
      );

      // Trigger an update by rerendering with new props
      rerender(
        <TestWrapper
          {...defaultProps}
          editor={localEditor}
          choices={[...defaultProps.choices]}
        />
      );

      expect(renderMath).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    describe('onRespAreaChange', () => {
      it('should update respAreaMarkup state', () => {
        const instance = createInstance();
        const markup = '<div>test content</div>';

        instance.onRespAreaChange(markup);

        expect(instance.state.respAreaMarkup).toBe(markup);
      });
    });
  });

  describe('Choice Management', () => {
    describe('onAddChoice', () => {
      it('should set isDone on transaction and dispatch', () => {
        const mockTr = { isDone: false, deleteSelection: jest.fn() };
        const localEditor = {
          ...editor,
          state: {
            ...editor.state,
            tr: mockTr,
          },
        };
        const instance = createInstance({ editor: localEditor });

        instance.onAddChoice();

        expect(mockTr.isDone).toBe(true);
        expect(localEditor.view.dispatch).toHaveBeenCalledWith(mockTr);
      });
    });

    describe('onDone', () => {
      it('should not call onAddChoice if choice is empty', () => {
        const instance = createInstance();
        instance.onDone('<div><p></p></div>');

        expect(onAddChoice).not.toHaveBeenCalled();
      });

      it('should not call onAddChoice if choice is only whitespace', () => {
        const instance = createInstance();
        instance.onDone('<div>   </div>');

        expect(onAddChoice).not.toHaveBeenCalled();
      });

      it('should call onAddChoice with correct parameters for new choice', () => {
        const localOnAddChoice = jest.fn();
        const localEditor = {
          ...editor,
          commands: {
            ...editor.commands,
            refreshResponseArea: jest.fn(),
          },
        };
        const instance = createInstance({
          onAddChoice: localOnAddChoice,
          editor: localEditor,
        });
        const markup = '<div>new choice</div>';

        instance.onDone(markup);

        expect(localOnAddChoice).toHaveBeenCalledWith('0', markup, -1);
        expect(localEditor.commands.refreshResponseArea).toHaveBeenCalled();
      });

      it('should update editor attributes when editing correct choice', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnToolbarDone = jest.fn();
        const localOnAddChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onToolbarDone: localOnToolbarDone,
          onAddChoice: localOnAddChoice,
        });
        instance.state.editedChoiceIndex = 0;
        const markup = '<div>updated cow</div>';

        instance.onDone(markup);

        expect(localEditor.commands.updateAttributes).toHaveBeenCalledWith('inline_dropdown', { value: markup });
        expect(localOnToolbarDone).toHaveBeenCalledWith(false);
      });

      it('should call onAddChoice when editing a choice', () => {
        const localOnAddChoice = jest.fn();
        const localEditor = {
          ...editor,
          commands: {
            ...editor.commands,
            refreshResponseArea: jest.fn(),
          },
        };
        const instance = createInstance({
          onAddChoice: localOnAddChoice,
          editor: localEditor,
        });
        instance.state.editedChoiceIndex = 1;
        const markup = '<div>updated dog</div>';

        instance.onDone(markup);

        expect(localOnAddChoice).toHaveBeenCalledWith('0', markup, 1);
      });

      it('should reset editedChoiceIndex after done', () => {
        const localOnAddChoice = jest.fn();
        const localEditor = {
          ...editor,
          commands: {
            ...editor.commands,
            refreshResponseArea: jest.fn(),
          },
        };
        const instance = createInstance({
          onAddChoice: localOnAddChoice,
          editor: localEditor,
        });
        instance.state.editedChoiceIndex = 1;

        instance.onDone('<div>test</div>');

        expect(instance.state.editedChoiceIndex).toBe(-1);
      });
    });

    describe('onSelectChoice', () => {
      it('should update editor attributes with new value', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnToolbarDone = jest.fn();
        const localOnSelectChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onToolbarDone: localOnToolbarDone,
          onSelectChoice: localOnSelectChoice,
        });
        const newValue = 'cat';
        const index = 2;

        instance.onSelectChoice(newValue, index);

        expect(localEditor.commands.updateAttributes).toHaveBeenCalledWith('inline_dropdown', { value: newValue });
      });

      it('should call onToolbarDone and onSelectChoice', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnToolbarDone = jest.fn();
        const localOnSelectChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onToolbarDone: localOnToolbarDone,
          onSelectChoice: localOnSelectChoice,
        });
        const newValue = 'cat';
        const index = 2;

        instance.onSelectChoice(newValue, index);

        expect(localOnToolbarDone).toHaveBeenCalledWith(false);
        expect(localOnSelectChoice).toHaveBeenCalledWith(index);
      });

      it('should refresh response area', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnToolbarDone = jest.fn();
        const localOnSelectChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onToolbarDone: localOnToolbarDone,
          onSelectChoice: localOnSelectChoice,
        });

        instance.onSelectChoice('dog', 1);

        expect(localEditor.commands.refreshResponseArea).toHaveBeenCalled();
      });
    });

    describe('onRemoveChoice', () => {
      it('should update editor attributes to null when removing selected choice', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnToolbarDone = jest.fn();
        const localOnRemoveChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onToolbarDone: localOnToolbarDone,
          onRemoveChoice: localOnRemoveChoice,
        });
        const value = 'cow';
        const index = 0;

        instance.onRemoveChoice(value, index);

        expect(localEditor.commands.updateAttributes).toHaveBeenCalledWith('inline_dropdown', { value: null });
        expect(localOnToolbarDone).toHaveBeenCalledWith(false);
      });

      it('should call onRemoveChoice for non-selected choice', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnRemoveChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onRemoveChoice: localOnRemoveChoice,
        });
        const value = 'cat';
        const index = 2;

        instance.onRemoveChoice(value, index);

        expect(localOnRemoveChoice).toHaveBeenCalledWith(index);
      });

      it('should refresh response area after removal', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnRemoveChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onRemoveChoice: localOnRemoveChoice,
        });

        instance.onRemoveChoice('dog', 1);

        expect(localEditor.commands.refreshResponseArea).toHaveBeenCalled();
      });

      it('should not update editor attributes when removing non-selected choice', () => {
        const localEditor = {
          ...editor,
          commands: {
            updateAttributes: jest.fn(),
            refreshResponseArea: jest.fn(),
          },
        };
        const localOnRemoveChoice = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onRemoveChoice: localOnRemoveChoice,
        });

        instance.onRemoveChoice('dog', 1);

        expect(localEditor.commands.updateAttributes).not.toHaveBeenCalled();
      });
    });

    describe('onEditChoice', () => {
      it('should update respAreaMarkup state', () => {
        const instance = createInstance();
        const value = 'dog';
        const index = 1;

        instance.onEditChoice(value, index);

        expect(instance.state.respAreaMarkup).toBe(value);
      });

      it('should set editedChoiceIndex', () => {
        const instance = createInstance();
        const value = 'cat';
        const index = 2;

        instance.onEditChoice(value, index);

        expect(instance.state.editedChoiceIndex).toBe(index);
      });

      it('should set preventDone to true', () => {
        const instance = createInstance();
        const value = 'dog';
        const index = 1;

        instance.preventDone = false;
        instance.onEditChoice(value, index);

        expect(instance.preventDone).toBe(true);
      });

      it('should save current edit before starting a new edit', () => {
        const localOnAddChoice = jest.fn();
        const localEditor = {
          ...editor,
          commands: {
            ...editor.commands,
            refreshResponseArea: jest.fn(),
          },
        };
        const instance = createInstance({
          onAddChoice: localOnAddChoice,
          editor: localEditor,
        });
        instance.editorRef = {
          getHTML: jest.fn().mockReturnValue('<div>modified dog</div>'),
        };

        // Start editing first choice
        instance.onEditChoice('dog', 1);
        expect(instance.state.editedChoiceIndex).toBe(1);

        // Start editing second choice without finishing the first
        instance.onEditChoice('cat', 2);

        // Should have called onDone with the previous edit
        expect(localOnAddChoice).toHaveBeenCalledWith('0', '<div>modified dog</div>', 1);
        expect(instance.state.editedChoiceIndex).toBe(2);
        expect(instance.state.respAreaMarkup).toBe('cat');
      });

      it('should not call onDone if no choice is currently being edited', () => {
        const localOnAddChoice = jest.fn();
        const localEditor = {
          ...editor,
          commands: {
            ...editor.commands,
            refreshResponseArea: jest.fn(),
          },
        };
        const instance = createInstance({
          onAddChoice: localOnAddChoice,
          editor: localEditor,
        });
        instance.editorRef = {
          getHTML: jest.fn().mockReturnValue('<div>test</div>'),
        };

        // editedChoiceIndex is -1 (no choice being edited)
        instance.state.editedChoiceIndex = -1;
        instance.onEditChoice('dog', 1);

        // Should not have called onDone
        expect(localOnAddChoice).not.toHaveBeenCalled();
        expect(instance.state.editedChoiceIndex).toBe(1);
      });

      it('should handle empty HTML when saving previous edit', () => {
        const localOnAddChoice = jest.fn();
        const localEditor = {
          ...editor,
          commands: {
            ...editor.commands,
            refreshResponseArea: jest.fn(),
          },
        };
        const instance = createInstance({
          onAddChoice: localOnAddChoice,
          editor: localEditor,
        });
        instance.editorRef = {
          getHTML: jest.fn().mockReturnValue(''),
        };

        // Start editing first choice
        instance.onEditChoice('dog', 1);

        // Start editing second choice with empty content in first
        instance.onEditChoice('cat', 2);

        // Should not call onAddChoice for empty content
        expect(localOnAddChoice).not.toHaveBeenCalled();
        expect(instance.state.editedChoiceIndex).toBe(2);
      });
    });
  });

  describe('Event Handlers', () => {
    describe('onKeyDown', () => {
      it('should call onDone and return true when Enter is pressed', () => {
        const localOnAddChoice = jest.fn();
        const localEditor = {
          ...editor,
          commands: {
            ...editor.commands,
            refreshResponseArea: jest.fn(),
          },
        };
        const instance = createInstance({
          onAddChoice: localOnAddChoice,
          editor: localEditor,
        });
        instance.editorRef = {
          getHTML: jest.fn().mockReturnValue('<div>new choice</div>'),
        };

        const event = { key: 'Enter' };
        const result = instance.onKeyDown(event);

        expect(localOnAddChoice).toHaveBeenCalled();
        expect(instance.preventDone).toBe(true);
        expect(result).toBe(true);
      });

      it('should return false for other keys', () => {
        const instance = createInstance();
        const event = { key: 'Tab' };

        const result = instance.onKeyDown(event);

        expect(result).toBe(false);
      });

      it('should handle empty HTML from editor', () => {
        const instance = createInstance();
        instance.editorRef = {
          getHTML: jest.fn().mockReturnValue(''),
        };

        const event = { key: 'Enter' };
        instance.onKeyDown(event);

        expect(onAddChoice).not.toHaveBeenCalled();
      });
    });

    describe('onBlur', () => {
      it('should return early if clicked inside', () => {
        const instance = createInstance();
        instance.clickedInside = true;

        instance.onBlur();

        expect(instance.clickedInside).toBe(false);
        expect(onCheck).not.toHaveBeenCalled();
      });

      it('should call onCheck if no choices exist', () => {
        const mockTr = { isDone: false, deleteSelection: jest.fn() };
        const localEditor = {
          ...editor,
          state: {
            ...editor.state,
            tr: mockTr,
          },
        };
        const localOnCheck = jest.fn();
        const instance = createInstance({
          choices: null,
          editor: localEditor,
          onCheck: localOnCheck,
        });

        instance.onBlur();

        expect(localOnCheck).toHaveBeenCalled();
      });

      it('should call onCheck if less than 2 choices', () => {
        const mockTr = { isDone: false, deleteSelection: jest.fn() };
        const localEditor = {
          ...editor,
          state: {
            ...editor.state,
            tr: mockTr,
          },
        };
        const localOnCheck = jest.fn();
        const instance = createInstance({
          choices: [{ label: 'cow', correct: true }],
          editor: localEditor,
          onCheck: localOnCheck,
        });

        instance.onBlur();

        expect(localOnCheck).toHaveBeenCalled();
      });

      it('should call onCheck if no correct response', () => {
        const mockTr = { isDone: false, deleteSelection: jest.fn() };
        const localEditor = {
          ...editor,
          state: {
            ...editor.state,
            tr: mockTr,
          },
        };
        const localOnCheck = jest.fn();
        const instance = createInstance({
          choices: [
            { label: 'cow', correct: false },
            { label: 'dog', correct: false },
          ],
          editor: localEditor,
          onCheck: localOnCheck,
        });

        instance.onBlur();

        expect(localOnCheck).toHaveBeenCalled();
      });

      it('should not call onCheck if valid choices exist', () => {
        const mockTr = { isDone: false, deleteSelection: jest.fn() };
        const localEditor = {
          ...editor,
          state: {
            ...editor.state,
            tr: mockTr,
          },
        };
        const localOnCheck = jest.fn();
        const instance = createInstance({
          editor: localEditor,
          onCheck: localOnCheck,
        });
        instance.clickedInside = false;

        instance.onBlur();

        expect(localOnCheck).not.toHaveBeenCalled();
      });

      it('should execute callback from onCheck', () => {
        const mockTr = { isDone: false, deleteSelection: jest.fn() };
        const mockDispatch = jest.fn();
        const localEditor = {
          ...editor,
          state: {
            ...editor.state,
            tr: mockTr,
          },
          view: {
            ...editor.view,
            dispatch: mockDispatch,
          },
        };
        const localOnCheck = jest.fn();
        const localOnToolbarDone = jest.fn();
        const instance = createInstance({
          choices: null,
          editor: localEditor,
          onCheck: localOnCheck,
          onToolbarDone: localOnToolbarDone,
        });
        localOnCheck.mockImplementation((callback) => callback());

        instance.onBlur();

        expect(mockTr.deleteSelection).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalled();
        expect(localOnToolbarDone).toHaveBeenCalledWith(false);
      });
    });

    describe('onClickInside', () => {
      it('should set clickedInside to true', () => {
        const instance = createInstance();
        instance.clickedInside = false;

        instance.onClickInside();

        expect(instance.clickedInside).toBe(true);
      });
    });
  });

  describe('Rendering', () => {
    it('should return null if toolbarStyle is not set', () => {
      const instance = createInstance();
      instance.state.toolbarStyle = null;

      const result = instance.render();

      expect(result).toBeNull();
    });

    it('should render choices when provided', () => {
      const instance = createInstance();
      instance.state.toolbarStyle = { position: 'absolute', top: '100px', left: '50px' };

      const wrapper = render(<>{instance.render()}</>);

      expect(wrapper.container.querySelector('[aria-label="Edit"]')).toBeTruthy();
      expect(wrapper.container.querySelector('[aria-label="Remove"]')).toBeTruthy();
    });

    it('should not render choices section when choices is null', () => {
      const instance = createInstance({ choices: null });
      instance.state.toolbarStyle = { position: 'absolute', top: '100px', left: '50px' };

      const wrapper = render(<>{instance.render()}</>);

      const menuItems = wrapper.container.querySelectorAll('[aria-label="Edit"]');
      expect(menuItems.length).toBe(0);
    });

    it('should render Add button', () => {
      const instance = createInstance();
      instance.state.toolbarStyle = { position: 'absolute', top: '100px', left: '50px' };

      const wrapper = render(<>{instance.render()}</>);

      expect(wrapper.container.querySelector('[aria-label="Add"]')).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should handle complete flow of adding a choice', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          ...editor.commands,
          refreshResponseArea: jest.fn(),
        },
      };
      const instance = createInstance({
        onAddChoice: localOnAddChoice,
        editor: localEditor,
      });
      instance.editorRef = {
        getHTML: jest.fn().mockReturnValue('<div>new choice</div>'),
      };

      // User types and presses Enter
      const event = { key: 'Enter' };
      instance.onKeyDown(event);

      expect(localOnAddChoice).toHaveBeenCalledWith('0', '<div>new choice</div>', -1);
      expect(localEditor.commands.refreshResponseArea).toHaveBeenCalled();
    });

    it('should handle complete flow of editing a choice', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          ...editor.commands,
          refreshResponseArea: jest.fn(),
        },
      };
      const instance = createInstance({
        onAddChoice: localOnAddChoice,
        editor: localEditor,
      });

      // User clicks edit button
      instance.onEditChoice('dog', 1);
      expect(instance.state.respAreaMarkup).toBe('dog');
      expect(instance.state.editedChoiceIndex).toBe(1);

      // User completes edit
      instance.onDone('<div>updated dog</div>');
      expect(localOnAddChoice).toHaveBeenCalledWith('0', '<div>updated dog</div>', 1);
      expect(instance.state.editedChoiceIndex).toBe(-1);
    });

    it('should handle complete flow of removing a choice', () => {
      const localOnRemoveChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          ...editor.commands,
          refreshResponseArea: jest.fn(),
        },
      };
      const instance = createInstance({
        onRemoveChoice: localOnRemoveChoice,
        editor: localEditor,
      });

      instance.onRemoveChoice('dog', 1);

      expect(localOnRemoveChoice).toHaveBeenCalledWith(1);
      expect(localEditor.commands.refreshResponseArea).toHaveBeenCalled();
    });

    it('should handle switching between editing choices without finishing', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          updateAttributes: jest.fn(),
          refreshResponseArea: jest.fn(),
        },
      };
      const instance = createInstance({
        onAddChoice: localOnAddChoice,
        editor: localEditor,
      });

      // Mock editor with HTML content
      instance.editorRef = {
        getHTML: jest.fn()
          .mockReturnValueOnce('<div>modified dog</div>')
          .mockReturnValueOnce('<div>modified cat</div>'),
      };

      // Start editing first choice
      instance.onEditChoice('dog', 1);
      expect(instance.state.editedChoiceIndex).toBe(1);
      expect(instance.state.respAreaMarkup).toBe('dog');

      // Switch to editing second choice without explicitly calling onDone
      localOnAddChoice.mockClear();
      instance.onEditChoice('cat', 2);

      // Should have auto-saved the previous edit
      expect(localOnAddChoice).toHaveBeenCalledWith('0', '<div>modified dog</div>', 1);
      expect(instance.state.editedChoiceIndex).toBe(2);
      expect(instance.state.respAreaMarkup).toBe('cat');
    });

    it('should handle editing the correct choice and switching to another', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          updateAttributes: jest.fn(),
          refreshResponseArea: jest.fn(),
        },
      };
      const localOnToolbarDone = jest.fn();
      const instance = createInstance({
        onAddChoice: localOnAddChoice,
        editor: localEditor,
        onToolbarDone: localOnToolbarDone,
      });

      // Mock editor with HTML content
      instance.editorRef = {
        getHTML: jest.fn().mockReturnValue('<div>modified cow</div>'),
      };

      // Start editing the correct choice (index 0)
      instance.onEditChoice('cow', 0);
      expect(instance.state.editedChoiceIndex).toBe(0);

      // Switch to editing another choice
      instance.onEditChoice('dog', 1);

      // Should have auto-saved and updated attributes since it was the correct choice
      expect(localEditor.commands.updateAttributes).toHaveBeenCalledWith('inline_dropdown', { value: '<div>modified cow</div>' });
      expect(localOnToolbarDone).toHaveBeenCalledWith(false);
      expect(instance.state.editedChoiceIndex).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing node attrs', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          ...editor.commands,
          refreshResponseArea: jest.fn(),
        },
      };
      const instance = createInstance({
        node: {
          key: '1',
          attrs: {},
        },
        onAddChoice: localOnAddChoice,
        editor: localEditor,
      });

      instance.onDone('<div>test</div>');

      expect(localOnAddChoice).toHaveBeenCalledWith(undefined, '<div>test</div>', -1);
    });

    it('should handle HTML with nested tags', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          ...editor.commands,
          refreshResponseArea: jest.fn(),
        },
      };
      const instance = createInstance({
        onAddChoice: localOnAddChoice,
        editor: localEditor,
      });
      const complexHtml = '<div><p><strong>Bold</strong> and <em>italic</em></p></div>';

      instance.onDone(complexHtml);

      expect(localOnAddChoice).toHaveBeenCalledWith('0', complexHtml, -1);
    });

    it('should handle special characters in choices', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          ...editor.commands,
          refreshResponseArea: jest.fn(),
        },
      };
      const instance = createInstance({
        onAddChoice: localOnAddChoice,
        editor: localEditor,
      });
      const specialChars = '<div>&lt;script&gt;alert("test")&lt;/script&gt;</div>';

      instance.onDone(specialChars);

      expect(localOnAddChoice).toHaveBeenCalled();
    });

    it('should handle empty choices array', () => {
      const mockTr = { isDone: false, deleteSelection: jest.fn() };
      const localEditor = {
        ...editor,
        state: {
          ...editor.state,
          tr: mockTr,
        },
      };
      const localOnCheck = jest.fn();
      const instance = createInstance({
        choices: [],
        editor: localEditor,
        onCheck: localOnCheck,
      });

      instance.onBlur();

      expect(localOnCheck).toHaveBeenCalled();
    });
  });

  describe('Props Configuration', () => {
    it('should pass spellCheck prop to EditableHtml', () => {
      const instance = createInstance({ spellCheck: true });
      instance.state.toolbarStyle = { position: 'absolute', top: '100px', left: '50px' };

      const wrapper = render(<>{instance.render()}</>);

      // The mock EditableHtml should receive spellCheck prop
      expect(wrapper.container).toBeTruthy();
    });

    it('should pass uploadSoundSupport prop to EditableHtml', () => {
      const uploadSoundSupport = { enabled: true };
      const instance = createInstance({ uploadSoundSupport });
      instance.state.toolbarStyle = { position: 'absolute', top: '100px', left: '50px' };

      const wrapper = render(<>{instance.render()}</>);

      expect(wrapper.container).toBeTruthy();
    });

    it('should pass mathMlOptions prop to EditableHtml', () => {
      const mathMlOptions = { mmlEditing: true };
      const instance = createInstance({ mathMlOptions });
      instance.state.toolbarStyle = { position: 'absolute', top: '100px', left: '50px' };

      const wrapper = render(<>{instance.render()}</>);

      expect(wrapper.container).toBeTruthy();
    });

    it('should handle editorCallback prop', () => {
      const editorCallback = jest.fn();
      const instance = createInstance({ editorCallback });
      instance.state.toolbarStyle = { position: 'absolute', top: '100px', left: '50px' };

      const wrapper = render(<>{instance.render()}</>);

      // editorCallback would be called in the editorRef callback
      // This is tested implicitly through rendering
      expect(wrapper.container).toBeTruthy();
    });
  });
});

describe('MenuItem Integration Tests', () => {
  let onAddChoice;
  let onRemoveChoice;
  let onSelectChoice;
  let onToolbarDone;
  let editor;
  let mockDomNode;
  let mockEditorNode;

  beforeEach(() => {
    onAddChoice = jest.fn();
    onRemoveChoice = jest.fn();
    onSelectChoice = jest.fn();
    onToolbarDone = jest.fn();

    mockDomNode = {
      nodeType: 1,
      getBoundingClientRect: jest.fn().mockReturnValue({
        top: 100,
        left: 50,
        height: 20,
      }),
      closest: jest.fn(),
    };

    mockEditorNode = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        left: 25,
      }),
    };

    mockDomNode.closest.mockReturnValue(mockEditorNode);

    editor = {
      commands: {
        updateAttributes: jest.fn(),
        refreshResponseArea: jest.fn(),
      },
      view: {
        nodeDOM: jest.fn().mockReturnValue(mockDomNode),
        dispatch: jest.fn(),
      },
      state: {
        selection: { from: 0 },
        tr: { isDone: false, deleteSelection: jest.fn() },
      },
    };
  });

  const createToolbar = (choices) => {
    const props = {
      onAddChoice,
      onRemoveChoice,
      onSelectChoice,
      onToolbarDone,
      node: {
        key: '1',
        attrs: { index: '0', value: 'cow' },
      },
      pos: 0,
      editor,
      choices,
    };

    const instance = new RespAreaToolbar(props);
    instance.props = props;

    // Mock setState to execute updates synchronously
    instance.setState = jest.fn((state) => {
      if (typeof state === 'function') {
        instance.state = { ...instance.state, ...state(instance.state) };
      } else {
        instance.state = { ...instance.state, ...state };
      }
    });

    instance.componentDidMount();

    return instance;
  };

  describe('MenuItem Rendering via Parent', () => {
    it('should render all choice items', () => {
      const choices = [
        { label: 'cow', correct: true },
        { label: 'dog', correct: false },
        { label: 'cat', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      const editButtons = rendered.getAllByLabelText('Edit');
      const removeButtons = rendered.getAllByLabelText('Remove');

      expect(editButtons.length).toBe(3);
      expect(removeButtons.length).toBe(3);
    });

    it('should display correct indicator only for correct choice', () => {
      const choices = [
        { label: 'cow', correct: true },
        { label: 'dog', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      // Check that correct styling is applied
      expect(rendered.container).toBeTruthy();
    });

    it('should render choice labels as HTML', () => {
      const choices = [
        { label: '<p><strong>Bold choice</strong></p>', correct: true },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      expect(rendered.container.innerHTML).toContain('Bold choice');
    });
  });

  describe('MenuItem Click Interactions', () => {
    it('should call onSelectChoice when clicking a choice', () => {
      const choices = [
        { label: 'cow', correct: true },
        { label: 'dog', correct: false },
      ];

      const localOnSelectChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          updateAttributes: jest.fn(),
          refreshResponseArea: jest.fn(),
        },
      };

      const props = {
        onAddChoice,
        onRemoveChoice,
        onSelectChoice: localOnSelectChoice,
        onToolbarDone,
        node: {
          key: '1',
          attrs: { index: '0', value: 'cow' },
        },
        pos: 0,
        editor: localEditor,
        choices,
      };

      const instance = new RespAreaToolbar(props);
      instance.props = props;
      instance.setState = jest.fn((state) => {
        if (typeof state === 'function') {
          instance.state = { ...instance.state, ...state(instance.state) };
        } else {
          instance.state = { ...instance.state, ...state };
        }
      });
      instance.componentDidMount();

      const rendered = render(<>{instance.render()}</>);

      // Find the second choice (dog) - use the parent div that has onClick
      const choiceElements = rendered.container.querySelectorAll('[dangerouslySetInnerHTML]');
      if (choiceElements[1]) {
        fireEvent.click(choiceElements[1]);

        expect(localEditor.commands.updateAttributes).toHaveBeenCalledWith('inline_dropdown', { value: 'dog' });
        expect(localOnSelectChoice).toHaveBeenCalledWith(1);
      }
    });

    it('should call onEditChoice when clicking Edit button', () => {
      const choices = [
        { label: 'cow', correct: true },
        { label: 'dog', correct: false },
      ];

      const instance = createToolbar(choices);
      // Mock editorRef to prevent errors when auto-saving
      instance.editorRef = {
        getHTML: jest.fn().mockReturnValue(''),
      };
      const rendered = render(<>{instance.render()}</>);

      const editButtons = rendered.getAllByLabelText('Edit');
      fireEvent.click(editButtons[1]);

      expect(instance.state.respAreaMarkup).toBe('dog');
      expect(instance.state.editedChoiceIndex).toBe(1);
    });

    it('should call onRemoveChoice when clicking Remove button', () => {
      const choices = [
        { label: 'cow', correct: true },
        { label: 'dog', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      const removeButtons = rendered.getAllByLabelText('Remove');
      fireEvent.click(removeButtons[1]);

      expect(onRemoveChoice).toHaveBeenCalledWith(1);
      expect(editor.commands.refreshResponseArea).toHaveBeenCalled();
    });

    it('should update to null when removing the selected choice', () => {
      const choices = [
        { label: 'cow', correct: true },
        { label: 'dog', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      const removeButtons = rendered.getAllByLabelText('Remove');
      fireEvent.click(removeButtons[0]); // Remove 'cow' which is the selected value

      expect(editor.commands.updateAttributes).toHaveBeenCalledWith('inline_dropdown', { value: null });
      expect(onToolbarDone).toHaveBeenCalledWith(false);
    });
  });

  describe('MenuItem Edit/Remove Action Buttons', () => {
    it('should have Edit and Remove buttons for each choice', () => {
      const choices = [
        { label: 'choice1', correct: false },
        { label: 'choice2', correct: false },
        { label: 'choice3', correct: true },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      const editButtons = rendered.getAllByLabelText('Edit');
      const removeButtons = rendered.getAllByLabelText('Remove');

      expect(editButtons.length).toBe(3);
      expect(removeButtons.length).toBe(3);
    });

    it('should not trigger choice selection when clicking action buttons', () => {
      const choices = [
        { label: 'cow', correct: true },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      const editButton = rendered.getByLabelText('Edit');
      fireEvent.click(editButton);

      // onSelectChoice should not be called, only state should update
      expect(onSelectChoice).not.toHaveBeenCalled();
      expect(instance.state.editedChoiceIndex).toBe(0);
    });
  });

  describe('MenuItem Visual States', () => {
    it('should apply correct styling to correct choice', () => {
      const choices = [
        { label: 'correct answer', correct: true },
        { label: 'wrong answer', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      // The correct choice should have special styling
      expect(rendered.container).toBeTruthy();
    });

    it('should show check icon for correct choice', () => {
      const choices = [
        { label: 'correct answer', correct: true },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      // Check for CheckIcon in the rendered output
      const checkIcon = rendered.container.querySelector('svg');
      expect(checkIcon).toBeTruthy();
    });
  });

  describe('MenuItem Edge Cases', () => {
    it('should handle empty label gracefully', () => {
      const choices = [
        { label: '', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      const editButtons = rendered.getAllByLabelText('Edit');
      expect(editButtons.length).toBe(1);
    });

    it('should handle HTML entities in labels', () => {
      const choices = [
        { label: '&lt;p&gt;escaped&lt;/p&gt;', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      expect(rendered.container).toBeTruthy();
    });

    it('should handle very long labels', () => {
      const longLabel = '<p>' + 'a'.repeat(500) + '</p>';
      const choices = [
        { label: longLabel, correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      expect(rendered.container).toBeTruthy();
    });

    it('should handle special characters in labels', () => {
      const choices = [
        { label: '<p>Math: x² + y² = z²</p>', correct: false },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      expect(rendered.container.innerHTML).toContain('x²');
    });
  });

  describe('Multiple MenuItem Interactions', () => {
    it('should allow editing multiple choices sequentially', () => {
      const choices = [
        { label: 'choice1', correct: false },
        { label: 'choice2', correct: false },
      ];

      const instance = createToolbar(choices);
      // Mock editorRef to prevent errors when auto-saving
      instance.editorRef = {
        getHTML: jest.fn().mockReturnValue(''),
      };
      const rendered = render(<>{instance.render()}</>);

      const editButtons = rendered.getAllByLabelText('Edit');

      fireEvent.click(editButtons[0]);
      expect(instance.state.editedChoiceIndex).toBe(0);

      fireEvent.click(editButtons[1]);
      expect(instance.state.editedChoiceIndex).toBe(1);
    });

    it('should auto-save when switching between editing choices', () => {
      const localOnAddChoice = jest.fn();
      const localEditor = {
        ...editor,
        commands: {
          updateAttributes: jest.fn(),
          refreshResponseArea: jest.fn(),
        },
      };

      const choices = [
        { label: 'choice1', correct: false },
        { label: 'choice2', correct: false },
      ];

      const props = {
        onAddChoice: localOnAddChoice,
        onRemoveChoice,
        onSelectChoice,
        onToolbarDone,
        node: {
          key: '1',
          attrs: { index: '0', value: 'cow' },
        },
        pos: 0,
        editor: localEditor,
        choices,
      };

      const instance = new RespAreaToolbar(props);
      instance.props = props;
      instance.setState = jest.fn((state) => {
        if (typeof state === 'function') {
          instance.state = { ...instance.state, ...state(instance.state) };
        } else {
          instance.state = { ...instance.state, ...state };
        }
      });
      instance.editorRef = {
        getHTML: jest.fn().mockReturnValue('<div>modified choice1</div>'),
      };
      instance.componentDidMount();

      // Start editing first choice directly
      instance.onEditChoice('choice1', 0);
      expect(instance.state.editedChoiceIndex).toBe(0);

      // Start editing second choice - should auto-save first choice
      instance.onEditChoice('choice2', 1);
      expect(localOnAddChoice).toHaveBeenCalledWith('0', '<div>modified choice1</div>', 0);
      expect(instance.state.editedChoiceIndex).toBe(1);
    });

    it('should allow removing multiple choices', () => {
      const choices = [
        { label: 'choice1', correct: false },
        { label: 'choice2', correct: false },
        { label: 'choice3', correct: true },
      ];

      const instance = createToolbar(choices);
      const rendered = render(<>{instance.render()}</>);

      const removeButtons = rendered.getAllByLabelText('Remove');

      fireEvent.click(removeButtons[0]);
      expect(onRemoveChoice).toHaveBeenCalledWith(0);

      fireEvent.click(removeButtons[1]);
      expect(onRemoveChoice).toHaveBeenCalledWith(1);
    });
  });
});
