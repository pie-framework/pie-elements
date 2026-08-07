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

const sensors = [
  { sensor: PointerSensor, options: {} },
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
    };
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
    if (overData && overData.type === 'drop-zone' && overData.promptId != null) {
      const targetPromptId = overData.promptId;

      if (activeData.type === 'choice' && overData.type === 'drop-zone' && targetPromptId !== undefined) {
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
            // swap items between placeholders
            const temp = session.value[targetPromptId];
            session.value[targetPromptId] = answerId;
            session.value[sourcePromptId] = temp;
          } else if (!targetHasItem) {
            // move item to empty placeholder
            session.value[targetPromptId] = answerId;
            delete session.value[sourcePromptId];
          }
        }
      }

      onSessionChange(session);
    }
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
    const getChoiceLabel = (dragId) => {
      // dragId is like "choice-123" or "target-123"
      const answerId = String(dragId).replace(/^(choice|target)-/, '');
      const answer = config.answers.find((a) => String(a.id) === answerId);

      if (answer?.title) {
        // Strip HTML tags for screen reader
        const text = answer.title.replace(/<[^>]*>/g, '').trim();
        return text || `Answer ${answerId}`;
      }

      return `Answer ${answerId}`;
    };

    const getDropTargetLabel = (dropId) => {
      // dropId is like "drop-456" or "choices-pool"
      if (dropId === 'choices-pool') {
        return { label: 'Choices list', choiceId: null };
      }

      const promptId = String(dropId).replace(/^drop-/, '');
      const promptItem = config.prompts.find((p) => String(p.id) === promptId);
      const label = promptItem?.title
        ? `Response area for ${promptItem.title.replace(/<[^>]*>/g, '').trim()}`
        : `Response area ${promptId}`;
      const choiceId = session.value?.[promptId];

      return { label, choiceId: choiceId || null };
    };

    const announcements = {
      onDragStart({ active }) {
        return `Picked up ${getChoiceLabel(active.id)}. Use Tab to move between response areas, then press Space or Enter to drop.`;
      },

      onDragOver({ active, over }) {
        if (!over) {
          return `${getChoiceLabel(active.id)} is not over a response area.`;
        }

        const target = getDropTargetLabel(over.id);
        const content = target.choiceId ? `Currently contains ${getChoiceLabel(target.choiceId)}.` : 'Currently empty.';

        return `Over ${target.label}. ${content}`;
      },

      onDragEnd({ active, over }) {
        if (!over) {
          return `${getChoiceLabel(active.id)} was returned to its original position.`;
        }

        return `Dropped ${getChoiceLabel(active.id)} in ${getDropTargetLabel(over.id).label}.`;
      },

      onDragCancel({ active }) {
        return `Cancelled. ${getChoiceLabel(active.id)} was returned to its original position.`;
      },
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={this.onDragStart}
        onDragEnd={this.onPlaceAnswer}
        modifiers={[restrictToFirstScrollableAncestor]}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              'Press Space or Enter to pick up this answer choice. Once picked up, use Tab or Shift+Tab to cycle through response areas, or use arrow keys to move it freely. Press Space or Enter to drop, or Escape to cancel.',
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

          <AnswerArea
            instanceId={this.instanceId}
            model={model}
            session={session}
            onRemoveAnswer={(id) => this.onRemoveAnswer(id)}
            disabled={mode !== 'gather'}
            showCorrect={showCorrectAnswer}
          />

          <ChoicesList
            instanceId={this.instanceId}
            model={model}
            session={session}
            disabled={mode !== 'gather'}
            onRemoveAnswer={(id) => this.onRemoveAnswer(id)}
          />

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
