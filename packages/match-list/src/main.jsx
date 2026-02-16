import React from 'react';
import PropTypes from 'prop-types';
import { swap } from '@pie-lib/drag';
import { DndContext } from '@dnd-kit/core';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { color, Feedback, PreviewPrompt } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';
import { findKey, isUndefined, uniqueId } from 'lodash-es';
import AnswerArea from './answer-area';
import ChoicesList from './choices-list';

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
    };
  }

  onRemoveAnswer(id) {
    const { session, onSessionChange } = this.props;

    session.value[id] = undefined;

    onSessionChange(session);
  }

  onPlaceAnswer = (event) => {
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

    const answerId = activeData.id;
    const sourcePromptId = activeData.promptId;

    // Handle dropping onto a drop zone
    if (overData && overData.type === 'drop-zone' && overData.promptId != null) {
      const targetPromptId = overData.promptId;

      // Handle dropping a choice onto a drop zone
      if (activeData.type === 'choice') {
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
    // Handle dropping outside (remove from placeholder if it's a target)
    else if (activeData.type === 'target' && sourcePromptId != null) {
      // Remove item from its current placement
      delete session.value[sourcePromptId];
      onSessionChange(session);
    }
  };

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  render() {
    const { showCorrectAnswer } = this.state;
    const { model, session } = this.props;
    const { config, mode } = model;
    const { prompt, language } = config;

    return (
      <DndContext onDragEnd={this.onPlaceAnswer}>
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
      </DndContext>
    );
  }
}

export default Main;
