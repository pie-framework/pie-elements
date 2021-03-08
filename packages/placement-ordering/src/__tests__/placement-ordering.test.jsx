import { shallow } from 'enzyme';

import React from 'react';
import { PlacementOrdering, Choice } from '../placement-ordering';
import { buildState, reducer } from '../ordering';

jest.mock('../ordering', () => ({
  buildState: jest.fn().mockReturnValue({}),
  reducer: jest.fn().mockReturnValue({})
}));

describe('PlacementOrdering', () => {
  let wrapper, model, session;
  let choices;
  let correctResponse;
  let onSessionChange;
  const mkWrapper = (mod, session) => {
    onSessionChange = jest.fn();
    session = { value: [], ...session };
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

    return shallow(
      <PlacementOrdering
        model={model}
        session={session}
        classes={{
          placementOrdering: 'placementOrdering'
        }}
        onSessionChange={onSessionChange}
      />,
      {}
    );
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('render', () => {
    it('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('shows toggle', () => {
      let w = mkWrapper({ correctResponse: ['c1', 'c2', 'c3', 'c4'] });
      expect(w).toMatchSnapshot();
    });

    it('snapshot with rationale', () => {
      let w = mkWrapper({ rationale: 'This is rationale.' });

      expect(w).toMatchSnapshot();
    });
  });

  const ordering = d => ({
    opts: {},
    ...d
  });

  describe('logic', () => {
    let response;

    describe('onDropChoice', () => {
      beforeEach(() => {
        response = ['c4', 'c2', 'c3', 'c1'];

        reducer.mockReturnValue({ response });
        wrapper
          .instance()
          .onDropChoice(
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
        wrapper = mkWrapper();

        target = { id: 'c4', type: 'target', index: 3 };
        wrapper.instance().onRemoveChoice(target, {});
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
        wrapper = mkWrapper({
          correctResponse
        });
      });

      describe('when showingCorrect is false', () => {
        beforeEach(() => {
          wrapper.setState({ showingCorrect: false });
          wrapper.instance().createOrdering();
        });

        it('calls buildState with default values', () => {
          expect(buildState).toHaveBeenCalledWith(choices, [], undefined, opts);
        });

        it('calls buildState with session values', () => {
          wrapper.setProps({ session: { value: ['c4', 'c2', 'c3', 'c1'] }});

          wrapper.instance().createOrdering();

          expect(buildState).toHaveBeenCalledWith(choices, ['c4', 'c2', 'c3', 'c1'], undefined, opts);
        });
      });

      describe('when showingCorrect is true', () => {
        let outcomes;

        beforeEach(() => {
          outcomes = correctResponse.map(id => ({ id, outcome: 'correct' }));

          wrapper.setState({ showingCorrect: true });
          wrapper.instance().createOrdering();
        });

        it('calls buildState with default values', () => {
          expect(buildState).toHaveBeenCalledWith(choices, correctResponse, outcomes, opts);
        });
      });
    });

    describe('initSessionIfNeeded', () => {
      describe('with targets', () => {
        it('resets session', () => {
          wrapper.instance().initSessionIfNeeded(wrapper.instance().props);

          expect(onSessionChange).toHaveBeenCalledWith({});
        })
      });

      describe('without targets', () => {
        let value;
        let config;

        beforeEach(() => {
          config = {
            includeTargets: false
          };

          value = choices.map(m => m.id);
          wrapper = mkWrapper({ config });

          wrapper.instance().initSessionIfNeeded(wrapper.instance().props);
        });

        it('calls onSessionChange', () => {
          expect(onSessionChange).toHaveBeenCalledWith({ value });
        });

        it('does not call onSessionChange if session is set', () => {
          wrapper = mkWrapper({ config }, { value });

          wrapper.instance().initSessionIfNeeded(wrapper.instance().props);

          expect(onSessionChange).not.toBeCalled();
        });
      });
    });

    describe('UNSAFE_componentWillReceiveProps', () => {
      beforeEach(() => {
        wrapper = mkWrapper({
          config: {
            includeTargets: false
          }
        });
      });

      it('calls initSessionIfNeeded if includeTargets changes', () => {
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

      it('calls initSessionIfNeeded if choicesNumberChanged changes', () => {
        wrapper.setProps({
          model: {
            ...model,
            choices: choices.slice(0, 2)
          }
        });

        expect(onSessionChange).toHaveBeenCalledWith({ value: ['c1', 'c2']});
      });
    });
  });
});
