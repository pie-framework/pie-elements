import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debug from 'debug';
import uniqueId from 'lodash/uniqueId';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import { styled } from '@mui/material/styles';

import { Collapsible, color, Feedback, hasMedia, hasText, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import Translator from '@pie-lib/translator';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { DragProvider } from '@pie-lib/drag';

import { HorizontalTiler, VerticalTiler } from './tiler';
import { buildState, reducer } from './ordering';
import { haveSameValuesButDifferentOrder } from './utils';

const { translator } = Translator;

const log = debug('pie-elements:placement-ordering');

const PlacementOrderingContainer = styled('div')(({ theme }) => ({
  color: color.text(),
  backgroundColor: color.background(),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
}));

const StyledPrompt = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const StyledNote = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));

const StyledToggle = styled(CorrectAnswerToggle)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  alignSelf: 'flex-start',
}));

const OrderingTiler = (props) => {
  const { tiler: Comp, ordering, onDropChoice, onRemoveChoice, ...compProps } = props;

  return (
    <Comp
      {...compProps}
      tiles={ordering.tiles}
      onDropChoice={(t, s) => onDropChoice(t, s, ordering)}
      onRemoveChoice={(t) => onRemoveChoice(t, ordering)}
    />
  );
};

OrderingTiler.propTypes = {
  tiler: PropTypes.func,
  ordering: PropTypes.any,
  onDropChoice: PropTypes.func,
  onRemoveChoice: PropTypes.func,
};

export class PlacementOrdering extends React.Component {
  static propTypes = {
    onSessionChange: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    session: PropTypes.oneOfType([PropTypes.array.isRequired, PropTypes.object.isRequired]),
  };

  constructor(props) {
    super(props);

    this.instanceId = uniqueId();

    const { value, needsReset } = this.validateSession(props);

    this.state = {
      showingCorrect: false,
    };

    const { model } = props || {};
    const { env } = model || {};
    const { mode } = env || {};

    if (needsReset && mode === 'gather') {
      this.props.onSessionChange({
        ...props.session,
        value,
      });
    }
  }

  toggleCorrect = (showingCorrect) => this.setState({ showingCorrect });

  componentDidUpdate() {
    //eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  validateSession = ({ model, session }, areChoicesShuffled = false) => {
    const { config, choices } = model || {};
    const { includeTargets } = config || {};
    const choicesIds = choices.map((c) => c.id);

    let { value } = session || {};
    let needsReset;

    if (!includeTargets) {
      // Use all choice IDs if choices were shuffled or session is missing/invalid
      const sessionMissing = !value || !value.length;
      if (sessionMissing || areChoicesShuffled) {
        // if there's no value on session in No Targets Mode, we need to set an initial session
        value = choicesIds;
      } else {
        // in No Targets Mode, all choice ids need to be used
        const missingChoiceIds = difference(choicesIds, value);
        // this is the case that handles extra choice ids in session
        const extraChoiceIds = difference(value, choicesIds);

        if (missingChoiceIds.length || extraChoiceIds.length) {
          value = choicesIds;
        }
      }

      needsReset = !isEqual(session.value, value);
    } else {
      // in Targets Area selected, it's important to check the length of session
      const sessionIsMismatched = value && value.length !== choicesIds.length;
      if (sessionIsMismatched) {
        needsReset = true;

        // if choices were added, add value in session
        if (value.length < choicesIds.length) {
          value = value.concat(new Array(choicesIds.length - value.length));
        } else {
          // if choices were removed, make sure to remove from session as well
          value = value.filter((cId) => choicesIds.includes(cId));
        }
      }
    }

    if (needsReset) {
      // eslint-disable-next-line no-console
      console.warn('This session is not valid anymore. It will be reset.');
    }

    return { value, needsReset };
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model: nextModel = {} } = nextProps || {};
    const { model: currentModel = {} } = this.props || {};
    const { correctResponse, config, choices: nextChoices = [], env } = nextModel;
    const { includeTargets } = config || {};

    const newState = {};

    const isLanguageChanged = currentModel.language && currentModel.language !== nextModel.language;
    const isDefaultNote =
      currentModel.note &&
      currentModel.note === translator.t('common:commonCorrectAnswerWithAlternates', { lng: currentModel.language });

    // check if the note is the default one for prev language and change to the default one for new language
    // this check is necessary in order to diferanciate between default and authour defined note
    // and only change between languages for default ones
    if (isLanguageChanged && isDefaultNote) {
      currentModel.note = translator.t('common:commonCorrectAnswerWithAlternates', { lng: nextModel.language });
    }

    if (!correctResponse) {
      newState.showingCorrect = false;
    }

    //PD-4924
    // show student choices same order as in model when teacher changes student choices order
    // for cases when student view and instructor view are on same page
    const areChoicesShuffled = haveSameValuesButDifferentOrder(nextChoices, currentModel.choices);

    const validatedSession = this.validateSession(nextProps, areChoicesShuffled);
    let { value, needsReset } = validatedSession;

    const newSession = {
      ...nextProps.session,
      value,
    };
    const includeTargetsChanged = currentModel.config?.includeTargets !== includeTargets;

    if (includeTargets && includeTargetsChanged) {
      needsReset = true;

      delete newSession.value;
    }

    this.setState(newState, () => {
      const { mode } = env || {};

      if (needsReset && mode === 'gather') {
        this.props.onSessionChange(newSession);
      }
    });
  }

  onDropChoice = (target, source, ordering) => {
    const { onSessionChange, session } = this.props;
    const from = ordering.tiles.find((t) => t.id === source.id && t.type === source.type);
    const to = target;
    log('[onDropChoice] ', from, to);
    const update = reducer({ type: 'move', from, to }, ordering);
    const sessionUpdate = Object.assign({}, session, {
      value: update.response,
    });

    onSessionChange(sessionUpdate);
  };

  onRemoveChoice = (target, ordering) => {
    const { onSessionChange, session } = this.props;
    log('[onRemoveChoice]', target);
    const update = reducer({ type: 'remove', target }, ordering);
    const sessionUpdate = Object.assign({}, session, {
      value: update.response,
    });
    onSessionChange(sessionUpdate);
  };

  createOrdering = () => {
    const { model, session } = this.props;
    const { showingCorrect } = this.state;
    const config = model.config || {
      orientation: 'vertical',
      includeTargets: true,
    };
    const { includeTargets } = config;

    return showingCorrect
      ? buildState(
        model.choices,
        model.correctResponse,
        model.correctResponse.map((id) => ({ id, outcome: 'correct' })),
        {
          includeTargets,
          allowSameChoiceInTargets: model.config.allowSameChoiceInTargets,
        },
      )
      : buildState(model.choices, session.value, model.outcomes, {
        includeTargets,
        allowSameChoiceInTargets: model.config.allowSameChoiceInTargets,
      });
  };

  onDragEnd = (event) => {
    const { over, active } = event;
    const ordering = this.createOrdering();

    if (over && active) {
      const draggedItem = active.data.current;
      const droppedOnItem = over.data.current;

      if (draggedItem && droppedOnItem && droppedOnItem.type === 'target') {
        this.onDropChoice(droppedOnItem, draggedItem, ordering);
        return;
      }

      if (draggedItem && droppedOnItem) {
        this.onDropChoice(droppedOnItem, draggedItem, ordering);
      }
    } else if (!over && active) {
      const draggedItem = active.data.current;
      if (draggedItem && draggedItem.type === 'target') {
        this.onRemoveChoice(draggedItem, ordering);
      }
    }
  }

  render() {
    const { model } = this.props;
    const {
      correctResponse,
      correctness,
      extraCSSRules,
      prompt,
      rationale,
      feedback,
      config: configs,
      note,
      showNote,
      env,
      disabled,
      teacherInstructions,
      language,
    } = model;
    const showToggle = correctResponse && correctResponse.length > 0;
    const { showingCorrect } = this.state;
    const config = configs || {
      orientation: 'vertical',
      includeTargets: true,
    };
    const { orientation, includeTargets } = config;
    const vertical = orientation === 'vertical';
    const ordering = this.createOrdering();
    const { mode, role } = env || {};

    const Tiler = vertical ? VerticalTiler : HorizontalTiler;
    const displayNote = (showingCorrect || (mode === 'view' && role === 'instructor')) && showNote && note;
    const showRationale = rationale && (hasText(rationale) || hasMedia(rationale));
    const showTeacherInstructions =
      teacherInstructions && (hasText(teacherInstructions) || hasMedia(teacherInstructions));

    const containerStyle = {
      color: color.text(),
      backgroundColor: color.background(),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
    };

    return (
      <DragProvider onDragStart={() => { }} onDragEnd={this.onDragEnd}>
        <PlacementOrderingContainer>
          <UiLayout extraCSSRules={extraCSSRules} style={containerStyle}>
            {showTeacherInstructions && (
              <StyledCollapsible
                labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
                className="collapsible"
              >
                <PreviewPrompt prompt={teacherInstructions} />
              </StyledCollapsible>
            )}

            <StyledPrompt>
              <PreviewPrompt prompt={prompt} />
            </StyledPrompt>

            <StyledToggle
              className="toggle"
              show={showToggle}
              toggled={showingCorrect}
              onToggle={this.toggleCorrect}
              language={language}
            />

            <OrderingTiler
              instanceId={this.instanceId}
              choiceLabel={config.choiceLabel}
              targetLabel={config.targetLabel}
              ordering={ordering}
              tiler={Tiler}
              disabled={disabled}
              addGuide={config.showOrdering}
              tileSize={config.tileSize}
              includeTargets={includeTargets}
              choiceLabelEnabled={model.config && model.config.choiceLabelEnabled}
            />

            {displayNote && <StyledNote dangerouslySetInnerHTML={{ __html: note }} />}

            {showRationale && (
              <StyledCollapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }} className="collapsible">
                <PreviewPrompt prompt={rationale} />
              </StyledCollapsible>
            )}

            {!showingCorrect && <Feedback correctness={correctness} feedback={feedback} />}
          </UiLayout>
        </PlacementOrderingContainer>
      </DragProvider>
    );
  }
}

export default PlacementOrdering;
