import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import cloneDeep from 'lodash/cloneDeep';
import FreePathDrawable from '../drawable-free-path';
import LineDrawable from '../drawable-line';
import RectangleDrawable from '../drawable-rectangle';
import CircleDrawable from '../drawable-circle';
import EraserDrawable from '../drawable-eraser';
import DrawableText from '../drawable-text';
import { DrawableMain } from '../drawable-main';

jest.mock('react-konva', () => ({
  Stage: (props) => <div data-testid="konva-stage" {...props}>{props.children}</div>,
  Layer: (props) => <div data-testid="konva-layer" {...props}>{props.children}</div>,
  Circle: (props) => <circle data-testid="konva-circle" {...props} />,
  Line: (props) => <line data-testid="konva-line" {...props} />,
  Arrow: (props) => <line data-testid="konva-arrow" {...props} />,
  Rect: (props) => <rect data-testid="konva-rect" {...props} />,
  Group: (props) => <g data-testid="konva-group" {...props}>{props.children}</g>,
  Text: (props) => <text data-testid="konva-text" {...props}>{props.children}</text>,
  Transformer: (props) => <g data-testid="konva-transformer" {...props} />,
}));

jest.mock('../drawable-transformer', () => {
  return (props) => <g data-testid="drawable-transformer" {...props} />;
});

const theme = createTheme();

const drawableClasses = {
  FreePathDrawable,
  LineDrawable,
  RectangleDrawable,
  CircleDrawable,
  EraserDrawable,
  DrawableText,
};

describe('DrawingResponse', () => {
  let element;

  describe('DrawableMain', () => {
    let onSessionChange = jest.fn();
    const TextEntry = new DrawableText();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const renderDrawableMain = (props = {}) => {
      const defaultProps = {
        disabled: false,
        className: 'className',
        onSessionChange,
        imageDimensions: {},
        imageUrl: 'url',
        drawableDimensions: { height: 350, width: 353 },
        fillColor: 'white',
        outlineColor: 'black',
        paintColor: 'red',
        session: {},
        toolActive: { type: 'Select', label: 'Select', icon: 'mdiCursorDefault' },
        TextEntry,
        ...props,
      };
      return render(
        <ThemeProvider theme={theme}>
          <DrawableMain {...defaultProps} />
        </ThemeProvider>
      );
    };

    describe('logic', () => {
      const handleSessionChange = jest.fn();
      const forceUpdate = jest.fn();
      const props = {
        handleSessionChange,
        forceUpdate,
        paint: true,
        paintColor: 'green',
        startx: 200,
        starty: 200,
        x: 300,
        y: 300,
        createdAt: new Date(),
      };

      it('handleUndo removes the last drawable', () => {
        const testInstance = new DrawableMain({
          onSessionChange,
          imageDimensions: {},
          imageUrl: 'url',
          drawableDimensions: { height: 350, width: 353 },
          fillColor: 'white',
          outlineColor: 'black',
          paintColor: 'red',
          session: {},
          toolActive: { type: 'Select', label: 'Select', icon: 'mdiCursorDefault' },
          TextEntry,
        });

        const drawable1 = new RectangleDrawable(props);
        const drawable2 = new RectangleDrawable(props);

        // Set initial state
        testInstance.state = { drawables: [drawable1, drawable2], newDrawable: [], textIsSelected: false };

        // Spy on setState
        const setStateSpy = jest.spyOn(testInstance, 'setState');

        // First undo - should remove drawable2
        testInstance.handleUndo();

        expect(setStateSpy).toHaveBeenCalledWith(
          { drawables: [drawable1] },
          testInstance.handleSessionChange
        );

        // Update state to reflect what would have happened
        testInstance.state.drawables = [drawable1];
        setStateSpy.mockClear();

        // Second undo - should remove drawable1
        testInstance.handleUndo();

        expect(setStateSpy).toHaveBeenCalledWith(
          { drawables: [] },
          testInstance.handleSessionChange
        );
      });

      it('handleClearAll removes all drawables', () => {
        const testInstance = new DrawableMain({
          onSessionChange,
          imageDimensions: {},
          imageUrl: 'url',
          drawableDimensions: { height: 350, width: 353 },
          fillColor: 'white',
          outlineColor: 'black',
          paintColor: 'red',
          session: {},
          toolActive: { type: 'Select', label: 'Select', icon: 'mdiCursorDefault' },
          TextEntry,
        });

        const drawable1 = new RectangleDrawable(props);
        const drawable2 = new RectangleDrawable(props);

        // Set initial state
        testInstance.state = { drawables: [drawable1, drawable2], newDrawable: [], textIsSelected: false };

        // Spy on setState
        const setStateSpy = jest.spyOn(testInstance, 'setState');

        testInstance.handleClearAll();

        expect(setStateSpy).toHaveBeenCalledWith(
          { drawables: [], updatedAt: expect.any(Date) },
          testInstance.handleSessionChange
        );
        expect(TextEntry.all).toEqual([]);
      });
    });
  });

  describe('CircleDrawable', () => {
    let handleSessionChange = jest.fn();
    let forceUpdate = jest.fn();
    let props;

    beforeEach(() => {
      props = {
        handleSessionChange,
        forceUpdate,
        paint: true,
        paintColor: 'green',
        startx: 200,
        starty: 200,
        x: 300,
        y: 200,
        createdAt: new Date(),
      };
      element = new CircleDrawable(props);
    });

    describe('logic', () => {
      it('changes x and y', () => {
        element.registerMovement(400, 400);

        expect(element.x).toEqual(400);
        expect(element.y).toEqual(400);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(event.target.getX).toHaveBeenCalled();
        expect(event.target.getY).toHaveBeenCalled();

        expect(handleSessionChange).toHaveBeenCalled();
      });

      it('changes startx and starty', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(element.startx).toEqual(300);
        expect(element.starty).toEqual(300);
        expect(element.x).toEqual(400);
        expect(element.y).toEqual(300);
      });
    });
  });

  describe('EraserDrawable', () => {
    let handleSessionChange = jest.fn();
    let forceUpdate = jest.fn();
    let props;

    beforeEach(() => {
      props = {
        handleSessionChange,
        forceUpdate,
        points: [200, 200, 300, 300],
        posX: 200,
        posY: 200,
        startx: 200,
        starty: 200,
        createdAt: new Date(),
      };
      element = new EraserDrawable(props);
    });

    describe('logic', () => {
      it('changes points', () => {
        element.registerMovement(400, 400);

        expect(element.points).toEqual([200, 200, 300, 300, 400, 400]);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(event.target.getX).toHaveBeenCalled();
        expect(event.target.getY).toHaveBeenCalled();

        expect(handleSessionChange).toHaveBeenCalled();
      });

      it('changes posX and posY', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(element.posX).toEqual(300);
        expect(element.posY).toEqual(300);
      });
    });
  });

  describe('FreePathDrawable', () => {
    let handleSessionChange = jest.fn();
    let forceUpdate = jest.fn();
    let props;

    beforeEach(() => {
      props = {
        handleSessionChange,
        forceUpdate,
        paint: true,
        paintColor: 'green',
        points: [200, 200, 300, 300],
        posX: 200,
        posY: 200,
        startx: 200,
        starty: 200,
        createdAt: new Date(),
      };
      element = new FreePathDrawable(props);
    });

    describe('logic', () => {
      it('changes points', () => {
        element.registerMovement(400, 400);

        expect(element.points).toEqual([200, 200, 300, 300, 400, 400]);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(event.target.getX).toHaveBeenCalled();
        expect(event.target.getY).toHaveBeenCalled();

        expect(handleSessionChange).toHaveBeenCalled();
      });

      it('changes posX and posY', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(element.posX).toEqual(300);
        expect(element.posY).toEqual(300);
      });
    });
  });

  describe('LineDrawable', () => {
    let handleSessionChange = jest.fn();
    let forceUpdate = jest.fn();
    let props;

    beforeEach(() => {
      props = {
        handleSessionChange,
        forceUpdate,
        paint: true,
        paintColor: 'green',
        startx: 200,
        starty: 200,
        posX: 200,
        posY: 200,
        x: 300,
        y: 200,
        createdAt: new Date(),
      };
      element = new LineDrawable(props);
    });

    describe('logic', () => {
      it('changes x and y', () => {
        element.registerMovement(400, 400);

        expect(element.x).toEqual(400);
        expect(element.y).toEqual(400);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(event.target.getX).toHaveBeenCalled();
        expect(event.target.getY).toHaveBeenCalled();

        expect(handleSessionChange).toHaveBeenCalled();
      });

      it('changes posX and posY', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(element.posX).toEqual(300);
        expect(element.posY).toEqual(300);
      });
    });
  });

  describe('RectangleDrawable', () => {
    let handleSessionChange = jest.fn();
    let forceUpdate = jest.fn();
    let props;

    beforeEach(() => {
      props = {
        handleSessionChange,
        forceUpdate,
        paint: true,
        paintColor: 'green',
        startx: 200,
        starty: 200,
        x: 300,
        y: 300,
        createdAt: new Date(),
      };
      element = new RectangleDrawable(props);
    });

    describe('logic', () => {
      it('changes x and y', () => {
        element.registerMovement(400, 400);

        expect(element.x).toEqual(400);
        expect(element.y).toEqual(400);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(event.target.getX).toHaveBeenCalled();
        expect(event.target.getY).toHaveBeenCalled();

        expect(handleSessionChange).toHaveBeenCalled();
      });

      it('changes posX and posY', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300),
          },
        };

        element.handleDragEnd(props, event);

        expect(element.startx).toEqual(300);
        expect(element.starty).toEqual(300);
        expect(element.x).toEqual(400);
        expect(element.y).toEqual(400);
      });
    });
  });

  describe('DrawableText', () => {
    const all = [
      {
        id: 'gcifqhhimf8k2d6g8hs',
        isDefault: true,
        label: 'Double click to edit this text. Press Enter to submit.',
        value: 'This is what the user entered',
        width: 200,
        x: 2 * 5 + 50,
        y: 2 * 5 + 50,
        textVisible: true,
        transformerVisible: true,
        textareaVisible: false,
        createdAt: new Date(),
        type: 'text-entry',
      },
    ];
    let handleSessionChange = jest.fn();
    let forceUpdate = jest.fn();
    let toggleTextSelected = jest.fn();
    let props;
    let stage;

    beforeEach(() => {
      stage = {
        on: jest.fn(),
        off: jest.fn(),
      };

      props = {
        all,
        handleSessionChange,
        forceUpdate,
        stage,
        toggleTextSelected,
        paint: true,
        paintColor: 'green',
        startx: 200,
        starty: 200,
        x: 300,
        y: 300,
        scale: 1,
      };
      element = new DrawableText(props);
    });

    describe('snapshot when there is no value', () => {
      beforeEach(() => {
        props.all.forEach((a) => {
          delete a.value;
        });
        element = new DrawableText(props);
      });
      it('renders', () => {
        const content = element.render(props);
        const { container } = render(<div>{content}</div>);
        // // expect(container).toMatchSnapshot();
      });
    });

    describe('logic', () => {
      it('shoud change the all property and call forceUpdate', () => {
        element.setInitialProps(props);
        element.setAll([]);

        expect(element.all).toEqual([]);
        expect(forceUpdate).toHaveBeenCalled();
      });

      describe('addNewTextEntry', () => {
        it('shoud add a new element and call the appropriate functions', () => {
          element.setInitialProps(props);
          element.addNewTextEntry();

          expect(element.all.length).toEqual(2);
          expect(element.all).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                isDefault: true,
                label: 'Double click to edit this text. Press Enter to submit.',
                width: 200,
                textVisible: true,
                transformerVisible: true,
                textareaVisible: false,
                type: 'text-entry',
              }),
            ]),
          );

          expect(handleSessionChange).toHaveBeenCalled();
        });
      });

      describe('showOnlyTextNodes', () => {
        it('should change properties for the "all" array', () => {
          element.showOnlyTextNodes();

          expect(element.all).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                textVisible: true,
                transformerVisible: false,
                textareaVisible: false,
              }),
            ]),
          );
        });
      });

      describe('showOnltoggleTextareayTextNodes', () => {
        it('should change the item with the right id in the "all" array and call forceUpdate', () => {
          element.setInitialProps(props);
          element.toggleTextarea('gcifqhhimf8k2d6g8hs', true);

          expect(element.all[0]).toEqual(
            expect.objectContaining({
              textVisible: false,
              transformerVisible: false,
              textareaVisible: true,
            }),
          );

          expect(forceUpdate).toHaveBeenCalled();

          element.toggleTextarea('gcifqhhimf8k2d6g8hs', false);

          expect(element.all[0]).toEqual(
            expect.objectContaining({
              textVisible: true,
              transformerVisible: true,
              textareaVisible: false,
            }),
          );

          expect(forceUpdate).toHaveBeenCalled();
        });
      });

      describe('initializeDefault', () => {
        it('should make the item with the right id default', () => {
          element.initializeDefault('gcifqhhimf8k2d6g8hs', true);

          expect(element.all[0]).toEqual(
            expect.objectContaining({
              isDefault: false,
            }),
          );
        });
      });

      describe('saveValue', () => {
        it('should save the value and call handleSessionChange', () => {
          element.setInitialProps(props);
          const textareaNode = {
            value: 'Foo bar',
          };

          element.saveValue('gcifqhhimf8k2d6g8hs', textareaNode);

          expect(element.all[0].text).toEqual('Foo bar');
          expect(handleSessionChange).toHaveBeenCalled();
          expect(forceUpdate).toHaveBeenCalled();

          // Reset mock
          handleSessionChange.mockClear();
          forceUpdate.mockClear();

          // Test with empty value - should remove the item
          textareaNode.value = '';
          element.saveValue('gcifqhhimf8k2d6g8hs', textareaNode);

          expect(element.all).toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                id: 'gcifqhhimf8k2d6g8hs',
              }),
            ]),
          );
          expect(forceUpdate).toHaveBeenCalled();
          expect(handleSessionChange).toHaveBeenCalled();
        });
      });

      describe('handleMouseEvents', () => {
        it('should call the right functions on mouse down and up', () => {
          element.setInitialProps(props);
          element.handleMouseDown();
          expect(toggleTextSelected).toHaveBeenCalledWith(true);

          element.handleMouseUp();
          expect(toggleTextSelected).toHaveBeenCalledWith(false);
        });

        it('should call the right functions onClick', () => {
          element.setInitialProps(props);
          element.handleClick(null, 'gcifqhhimf8k2d6g8hs');

          expect(element.all).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                transformerVisible: true,
              }),
            ]),
          );

          expect(forceUpdate).toHaveBeenCalled();
        });

        it('should call the right functions onDblClick', () => {
          element.setInitialProps(props);

          // Call render to set up stage reference
          element.render(props);

          const text = {
            id: 'gcifqhhimf8k2d6g8hs',
            isDefault: false,
            text: 'foo bar',
          };

          const textNode = (element[`text_${text.id}`] = {
            _lastPos: {
              x: 200,
              y: 200,
            },
            align: jest.fn().mockReturnValue('center'),
            fill: jest.fn().mockReturnValue('green'),
            fontFamily: jest.fn().mockReturnValue('FooBarFamily'),
            fontSize: jest.fn().mockReturnValue('16'),
            height: jest.fn().mockReturnValue(40),
            lineHeight: jest.fn().mockReturnValue('40px'),
            padding: jest.fn().mockReturnValue(0),
            rotation: jest.fn().mockReturnValue(0),
            text: jest.fn().mockReturnValue('foo bar'),
            width: jest.fn().mockReturnValue(200),
            getAbsolutePosition: jest.fn().mockReturnValue({ x: 200, y: 200 }),
          });
          const textareaNode = (element[`textarea_${text.id}`] = {
            focus: jest.fn(),
            addEventListener: jest.fn(),
            style: {},
            scrollHeight: 205,
          });

          const initSpy = jest.spyOn(element, 'initializeDefault');
          const saveValueSpy = jest.spyOn(element, 'saveValue');
          const toggleSpy = jest.spyOn(element, 'toggleTextarea');

          element.handleDblClick(null, text);

          expect(toggleSpy).toHaveBeenCalledWith(text.id, true);

          expect(textareaNode.value).toEqual('foo bar');
          expect(textareaNode.style).toMatchObject({
            background: 'none',
            border: 'none',
            color: 'green',
            fontFamily: 'FooBarFamily',
            fontSize: '16px',
            left: '200px',
            lineHeight: '40px',
            margin: '0px',
            outline: 'none',
            overflow: 'hidden',
            padding: '0px',
            position: 'absolute',
            resize: 'none',
            top: '200px',
            transformOrigin: 'left top',
            textAlign: 'center',
            width: '200px',
          });

          expect(textareaNode.focus).toHaveBeenCalled();
          expect(stage.on).toHaveBeenCalled();
          expect(initSpy).toHaveBeenCalledWith('gcifqhhimf8k2d6g8hs', false);
          expect(forceUpdate).toHaveBeenCalled();
          expect(textareaNode.addEventListener.mock.calls[0][0]).toEqual('keydown');
          expect(textareaNode.addEventListener.mock.calls[1][0]).toEqual('blur');

          const event = {
            key: 'Enter',
            shiftKey: true,
          };

          // Clear spy to ignore the initial toggleTextarea(id, true) call from handleDblClick
          toggleSpy.mockClear();
          saveValueSpy.mockClear();

          textareaNode.addEventListener.mock.calls[0][1](event);

          // Make sure toggleTextarea and saveValue are not called when shift+enter is pressed
          expect(toggleSpy).not.toHaveBeenCalled();
          expect(saveValueSpy).not.toHaveBeenCalled();

          event.shiftKey = false;

          textareaNode.addEventListener.mock.calls[0][1](event);

          // Enter without shift calls saveValue, which in turn calls toggleTextarea
          expect(saveValueSpy).toHaveBeenCalledWith('gcifqhhimf8k2d6g8hs', textareaNode);
          expect(toggleSpy).toHaveBeenCalledWith('gcifqhhimf8k2d6g8hs', false);

          // Clear spy before testing Escape key
          toggleSpy.mockClear();
          saveValueSpy.mockClear();

          event.key = 'Escape';

          textareaNode.addEventListener.mock.calls[0][1](event);

          // Escape only calls toggleTextarea, not saveValue
          expect(toggleSpy).toHaveBeenCalledWith('gcifqhhimf8k2d6g8hs', false);
          expect(saveValueSpy).not.toHaveBeenCalled();

          const showTextSpy = jest.spyOn(element, 'showOnlyTextNodes');

          // Clear spies before testing stage click handler
          toggleSpy.mockClear();
          saveValueSpy.mockClear();

          event.target = stage;

          stage.on.mock.calls[0][1](event);

          // Stage click handler only calls showOnlyTextNodes and forceUpdate, not saveValue
          expect(showTextSpy).toHaveBeenCalled();
          expect(forceUpdate).toHaveBeenCalled();
          expect(saveValueSpy).not.toHaveBeenCalled();
        });
      });

      describe('handleTransform', () => {
        it('should change attrs when called', () => {
          element.setInitialProps(props);
          const textNode = (element[`text_gcifqhhimf8k2d6g8hs`] = {
            setAttrs: jest.fn(),
            width: jest.fn().mockReturnValue(100),
            scaleX: jest.fn().mockReturnValue(1),
          });

          element.handleTransform(null, 'text_gcifqhhimf8k2d6g8hs');

          expect(textNode.setAttrs).toHaveBeenCalledWith({
            width: 100,
            scaleX: 1,
          });
        });
      });

      describe('setInitialProps', () => {
        it('should set the props if not set already', () => {
          element.props = undefined;

          element.setInitialProps(props);

          expect(element.props).toEqual(props);
        });
      });

      describe('render', () => {
        it('should set the stage listener only once', () => {
          const separateStage = {
            on: jest.fn(),
            off: jest.fn(),
          };
          const newProps = {
            ...cloneDeep(props),
            stage: separateStage,
          };
          const newElement = new drawableClasses['DrawableText'](newProps);

          expect(newElement.stage).toEqual(undefined);

          newElement.render(newProps);
          expect(newElement.stage).toEqual(separateStage);

          newElement.render(newProps);

          expect(separateStage.on.mock.calls.length).toEqual(1);
        });
      });
    });
  });
});
