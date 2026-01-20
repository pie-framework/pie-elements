import { render } from '@testing-library/react';
import React from 'react';
import { PlacementOrdering, Choice } from '../placement-ordering';
import { buildState, reducer } from '../ordering';

jest.mock('../ordering', () => ({
  buildState: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] }),
  reducer: jest.fn().mockReturnValue({ tiles: [], choices: [], response: [] })
}));

describe('PlacementOrdering', () => {
  let wrapper, model, session;
  let choices;
  let correctResponse;
  let onSessionChange;

  const mkWrapper = (mod, sess) => {
    onSessionChange = jest.fn();
    session = { value: [], ...sess };
    choices = [
      {
        id: 'c1',
        label: 'C1'
      },
      {
        id: 'c2',
        label: 'C2'
      },
      {
        id: 'c3',
        label: 'C3'
      },
      {
        id: 'c4',
        label: 'C4'
      }
    ];
    correctResponse = ['c1', 'c2', 'c3', 'c4'];
    model = {
      config: {
        includeTargets: true
      },
      choices,
      ...mod
    };

    return render(
      <PlacementOrdering
        model={model}
        session={session}
        classes={{
          placementOrdering: 'placementOrdering'
        }}
        onSessionChange={onSessionChange}
      />
    );
  };

  const createInstance = (mod, sess) => {
    onSessionChange = jest.fn();
    session = { value: [], ...sess };
    choices = [
      {
        id: 'c1',
        label: 'C1'
      },
      {
        id: 'c2',
        label: 'C2'
      },
      {
        id: 'c3',
        label: 'C3'
      },
      {
        id: 'c4',
        label: 'C4'
      }
    ];
    correctResponse = ['c1', 'c2', 'c3', 'c4'];
    model = {
      config: {
        includeTargets: true
      },
      choices,
      ...mod
    };

    const props = {
      model,
      session,
      classes: {
        placementOrdering: 'placementOrdering'
      },
      onSessionChange
    };

    const instance = new PlacementOrdering(props);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    instance.props = props;
    return instance;
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  const ordering = d => ({
    opts: {},
    ...d
  });

  describe('logic', () => {
    let response;
    let instance;

    describe('onDropChoice', () => {
      beforeEach(() => {
        response = ['c4', 'c2', 'c3', 'c1'];

        reducer.mockReturnValue({ response });
        instance = createInstance();
        instance.onDropChoice(
          { id: 'c4', type: 'choice' },
          { id: 'c1', type: 'choice' },
          ordering({ tiles: [{ id: 'c1', type: 'choice' }] })
        );
      });

      it('calls reducer', () =>
        expect(reducer).toHaveBeenCalledWith(
          {
            type: 'move',
            from: { id: 'c1', type: 'choice' },
            to: { id: 'c4', type: 'choice' }
          },
          expect.anything()
        ));

      it('dropping choices updates the order', () => {
        expect(onSessionChange).toHaveBeenCalledWith({ value: response });
      });
    });

    describe('onRemoveChoice', () => {
      let target;
      beforeEach(() => {
        reducer.mockReset();
        reducer.mockReturnValue({ response: ['c1', 'c2', 'c3'] });
        instance = createInstance();

        target = { id: 'c4', type: 'target', index: 3 };
        instance.onRemoveChoice(target, {});
      });

      it('calls reducer', () => {
        expect(reducer).toHaveBeenCalledWith(
          { type: 'remove', target },
          expect.anything()
        );
      });

      it('calls onSessionChange', () => {
        expect(onSessionChange).toHaveBeenCalledWith({
          value: ['c1', 'c2', 'c3']
        });
      });
    });

    describe('createOrdering', () => {
      let opts = { includeTargets: true, allowSameChoiceInTargets: undefined };

      beforeEach(() => {
        instance = createInstance({
          correctResponse
        });
      });

      describe('when showingCorrect is false', () => {
        beforeEach(() => {
          instance.state.showingCorrect = false;
          instance.createOrdering();
        });

        it('calls buildState with default values', () => {
          expect(buildState).toHaveBeenCalledWith(choices, [], undefined, opts);
        });

        it('calls buildState with session values', () => {
          instance.props = { ...instance.props, session: { value: ['c4', 'c2', 'c3', 'c1'] } };
          instance.createOrdering();

          expect(buildState).toHaveBeenCalledWith(choices, ['c4', 'c2', 'c3', 'c1'], undefined, opts);
        });
      });

      describe('when showingCorrect is true', () => {
        let outcomes;

        beforeEach(() => {
          outcomes = correctResponse.map(id => ({ id, outcome: 'correct' }));

          instance.state.showingCorrect = true;
          instance.createOrdering();
        });

        it('calls buildState with default values', () => {
          expect(buildState).toHaveBeenCalledWith(choices, correctResponse, outcomes, opts);
        });
      });
    });

    xdescribe('componentDidMount', () => {
      beforeEach(() => {
        wrapper = mkWrapper({
          config: {
            includeTargets: false
          }
        });
      });

      it('does not call initSessionIfNeeded if session is valid (if include targets is true)', () => {
        wrapper.setProps({
          model: {
            ...model,
            config: {
              includeTargets: true
            }
          },
          session: {
            value: []
          }
        });

        expect(onSessionChange).not.toBeCalled();
      });

      it('does not call initSessionIfNeeded if session is valid (if include targets is false)', () => {
        wrapper.setProps({
          model: {
            ...model,
            config: {
              includeTargets: false
            }
          },
          session: {
            value: ['c1', 'c2', 'c4', 'c3']
          }
        });

        expect(onSessionChange).not.toBeCalled();
      });

      it('calls initSessionIfNeeded if session is not valid', () => {
        wrapper.setProps({
          model: {
            ...model,
            config: {
              includeTargets: false
            }
          },
          session: {
            value: []
          }
        });

        expect(onSessionChange).toHaveBeenCalledWith({ value: model.choices.map(({ id }) => id) });
      });
    })

    xdescribe('UNSAFE_componentWillReceiveProps', () => {
      it('calls onSessionChange if includeTargets changes to false and session will not be valid anymore', () => {
        wrapper = mkWrapper(
          {
            config: {
              includeTargets: true
            }
          },
          { value: ['c1', null] }
        );

        wrapper.setProps({
          model: {
            ...model,
            config: {
              includeTargets: false
            }
          }
        });

        expect(onSessionChange).toHaveBeenCalledWith({
          value: wrapper.instance().props.model.choices.map(({ id }) => id)
        });
      });

      it('does not call onSessionChange if includeTargets changes to false, but session will be valid', () => {
        wrapper = mkWrapper(
          {
            config: {
              includeTargets: true
            }
          },
          { value: ['c1', 'c2', 'c3', 'c4'] }
        );

        wrapper.setProps({
          model: {
            ...model,
            config: {
              includeTargets: false
            }
          }
        });

        expect(onSessionChange).not.toHaveBeenCalledWith()
      });

      it('calls onSessionChange if targets changed to true, and session is the default session', () => {
        const initialSession = ['c1', 'c3', 'c4', 'c2'];
        wrapper = mkWrapper(
          {
            config: {
              includeTargets: false
            }
          },
          { value: initialSession }
        );
        wrapper.instance().setState({
          defaultSessionValue: initialSession
        });

        wrapper.setProps({
          model: {
            ...model,
            config: {
              includeTargets: true
            }
          }
        });

        expect(onSessionChange).toHaveBeenCalledWith({});
      });

      it('does not call onSessionChange if targets changed to true, and session is the not default session', () => {
        const initialSession = ['c1', 'c3', 'c4', 'c2'];

        wrapper = mkWrapper(
          {
            config: {
              includeTargets: false
            }
          },
          { value: initialSession }
        );

        wrapper.setProps({
          model: {
            ...model,
            config: {
              includeTargets: true
            }
          }
        });

        expect(onSessionChange).not.toHaveBeenCalled();
      });

      it('calls initSessionIfNeeded if choicesNumberChanged changes', () => {
        const initialSession = ['c1', 'c3', 'c4', 'c2'];

        wrapper = mkWrapper(
          {
            config: {
              includeTargets: false
            }
          },
          { value: initialSession }
        );

        wrapper.setProps({
          model: {
            ...model,
            choices: model.choices.slice(0, 2)
          }
        });

        expect(onSessionChange).toHaveBeenCalledWith({ value: ['c1', 'c2'] });
      });
      it('calls initSessionIfNeeded if choicesOrderChanged changes', () => {
        const initialSession = ['c1', 'c3', 'c4', 'c2'];

        wrapper = mkWrapper(
            {
              config: {
                includeTargets: false
              }
            },
            { value: initialSession }
        );

        wrapper.setProps({
          model: {
            ...model,
            choices: ['c3', 'c4', 'c1', 'c2'],
          }
        });

        expect(onSessionChange).toHaveBeenCalledWith({ value: ['c3', 'c4', 'c1', 'c2'] });
      });
    });

    xdescribe('initSessionIfNeeded', () => {
      beforeEach(() => {
        wrapper = mkWrapper({
          config: {
            includeTargets: false
          }
        });
      });

      it('removes session value if targets included', () => {
        const initialProps = wrapper.instance().props;

        wrapper.instance().initSessionIfNeeded({
          ...initialProps,
          model: {
            ...initialProps.model,
            config: {
              includeTargets: true
            }
          },
          session: {
            value: [1, 2, 3, 4]
          }
        })

        expect(onSessionChange).toBeCalledWith({});
      });

      it('updates session value with model choices ids if targets not included', () => {
        const initialProps = wrapper.instance().props;

        wrapper.instance().initSessionIfNeeded({
          ...initialProps,
          model: {
            ...initialProps.model,
            config: {
              includeTargets: false
            }
          },
          session: {
            value: [1, 2, 3, 4]
          }
        })

        expect(onSessionChange).toBeCalledWith({ value: initialProps.model.choices.map(({ id }) => id) });
      });
    });
  });
});
