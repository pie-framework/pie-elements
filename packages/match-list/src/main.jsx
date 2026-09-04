import React from 'react';
import PropTypes from 'prop-types';
import { swap } from '@pie-lib/drag';
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, KeyboardCode, rectIntersection } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { closestDroppableKeyboardCoordinates } from './keyboard-coordinates';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Feedback, PreviewPrompt } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';
import { findKey, isUndefined, uniqueId } from 'lodash-es';
import AnswerArea from './answer-area';
import ChoicesList from './choices-list';
import { Answer } from './answer';

// A click that lands right after a real drag gesture ends (pointer drag-and-drop, or
// the browser's own synthetic click for a keyboard Space/Enter) must be ignored by the
// new click-to-select/click-to-place handlers below, or it would immediately reopen or
// re-trigger a selection for a drag that just completed.
const CLICK_AFTER_DRAG_GUARD_MS = 250;

const sensors = [
  // Without an activationConstraint, dnd-kit's PointerSensor calls its internal
  // handleStart() synchronously on pointerdown, before any movement — meaning a plain
  // click is itself "activated" as a drag. Once activated, dnd-kit adds a capture-phase
  // document click listener that calls stopPropagation() (to suppress the native
  // "ghost click" a real drag leaves behind), which also swallows the click for a
  // gesture with zero movement, before it ever reaches our own onClick handlers below.
  // Requiring 8px of movement (matching @pie-lib/drag's DragProvider convention used
  // elsewhere in this codebase) defers activation until an actual drag gesture is
  // underway, so a plain click passes through untouched.
  { sensor: PointerSensor, options: { activationConstraint: { distance: 8 } } },
  {
    sensor: KeyboardSensor,
    options: {
      coordinateGetter: closestDroppableKeyboardCoordinates,
      keyboardCodes: {
        start: [KeyboardCode.Space, KeyboardCode.Enter],
        cancel: [KeyboardCode.Esc],
        end: [KeyboardCode.Space, KeyboardCode.Enter],
      },
    },
  },
];

const MainContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: color.text(),
  backgroundColor: color.background(),
});

const InteractiveRegion = styled('div')({
  width: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
});

// A block child of a scroll port is sized to the scroll port, so it has to opt out explicitly for
// the content to be able to overflow. min-content keeps the rows and the pool the same width.
const InteractiveRegionContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 'min-content',
});

export class Main extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    onSessionChange: PropTypes.func,
    model: PropTypes.object.isRequired,
    prompt: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.instanceId = uniqueId();
    this.state = {
      showCorrectAnswer: false,
      draggingElement: null,
      selectedAnswer: null,
    };
    this.lastDragEndAt = 0;
  }

  onRemoveAnswer(id) {
    const { session, onSessionChange } = this.props;

    session.value[id] = undefined;

    onSessionChange(session);
  }

  onDragStart = (event) => {
    const { active } = event;

    if (active?.data?.current) {
      let rect = null;
      const node = active.node?.current;

      if (node) {
        const { width, height } = node.getBoundingClientRect();
        rect = { width, height };
      }

      this.setState({
        draggingElement: { ...active.data.current, rect },
      });
      this.selectAnswer(active.data.current);
    }
  };

  onDragCancel = () => {
    this.setState({ draggingElement: null });
    this.cancelSelection();
    this.lastDragEndAt = Date.now();
  };

  // Pure placement logic
  placeAnswer = (activeData, overData) => {
    if (!activeData || !overData) {
      return;
    }

    const { session, onSessionChange, model } = this.props;
    const {
      config: { duplicates },
    } = model;

    if (isUndefined(session.value)) {
      session.value = {};
    }

    // dropping a placed answer back to the choices pool = remove it
    if (overData.type === 'choices-pool' && activeData.promptId !== undefined) {
      session.value[activeData.promptId] = undefined;
      onSessionChange(session);
      return;
    }

    const answerId = activeData.id;
    const sourcePromptId = activeData.promptId;

    // Handle dropping onto a drop zone
    if (overData.type === 'drop-zone' && overData.promptId != null) {
      const targetPromptId = overData.promptId;

      if (activeData.type === 'choice' && targetPromptId !== undefined) {
        // check if this choice is already placed somewhere
        const existingPlacement = findKey(session.value, (val) => val === answerId);

        if (existingPlacement && !duplicates) {
          // swap if duplicates not allowed
          session.value = swap(session.value, existingPlacement, targetPromptId);
        } else {
          // place answer
          session.value[targetPromptId] = answerId;
        }
      }
      // Handle moving a placed item (target) to another drop zone
      else if (activeData.type === 'target' && sourcePromptId != null) {
        // If moving to a different placeholder
        if (sourcePromptId !== targetPromptId) {
          const targetHasItem = session.value[targetPromptId] != null;

          if (targetHasItem && !duplicates) {
            // Without duplicates each choice is placed at most once, so trading the two
            // answers is the only way to fill the target without dropping the answer it
            // already holds.
            const temp = session.value[targetPromptId];
            session.value[targetPromptId] = answerId;
            session.value[sourcePromptId] = temp;
          } else {
            // Empty target, or duplicates allowed: the moved answer takes the target and
            // the source area is vacated. Any answer displaced from the target is simply
            // available in the pool again — which with duplicates enabled always lists
            // every choice anyway — matching how the choice -> occupied target path above
            // already behaves. Leaving this case unhandled (as it was) made moving a
            // placed answer onto an occupied area a silent no-op whenever duplicates
            // were enabled.
            session.value[targetPromptId] = answerId;
            delete session.value[sourcePromptId];
          }
        }
      }

      onSessionChange(session);
    }
  };

  onPlaceAnswer = (event) => {
    this.setState({ draggingElement: null });
    const { active, over } = event;

    if (!active) {
      return;
    }

    const activeData = active.data.current;
    const overData = over?.data.current;

    if (!activeData) {
      return;
    }

    this.placeAnswer(activeData, overData);
    this.cancelSelection();
    this.lastDragEndAt = Date.now();
  };

  isSameAnswer = (a, b) => !!a && !!b && a.type === b.type && a.id === b.id && a.promptId === b.promptId;

  // Unconditionally selects (used by the drag-start mirror, and internally when
  // switching from one choice to another).
  selectAnswer = (data) => {
    this.setState({ selectedAnswer: data });
  };

  // Click-to-select semantics: selecting the currently-selected answer again clears
  // the selection instead of re-selecting it.
  toggleAnswerSelection = (data) => {
    this.setState((state) => ({
      selectedAnswer: this.isSameAnswer(state.selectedAnswer, data) ? null : data,
    }));
  };

  cancelSelection = () => {
    this.setState({ selectedAnswer: null });
  };

  // If a real dnd-kit drag (started via keyboard Space/Enter) is still live when a
  // click completes the placement below, it needs to be cleanly ended — otherwise
  // dnd-kit would still think a drag is in progress (still listening for Tab/arrow/
  // Space/Escape, still showing the drag overlay) for a placement the click already
  // performed. Escape is already configured as this sensor's cancel key, and
  // dispatching it as a real DOM KeyboardEvent is how dnd-kit's own document-level
  // listener is reached from outside its sensor. onDragCancel is intentionally not
  // wired to redo any placement — it only resets local UI state — so this is safe to
  // call unconditionally, including when no drag is actually live (dnd-kit simply has
  // no listener attached in that case, and the dispatch is a no-op).
  endAnyLiveKeyboardDrag = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true, cancelable: true }));
  };

  placeSelectedAnswer = (overData) => {
    const { selectedAnswer } = this.state;

    if (!selectedAnswer) {
      return;
    }

    this.placeAnswer(selectedAnswer, overData);
    this.cancelSelection();
    this.endAnyLiveKeyboardDrag();
    this.lastDragEndAt = Date.now();
  };

  isClickSoonAfterDragEnd = () => Date.now() - this.lastDragEndAt < CLICK_AFTER_DRAG_GUARD_MS;

  onChoiceClick = (data) => {
    if (this.isClickSoonAfterDragEnd()) {
      return;
    }

    this.toggleAnswerSelection(data);
  };

  onPlacementClick = (overData) => {
    if (this.isClickSoonAfterDragEnd()) {
      return;
    }

    this.placeSelectedAnswer(overData);
  };

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  renderDragOverlay = () => {
    const { draggingElement } = this.state;

    if (!draggingElement) return null;

    return (
      <Answer
        id={draggingElement.id}
        title={draggingElement.value}
        disabled={false}
        isDragging={false}
        style={
          draggingElement.rect
            ? { width: draggingElement.rect.width, height: draggingElement.rect.height, boxSizing: 'border-box' }
            : {}
        }
      />
    );
  };

  render() {
    const { showCorrectAnswer } = this.state;
    const { model, session } = this.props;
    const { config, mode } = model;
    const { prompt, language } = config;

    // Helpers for accessible announcements
    const getChoiceLabel = (answerId) => {
      const answer = config.answers.find((a) => String(a.id) === String(answerId));

      if (answer?.title) {
        // Strip HTML tags for screen reader
        const text = answer.title.replace(/<[^>]*>/g, '').trim();
        return text || `Answer ${answerId}`;
      }

      return `Answer ${answerId}`;
    };

    // Read the dragged choice off the tile's own drag data rather than parsing it back
    // out of the drag id: a drag id identifies the tile (a response area, for a placed
    // answer — see buildDragId in ./answer), not the choice the tile holds.
    const getDraggedLabel = (active) => getChoiceLabel(active?.data?.current?.id);

    const getDropTargetLabel = (over) => {
      const overData = over?.data?.current;

      if (overData?.type === 'choices-pool' || over?.id === 'choices-pool') {
        return { label: 'Choices list', choiceId: null };
      }

      // Prefer the droppable's own data; fall back to the id for a droppable registered
      // without any (the id shape is "drop-{promptId}").
      const promptId = overData?.promptId != null ? overData.promptId : String(over?.id).replace(/^drop-/, '');
      const promptItem = config.prompts.find((p) => String(p.id) === String(promptId));
      const label = promptItem?.title
        ? `Response area for ${promptItem.title.replace(/<[^>]*>/g, '').trim()}`
        : `Response area ${promptId}`;
      const choiceId = session.value?.[promptId];

      return { label, choiceId: choiceId != null ? choiceId : null };
    };

    const announcements = {
      onDragStart({ active }) {
        return `Picked up ${getDraggedLabel(active)}. Use Tab to move between response areas, then press Space or Enter to drop.`;
      },

      onDragOver({ active, over }) {
        if (!over) {
          return `${getDraggedLabel(active)} is not over a response area.`;
        }

        const target = getDropTargetLabel(over);
        const content = target.choiceId ? `Currently contains ${getChoiceLabel(target.choiceId)}.` : 'Currently empty.';

        return `Over ${target.label}. ${content}`;
      },

      onDragEnd({ active, over }) {
        if (!over) {
          return `${getDraggedLabel(active)} was returned to its original position.`;
        }

        return `Dropped ${getDraggedLabel(active)} in ${getDropTargetLabel(over).label}.`;
      },

      onDragCancel({ active }) {
        return `Cancelled. ${getDraggedLabel(active)} was returned to its original position.`;
      },
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={this.onDragStart}
        onDragEnd={this.onPlaceAnswer}
        onDragCancel={this.onDragCancel}
        modifiers={[restrictToFirstScrollableAncestor]}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              'Press Space or Enter to pick up this answer choice. Once picked up, use Tab or Shift+Tab to cycle through response areas, or use arrow keys to move it freely. Press Space or Enter to drop, or Escape to cancel. You can also click an answer choice to select it, then click a response area to place it there.',
          },
        }}
      >
        <MainContainer>
          <PreviewPrompt className="prompt" prompt={prompt} />

          <CorrectAnswerToggle
            show={mode === 'evaluate'}
            toggled={showCorrectAnswer}
            onToggle={this.toggleShowCorrect}
            language={language}
          />

          <InteractiveRegion>
            <InteractiveRegionContent>
              <AnswerArea
                instanceId={this.instanceId}
                model={model}
                session={session}
                onRemoveAnswer={(id) => this.onRemoveAnswer(id)}
                disabled={mode !== 'gather'}
                showCorrect={showCorrectAnswer}
                selectedAnswer={this.state.selectedAnswer}
                onChoiceClick={this.onChoiceClick}
                onPlacementClick={this.onPlacementClick}
              />

              <ChoicesList
                instanceId={this.instanceId}
                model={model}
                session={session}
                disabled={mode !== 'gather'}
                onRemoveAnswer={(id) => this.onRemoveAnswer(id)}
                selectedAnswer={this.state.selectedAnswer}
                onChoiceClick={this.onChoiceClick}
                onPlacementClick={this.onPlacementClick}
              />
            </InteractiveRegionContent>
          </InteractiveRegion>

          {model.correctness && model.feedback && !showCorrectAnswer && (
            <Feedback correctness={model.correctness.correctness} feedback={model.feedback} />
          )}
        </MainContainer>
        <DragOverlay>{this.renderDragOverlay()}</DragOverlay>
      </DndContext>
    );
  }
}

export default Main;
