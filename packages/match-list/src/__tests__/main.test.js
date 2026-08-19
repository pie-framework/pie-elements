import * as React from 'react';
import { render } from '@testing-library/react';
import { Main } from '../main';
import { model } from '../../docs/demo/config';

jest.mock('../answer-area', () => (props) => <div data-testid="answer-area" {...props} />);
jest.mock('../choices-list', () => (props) => <div data-testid="choices-list" {...props} />);
jest.mock('@pie-lib/correct-answer-toggle', () => (props) => <div data-testid="correct-answer-toggle" {...props} />);
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
  },
  Feedback: (props) => <div data-testid="feedback" {...props} />,
  PreviewPrompt: (props) => <div data-testid="preview-prompt">{props.children}</div>,
}));
jest.mock('@pie-lib/drag', () => ({
  swap: (value, from, to) => {
    const newValue = { ...value };
    const temp = newValue[from];
    newValue[from] = newValue[to];
    newValue[to] = temp;
    return newValue;
  },
}));

describe('Main', () => {
  const onSessionChange = jest.fn();
  const defaultProps = {
    model: model('1'),
    session: {
      value: [1, 4, 3, 2],
    },
    classes: {},
    onSessionChange,
  };

  const wrapper = (props = {}) => {
    return render(<Main {...defaultProps} {...props} />);
  };

  const createInstance = (props = {}) => {
    const instanceProps = {
      ...defaultProps,
      ...props,
    };
    const instance = new Main(instanceProps);
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });
    return instance;
  };

  describe('logic', () => {
    describe('onRemoveAnswer', () => {
      it('should call onSessionChange with appropriate values', () => {
        const instance = createInstance();
        instance.onRemoveAnswer(0);
        expect(onSessionChange).toHaveBeenCalledWith({
          value: [undefined, 4, 3, 2],
        });
      });
    });

    describe('onPlaceAnswer', () => {
      it('should call onSessionChange with appropriate values', () => {
        const instance = createInstance();
        instance.onPlaceAnswer({
          active: {
            data: {
              current: { type: 'choice', id: 5 },
            },
          },
          over: {
            data: {
              current: { type: 'drop-zone', promptId: 0 },
            },
          },
        });
        expect(onSessionChange).toHaveBeenCalled();
      });
    });

    describe('toggleShowCorrect', () => {
      it('should change state the value for showCorrectAnswer to true', () => {
        const instance = createInstance();
        instance.toggleShowCorrect();
        expect(instance.state.showCorrectAnswer).toBe(true);
      });
    });

    describe('click-to-select / click-to-place', () => {
      const choiceA = { type: 'choice', id: 'a', instanceId: 'i1', value: 'A', promptId: undefined };
      const choiceB = { type: 'choice', id: 'b', instanceId: 'i1', value: 'B', promptId: undefined };

      describe('onChoiceClick (select/switch/deselect)', () => {
        it('selects an answer when nothing is selected', () => {
          const instance = createInstance();
          instance.onChoiceClick(choiceA);
          expect(instance.state.selectedAnswer).toEqual(choiceA);
        });

        it('deselects when clicking the currently-selected answer again', () => {
          const instance = createInstance();
          instance.onChoiceClick(choiceA);
          instance.onChoiceClick(choiceA);
          expect(instance.state.selectedAnswer).toBeNull();
        });

        it('switches selection when clicking a different answer', () => {
          const instance = createInstance();
          instance.onChoiceClick(choiceA);
          instance.onChoiceClick(choiceB);
          expect(instance.state.selectedAnswer).toEqual(choiceB);
        });

        it('ignores a click that lands immediately after a drag ended', () => {
          const instance = createInstance();
          instance.lastDragEndAt = Date.now();
          instance.onChoiceClick(choiceA);
          expect(instance.state.selectedAnswer).toBeNull();
        });
      });

      describe('onPlacementClick (place the selected answer)', () => {
        it('does nothing when no answer is selected', () => {
          onSessionChange.mockClear();
          const instance = createInstance();
          instance.onPlacementClick({ type: 'drop-zone', promptId: 0 });
          expect(onSessionChange).not.toHaveBeenCalled();
        });

        it('places the selected choice into an empty response area and clears the selection', () => {
          const instance = createInstance({ session: { value: {} } });
          instance.onChoiceClick(choiceA);
          instance.onPlacementClick({ type: 'drop-zone', promptId: 0 });

          expect(onSessionChange).toHaveBeenCalledWith({ value: { 0: 'a' } });
          expect(instance.state.selectedAnswer).toBeNull();
        });

        it('moving into an occupied response area displaces the previous occupant back to the pool', () => {
          // "Return to the pool" happens implicitly: once slot 0's value is overwritten,
          // 'existing' no longer appears anywhere in session.value, so ChoicesList's own
          // filter (see choices-list.jsx) makes it reappear in the pool — no separate
          // "move it back" step is needed here, matching the existing drag-and-drop path.
          const instance = createInstance({ session: { value: { 0: 'existing' } } });
          instance.onChoiceClick(choiceA);
          instance.onPlacementClick({ type: 'drop-zone', promptId: 0 });

          expect(onSessionChange).toHaveBeenCalledWith({ value: { 0: 'a' } });
        });

        it('ignores a click that lands immediately after a drag ended', () => {
          const instance = createInstance({ session: { value: {} } });
          instance.onChoiceClick(choiceA);
          instance.lastDragEndAt = Date.now();
          onSessionChange.mockClear();
          instance.onPlacementClick({ type: 'drop-zone', promptId: 0 });

          expect(onSessionChange).not.toHaveBeenCalled();
          // Selection itself is untouched by the guard — only the placement is skipped.
          expect(instance.state.selectedAnswer).toEqual(choiceA);
        });
      });

      describe('cross-modal: keyboard selection, then mouse placement', () => {
        it('mirrors a real drag start into selectedAnswer, then a placement click completes it and ends the live drag', () => {
          const instance = createInstance({ session: { value: {} } });
          const dispatchSpy = jest.spyOn(document, 'dispatchEvent');

          // Tab+Space/Enter on a choice starts a real dnd-kit drag; onDragStart mirrors it.
          instance.onDragStart({ active: { data: { current: choiceA } } });
          expect(instance.state.selectedAnswer).toEqual(choiceA);

          // Mouse click on a response area completes the placement.
          instance.onPlacementClick({ type: 'drop-zone', promptId: 0 });

          expect(onSessionChange).toHaveBeenCalledWith({ value: { 0: 'a' } });
          expect(instance.state.selectedAnswer).toBeNull();
          // The still-live keyboard drag is cleanly ended via a synthetic Escape, so
          // dnd-kit doesn't keep listening for further Tab/arrow/Space/Escape input for
          // a drag the click already resolved.
          const dispatchedEvent = dispatchSpy.mock.calls[dispatchSpy.mock.calls.length - 1][0];
          expect(dispatchedEvent.code).toBe('Escape');

          dispatchSpy.mockRestore();
        });
      });

      describe('cross-modal: mouse selection, then keyboard placement', () => {
        it('a click-based selection is placed normally when the real dnd-kit drag ends', () => {
          const instance = createInstance({ session: { value: {} } });

          instance.onChoiceClick(choiceA);
          expect(instance.state.selectedAnswer).toEqual(choiceA);

          // Tab+Space/Enter on the response area ends the (keyboard-started) drag as usual.
          instance.onPlaceAnswer({
            active: { data: { current: choiceA } },
            over: { data: { current: { type: 'drop-zone', promptId: 0 } } },
          });

          expect(onSessionChange).toHaveBeenCalledWith({ value: { 0: 'a' } });
          expect(instance.state.selectedAnswer).toBeNull();
        });
      });
    });

    describe('onDragCancel', () => {
      it('clears the mirrored selection and does not change the session', () => {
        const instance = createInstance();
        instance.onDragStart({ active: { data: { current: { type: 'choice', id: 'a' } } } });
        expect(instance.state.selectedAnswer).not.toBeNull();

        onSessionChange.mockClear();
        instance.onDragCancel();

        expect(instance.state.selectedAnswer).toBeNull();
        expect(instance.state.draggingElement).toBeNull();
        expect(onSessionChange).not.toHaveBeenCalled();
      });
    });
  });
});
