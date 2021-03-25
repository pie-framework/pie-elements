import React from 'react';
import {shallow} from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import FreePathDrawable from '../drawable-free-path';
import LineDrawable from '../drawable-line';
import RectangleDrawable from '../drawable-rectangle';
import CircleDrawable from '../drawable-circle';
import EraserDrawable from '../drawable-eraser';
import DrawableText from '../drawable-text';
import {DrawableMain} from '../drawable-main';

const drawableClasses = {
  FreePathDrawable,
  LineDrawable,
  RectangleDrawable,
  CircleDrawable,
  EraserDrawable,
  DrawableText
};

describe('DrawingResponse', () => {
  let element;
  let wrapper;

  const mkWrapper = (type, props, WrapperEl) => {
    element = new drawableClasses[type](props);

    let content = element.render(props);

    if (WrapperEl) {
      content = <WrapperEl>{content}</WrapperEl>;
    }

    return shallow(content);
  };

  describe('DrawableMain', () => {
    let onSessionChange = jest.fn();
    const TextEntry = new DrawableText();

    const wrapperMain = (extras, renderOpts) => {
      const defaults = {
        classes: {},
        disabled: false,
        className: 'className',
        onSessionChange,
        imageDimensions: {},
        imageUrl: 'url',
        drawableDimensions: {height: 350, width: 353},
        fillColor: 'white',
        outlineColor: 'black',
        paintColor: 'red',
        session: {},
        toolActive: {type: 'Select', label: 'Select', icon: 'mdiCursorDefault'},
        TextEntry
      };
      const props = {...defaults, ...extras};
      return shallow(<DrawableMain {...props} />, {
        ...renderOpts
      });
    }

    describe('snapshot', () => {
      it('renders', () => {
        const w = wrapperMain();
        expect(w).toMatchSnapshot();
      });

      it('renders disabled', () => {
        const w = wrapperMain({disabled: true});
        expect(w).toMatchSnapshot();
      });
    });

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

      it('handleUndo', () => {
        const w = wrapperMain();

        w.setState({drawables: [new RectangleDrawable(props), new RectangleDrawable(props)]});
        w.instance().handleUndo();

        expect(w.state('drawables').length).toEqual(1);

        w.instance().handleUndo();

        expect(w.state('drawables')).toEqual([]);
      });

      it('handleClearAll', () => {
        const w = wrapperMain();

        w.setState({drawables: [new RectangleDrawable(props), new RectangleDrawable(props)]});
        w.instance().handleClearAll();

        expect(w.state('drawables')).toEqual([]);
      });
    })
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
      wrapper = mkWrapper('CircleDrawable', props);
    });

    describe('snapshot', () => {
      it('renders', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('logic', () => {
      it('calls forceUpdate', () => {
        wrapper.simulate('click');
        expect(forceUpdate).toHaveBeenCalled();
      });

      it('changes x and y', () => {
        element.registerMovement(400, 400);

        expect(element.x).toEqual(400);
        expect(element.y).toEqual(400);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300)
          }
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
            getY: jest.fn().mockReturnValue(300)
          }
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
      wrapper = mkWrapper('EraserDrawable', props);
    });

    describe('snapshot', () => {
      it('renders', () => {
        expect(wrapper).toMatchSnapshot();
      });
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
            getY: jest.fn().mockReturnValue(300)
          }
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
            getY: jest.fn().mockReturnValue(300)
          }
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
      wrapper = mkWrapper('FreePathDrawable', props);
    });

    describe('snapshot', () => {
      it('renders', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('logic', () => {
      it('calls forceUpdate', () => {
        wrapper.simulate('click');
        expect(forceUpdate).toHaveBeenCalled();
      });

      it('changes points', () => {
        element.registerMovement(400, 400);

        expect(element.points).toEqual([200, 200, 300, 300, 400, 400]);
      });

      it('changes session when needed', () => {
        const spy = jest.spyOn(element, 'handleDragEnd');

        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300)
          }
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
            getY: jest.fn().mockReturnValue(300)
          }
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
      wrapper = mkWrapper('LineDrawable', props);
    });

    describe('snapshot', () => {
      it('renders', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('logic', () => {
      it('calls forceUpdate', () => {
        wrapper.simulate('click');
        expect(forceUpdate).toHaveBeenCalled();
      });

      it('changes x and y', () => {
        element.registerMovement(400, 400);

        expect(element.x).toEqual(400);
        expect(element.y).toEqual(400);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300)
          }
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
            getY: jest.fn().mockReturnValue(300)
          }
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
      wrapper = mkWrapper('RectangleDrawable', props);
    });

    describe('snapshot', () => {
      it('renders', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('logic', () => {
      it('calls forceUpdate', () => {
        wrapper.simulate('click');
        expect(forceUpdate).toHaveBeenCalled();
      });

      it('changes x and y', () => {
        element.registerMovement(400, 400);

        expect(element.x).toEqual(400);
        expect(element.y).toEqual(400);
      });

      it('changes session when needed', () => {
        const event = {
          target: {
            getX: jest.fn().mockReturnValue(300),
            getY: jest.fn().mockReturnValue(300)
          }
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
            getY: jest.fn().mockReturnValue(300)
          }
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
        type: 'text-entry'
      }
    ];
    let handleSessionChange = jest.fn();
    let forceUpdate = jest.fn();
    let toggleTextSelected = jest.fn();
    let props;
    let stage;

    beforeEach(() => {
      stage = {
        on: jest.fn(),
        off: jest.fn()
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
        y: 300
      };
      wrapper = mkWrapper('DrawableText', props, 'div');
    });

    describe('snapshot', () => {
      it('renders', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders textAreas', () => {
        element = new drawableClasses['DrawableText'](props);

        wrapper = shallow(<div>{element.renderTextareas()}</div>);

        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('snapshot when there is no value', () => {
      beforeEach(() => {
        props.all.forEach(a => {
          delete a.value;
        });
        wrapper = mkWrapper('DrawableText', props, 'div');
      });
      it('renders', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('logic', () => {
      it('shoud change the all property and call forceUpdate', () => {
        element.setAll([]);

        expect(element.all).toEqual([]);
        expect(forceUpdate).toHaveBeenCalled();
      });

      describe('addNewTextEntry', () => {
        it('shoud add a new element and call the appropriate functions', () => {
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
                type: 'text-entry'
              })
            ])
          );

          expect(stage.on).toHaveBeenCalled();
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
                textareaVisible: false
              })
            ])
          );
        });
      });

      describe('showOnltoggleTextareayTextNodes', () => {
        it('should change the item with the right id in the "all" array and call forceUpdate', () => {
          element.toggleTextarea('gcifqhhimf8k2d6g8hs', true);

          expect(element.all[0]).toEqual(
            expect.objectContaining({
              textVisible: false,
              transformerVisible: false,
              textareaVisible: true
            })
          );

          expect(forceUpdate).toHaveBeenCalled();

          element.toggleTextarea('gcifqhhimf8k2d6g8hs', false);

          expect(element.all[0]).toEqual(
            expect.objectContaining({
              textVisible: true,
              transformerVisible: true,
              textareaVisible: false
            })
          );

          expect(forceUpdate).toHaveBeenCalled();
        });
      });

      describe('initializeDefault', () => {
        it('should make the item with the right id default', () => {
          element.initializeDefault('gcifqhhimf8k2d6g8hs', true);

          expect(element.all[0]).toEqual(
            expect.objectContaining({
              isDefault: false
            })
          );
        });
      });

      describe('saveValue', () => {
        it('should make the item with the right id default and call handleSessionChange', () => {
          const textNode = {
            text: jest.fn()
          };
          const textareaNode = {
            value: 'Foo bar'
          };

          element.saveValue('gcifqhhimf8k2d6g8hs', textNode, textareaNode);

          expect(textNode.text).toHaveBeenCalledWith('Foo bar');
          expect(handleSessionChange).toHaveBeenCalled();

          textareaNode.value = '';

          element.saveValue('gcifqhhimf8k2d6g8hs', textNode, textareaNode);

          expect(element.all).toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                id: 'gcifqhhimf8k2d6g8hs'
              })
            ])
          );
          expect(forceUpdate).toHaveBeenCalled();
          expect(handleSessionChange).toHaveBeenCalled();
        });
      });

      describe('handleMouseEvents', () => {
        it('should call the right functions on mouse down and up', () => {
          element.handleMouseDown();
          expect(toggleTextSelected).toHaveBeenCalledWith(true);

          element.handleMouseUp();
          expect(toggleTextSelected).toHaveBeenCalledWith(false);
        });

        it('should call the right functions onClick', () => {
          element.handleClick(null, 'gcifqhhimf8k2d6g8hs');

          expect(element.all).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                transformerVisible: true
              })
            ])
          );

          expect(forceUpdate).toHaveBeenCalled();
        });

        it('should call the right functions onDblClick', () => {
          const text = {
            id: 'gcifqhhimf8k2d6g8hs',
            isDefault: false
          };

          const textNode = (element[`text_${text.id}`] = {
            _lastPos: {
              x: 200,
              y: 200
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
            width: jest.fn().mockReturnValue(200)
          });
          const textareaNode = (element[`textarea_${text.id}`] = {
            focus: jest.fn(),
            addEventListener: jest.fn(),
            style: {},
            scrollHeight: 205
          });

          const initSpy = jest.spyOn(element, 'initializeDefault');
          const saveValueSpy = jest.spyOn(element, 'saveValue');
          const toggleSpy = jest.spyOn(element, 'toggleTextarea');

          element.handleDblClick(null, text);

          expect(toggleSpy).toHaveBeenCalledWith(text.id, true);

          expect(textareaNode.value).toEqual('foo bar');
          expect(textareaNode.style).toEqual({
            background: 'none',
            border: 'none',
            color: 'green',
            fontFamily: 'FooBarFamily',
            fontSize: '16px',
            height: '208px',
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
            transform: 'translateY(-0px)',
            width: '200px'
          });

          expect(textareaNode.focus).toHaveBeenCalled();
          expect(stage.on).toHaveBeenCalled();
          expect(initSpy).toHaveBeenCalledWith('gcifqhhimf8k2d6g8hs', false);
          expect(forceUpdate).toHaveBeenCalled();
          expect(textareaNode.addEventListener.mock.calls[0][0]).toEqual(
            'keydown'
          );
          expect(textareaNode.addEventListener.mock.calls[1][0]).toEqual(
            'blur'
          );

          const event = {
            keyCode: 13,
            shiftKey: true
          };

          textareaNode.addEventListener.mock.calls[0][1](event);

          // Make sure it's not called the second time
          expect(toggleSpy).toHaveBeenCalledTimes(1);
          expect(saveValueSpy).not.toHaveBeenCalled();

          event.shiftKey = false;

          textareaNode.addEventListener.mock.calls[0][1](event);

          expect(toggleSpy).toHaveBeenCalledWith('gcifqhhimf8k2d6g8hs', false);
          expect(saveValueSpy).toHaveBeenCalledWith(
            'gcifqhhimf8k2d6g8hs',
            textNode,
            textareaNode
          );

          event.keyCode = 27;

          textareaNode.addEventListener.mock.calls[0][1](event);

          expect(toggleSpy).toHaveBeenCalledWith('gcifqhhimf8k2d6g8hs', false);

          const showTextSpy = jest.spyOn(element, 'showOnlyTextNodes');

          event.target = stage;

          stage.on.mock.calls[0][1](event);

          expect(showTextSpy).toHaveBeenCalled();
          expect(saveValueSpy).toHaveBeenCalledWith(
            'gcifqhhimf8k2d6g8hs',
            textNode,
            textareaNode
          );
        });
      });

      describe('handleTransform', () => {
        it('should change attrs when called', () => {
          const textNode = (element[`text_gcifqhhimf8k2d6g8hs`] = {
            setAttrs: jest.fn(),
            width: jest.fn().mockReturnValue(100),
            scaleX: jest.fn().mockReturnValue(1)
          });

          element.handleTransform(null, 'text_gcifqhhimf8k2d6g8hs');

          expect(textNode.setAttrs).toHaveBeenCalledWith({
            width: 100,
            scaleX: 1
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
            off: jest.fn()
          };
          const newProps = {
            ...cloneDeep(props),
            stage: separateStage
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
})
;
