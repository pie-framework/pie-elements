import React from 'react';
import PropTypes from 'prop-types';
import { DragOverlay } from '@dnd-kit/core';
import { DragProvider } from '@pie-lib/drag';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { color, Collapsible, PreviewPrompt, UiLayout, hasText, hasMedia } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import Translator from '@pie-lib/translator';
import { flatMap, groupBy } from 'lodash-es';

const { translator } = Translator;
import Image from './image-container';
import InteractiveSection from './interactive-section';
import PossibleResponses from './possible-responses';
import { getUnansweredAnswers, getAnswersCorrectness } from './utils-correctness';
import PossibleResponse from './possible-response';
import { closestDroppableKeyboardCoordinates } from './keyboard-coordinates';

const generateId = () => Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

// A click that lands right after a real drag gesture ends (pointer drag-and-drop, or
// the browser's own synthetic click for a keyboard Space/Enter) must be ignored by the
// click-to-select/click-to-place handlers below, or it would immediately reopen or
// re-trigger a selection for a drag that just completed.
const CLICK_AFTER_DRAG_GUARD_MS = 250;

const StyledUiLayout = styled(UiLayout)({
  color: color.text(),
  backgroundColor: color.background(),
  position: 'relative',
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
});

const StyledTeacherInstructions = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledRationale = styled(Collapsible)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export class ImageClozeAssociationComponent extends React.Component {
  constructor(props) {
    super(props);
    const {
      model: { possibleResponses, responseContainers, duplicateResponses, maxResponsePerZone },
      session,
    } = props;
    let { answers } = session || {};
    // set id for each possible response
    const possibleResponsesWithIds = (possibleResponses || []).map((item, index) => ({
      value: item,
      id: `${index}`,
    }));

    let groupedAnswers = groupBy(answers || [], 'containerIndex');
    // keep only last maxResponsePerZone answers for each zone
    let limitedAnswers = flatMap(groupedAnswers, (grp) => grp.slice(-(maxResponsePerZone || 1)));
    answers = limitedAnswers
      // set id for each answer
      .map((answer, index) => ({ ...answer, id: `${index}` }))
      // return only answer which have a valid container index
      .filter((answer) => answer.containerIndex < responseContainers.length);

    const possibleResponsesFiltered = possibleResponsesWithIds.filter(
      (response) => !answers.find((answer) => answer.value === response.value),
    );
    this.state = {
      answers: answers || [],
      draggingElement: { id: '', value: '' },
      possibleResponses: duplicateResponses ? possibleResponsesWithIds : possibleResponsesFiltered,
      // set id for each response containers
      responseContainers: (responseContainers || []).map((item, index) => ({
        index,
        ...item,
        id: `${index}`,
      })),
      maxResponsePerZone: maxResponsePerZone || 1,
      showCorrect: false,
      isValidDrop: false,
      selectedResponse: null,
    };
    this.lastDragEndAt = 0;
  }

  onDragStart = (event) => {
    const { active } = event;

    if (active?.data?.current) {
      this.setState({
        draggingElement: active.data.current,
        isValidDrop: false,
        selectedResponse: active.data.current,
      });
    }
  };

  onDragEnd = (event) => {
    const { active, over } = event;
    const { model } = this.props;
    const { duplicateResponses } = model || {};

    // Check if drop is valid
    const draggedItem = active?.data?.current;
    const responseArea = over?.data?.current;
    const isValidDrop =
      over &&
      active &&
      draggedItem &&
      responseArea &&
      responseArea.containerIndex !== undefined;

    const shouldDisableAnimation = isValidDrop && duplicateResponses;

    this.setState({
      draggingElement: { id: '', value: '' },
      isValidDrop: shouldDisableAnimation,
    });

    this.cancelSelection();
    this.lastDragEndAt = Date.now();

    if (!over || !active) {
      return;
    }

    if (!draggedItem) {
      return;
    }

    if (over.id === 'ica-board') {
      if (draggedItem.containerIndex !== undefined) {
        this.handleOnAnswerRemove(draggedItem);
      }
      return;
    }

    if (responseArea) {
      this.handleOnAnswerSelect(draggedItem, responseArea.containerIndex);
    }
  };

  onDragCancel = () => {
    this.setState({ draggingElement: { id: '', value: '' } });
    this.cancelSelection();
    this.lastDragEndAt = Date.now();
  };

  isSameResponse = (a, b) => !!a && !!b && a.id === b.id && a.containerIndex === b.containerIndex;

  // Click-to-select semantics: selecting the currently-selected response again clears
  // the selection instead of re-selecting it.
  toggleResponseSelection = (data) => {
    this.setState((state) => ({
      selectedResponse: this.isSameResponse(state.selectedResponse, data) ? null : data,
    }));
  };

  cancelSelection = () => {
    this.setState({ selectedResponse: null });
  };

  // If a real dnd-kit drag (started via keyboard Space/Enter) is still live when a
  // click completes the placement below, it needs to be cleanly ended — otherwise
  // dnd-kit would still think a drag is in progress. Escape is already configured as
  // this sensor's cancel key (see the keyboardCodes passed to DragProvider below), and
  // dispatching it as a real DOM KeyboardEvent is how dnd-kit's own document-level
  // listener is reached from outside its sensor.
  //
  // Only dispatch when a drag is actually live (draggingElement.id is truthy) — this is
  // a synthetic Escape keydown on `document`, so an unconditional dispatch would also be
  // observed by any other document-level Escape listener (host player modals/dialogs,
  // or another mounted instance of this same component) even when nothing here actually
  // needed cancelling.
  endAnyLiveKeyboardDrag = () => {
    if (!this.state.draggingElement.id) {
      return;
    }

    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true, cancelable: true }));
  };

  placeSelectedResponse = (containerIndex) => {
    const { selectedResponse } = this.state;

    if (!selectedResponse) {
      return;
    }

    if (containerIndex === undefined) {
      // Placing into the pool = removing it from wherever it currently is
      if (selectedResponse.containerIndex !== undefined) {
        this.handleOnAnswerRemove(selectedResponse);
      }
    } else {
      this.handleOnAnswerSelect(selectedResponse, containerIndex);
    }

    this.cancelSelection();
    this.endAnyLiveKeyboardDrag();
    this.lastDragEndAt = Date.now();
  };

  isClickSoonAfterDragEnd = () => Date.now() - this.lastDragEndAt < CLICK_AFTER_DRAG_GUARD_MS;

  onResponseClick = (data) => {
    if (this.isClickSoonAfterDragEnd()) {
      return;
    }

    // A click that selects/deselects/switches a tile must end any dnd-kit drag that's
    // still live from an earlier keyboard Space/Enter pick-up first — otherwise dnd-kit
    // keeps thinking that earlier item is being dragged (it ignores new sensor
    // activation while a drag is active) while selectedResponse visually points at
    // whatever this click just selected. Ending the stale drag first (rather than
    // after) matters: ending it also cancels the current selection as a side effect
    // (see onDragCancel above), so doing it before
    // toggleResponseSelection lets this click's own selection be the one that sticks.
    this.endAnyLiveKeyboardDrag();
    this.toggleResponseSelection(data);
  };

  onPlacementClick = (containerIndex) => {
    if (this.isClickSoonAfterDragEnd()) {
      return;
    }

    this.placeSelectedResponse(containerIndex);
  };

  renderDragOverlay = () => {
    const { draggingElement } = this.state;
    const { model } = this.props;

    if (!draggingElement.id) return null;

    // check if the response contains an image
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const containsImage = imgRegex.test(draggingElement.value);

    return (
      <PossibleResponse
        key={draggingElement.id}
        canDrag={false}
        data={draggingElement}
        onDragBegin={() => {}}
        isOverlay
        containerStyle={{
          ...(model.answerChoiceTransparency ? { opacity: '0.8' } : {}),
          ...(!containsImage ? { padding: '0 10px', margin: '4px 6px !important' } : {}),
        }}
      />
    );
  };

  filterPossibleAnswers = (possibleResponses, answer) =>
    possibleResponses.filter((response) => response.value !== answer.value);

  handleOnAnswerSelect = (answer, responseContainerIndex) => {
    const {
      model: { duplicateResponses },
      updateAnswer,
    } = this.props;
    const { answers, maxResponsePerZone } = this.state;
    let { possibleResponses } = this.state;
    let answersToStore;

    const answersInThisContainer = [];
    const answersInOtherContainers = [];

    answers.forEach((a) => {
      if (a.containerIndex === responseContainerIndex) {
        answersInThisContainer.push(a);
      } else {
        answersInOtherContainers.push(a);
      }
    });

    if (maxResponsePerZone === answersInThisContainer.length) {
      const shiftedItem = answersInThisContainer[0];
      if (maxResponsePerZone === 1) {
        answersInThisContainer.shift(); // FIFO
      } else {
        this.setState({ maxResponsePerZoneWarning: true });
        return;
      }

      // if duplicates are not allowed, make sure to put the shifted value back in possible responses
      if (!duplicateResponses) {
        possibleResponses = Array.isArray(possibleResponses) ? possibleResponses : [];

        possibleResponses.push({
          ...shiftedItem,
          containerIndex: undefined,
          id: shiftedItem.id || generateId(),
        });
      }

      // answers will be:
      // + shifted answers for the current container
      // + if duplicatesAllowed, all the other answers from other containers
      //   else: all the answers from other containers that are not having the same value
      // + new answer
      answersToStore = [
        ...answersInThisContainer, // shifted
        // TODO allow duplicates case Question: should we remove answer from a container if dragged to another container?
        // if yes, this should do it: add a.id !== answer.id instead of 'true'
        ...answersInOtherContainers.filter((a) => (duplicateResponses ? true : a.value !== answer.value)), // un-shifted
        {
          ...answer,
          containerIndex: responseContainerIndex,
          ...(duplicateResponses ? { id: generateId() } : {}),
        },
      ];
    } else {
      // answers will be:
      // + if duplicatesAllowed, all the other answers, except the one that was dragged
      //   else: all the answers that are not having the same value
      // + new answer
      answersToStore = [
        // TODO allow duplicates case Question: should we remove answer from a container if dragged to another container?
        // if yes, this should do it: add a.id !== answer.id instead of 'true'
        ...answers.filter((a) => (duplicateResponses ? a.id !== answer.id : a.value !== answer.value)),
        {
          ...answer,
          containerIndex: responseContainerIndex,
          ...(duplicateResponses ? { id: generateId() } : {}),
        },
      ];
    }
    this.setState({
      maxResponsePerZoneWarning: false,
      answers: answersToStore,
      possibleResponses:
        // for single response per container remove answer from possible responses
        duplicateResponses ? possibleResponses : this.filterPossibleAnswers(possibleResponses, answer),
    });
    updateAnswer(answersToStore);
  };

  handleOnAnswerRemove = (answer) => {
    const {
      model: { duplicateResponses },
      updateAnswer,
    } = this.props;
    const { answers, possibleResponses } = this.state;
    const answersToStore = answers.filter((a) => a.id !== answer.id);
    const shouldNotPushInPossibleResponses = answer.containerIndex === undefined; // don't duplicate possible responses

    this.setState({
      maxResponsePerZoneWarning: false,
      answers: answersToStore,
      // push back into possible responses the removed answer if responses cannot be duplicated
      possibleResponses:
        duplicateResponses || shouldNotPushInPossibleResponses
          ? possibleResponses
          : [
              ...possibleResponses,
              {
                ...answer,
                containerIndex: undefined,
              },
            ],
    });
    updateAnswer(answersToStore);
  };

  toggleCorrect = (showCorrect) => this.setState({ showCorrect });

  render() {
    const {
      model: {
        disabled,
        duplicateResponses,
        extraCSSRules,
        image,
        responseAreaFill,
        stimulus,
        responseCorrect,
        validation,
        teacherInstructions,
        prompt,
        autoplayAudioEnabled,
        showDashedBorder,
        mode,
        rationale,
        language,
        uiStyle = {},
        answerChoiceTransparency,
        responseContainerPadding,
        imageDropTargetPadding,
        fontSizeFactor,
        customAudioButton,
      },
    } = this.props;
    const {
      answers,
      draggingElement,
      possibleResponses,
      responseContainers,
      maxResponsePerZone,
      maxResponsePerZoneWarning,
      showCorrect,
      isValidDrop,
    } = this.state;
    const isEvaluateMode = mode === 'evaluate';
    const showToggle = isEvaluateMode && !responseCorrect;
    const { possibilityListPosition = 'bottom' } = uiStyle || {};
    const isVertical = possibilityListPosition === 'left' || possibilityListPosition === 'right';

    const { validResponse } = validation || {};
    const correctAnswers = [];
    const showRationale = rationale && (hasText(rationale) || hasMedia(rationale));
    const showTeacherInstructions =
      teacherInstructions && (hasText(teacherInstructions) || hasMedia(teacherInstructions));

    if (validResponse) {
      (validResponse.value || []).forEach((container, i) => {
        (container.images || []).forEach((v) => {
          correctAnswers.push({
            value: v,
            containerIndex: i,
            isCorrect: true,
          });
        });
      });
    }

    const warningMessage = translator.t('imageClozeAssociation.reachedLimit_other', {
      lng: language,
      count: maxResponsePerZone,
    });

    let answersToShow =
      responseCorrect !== undefined ? getAnswersCorrectness(answers, validation, duplicateResponses) : answers;

    if (responseCorrect === false && maxResponsePerZone === 1) {
      answersToShow = [...answersToShow, ...getUnansweredAnswers(answersToShow, validation)];
    }

    const sharedImageProps = {
      draggingElement,
      duplicateResponses,
      image,
      onAnswerSelect: this.handleOnAnswerSelect,
      onDragAnswerBegin: this.onDragStart,
      onDragAnswerEnd: this.onDragEnd,
      responseContainers,
      showDashedBorder,
      responseAreaFill,
      responseContainerPadding,
      imageDropTargetPadding,
      maxResponsePerZone,
      selectedResponse: this.state.selectedResponse,
      onSelectClick: this.onResponseClick,
      onPlacementClick: this.onPlacementClick,
    };

    const renderImage = () => (
      <Image
        {...sharedImageProps}
        canDrag={showCorrect && showToggle ? false : !disabled}
        answers={showCorrect && showToggle ? correctAnswers : answersToShow}
        answerChoiceTransparency={!(showCorrect && showToggle) ? answerChoiceTransparency : undefined}
      />
    );

    const renderPossibleResponses = () => {
      if (showCorrect && showToggle) return null;

      return (
        <React.Fragment>
          {maxResponsePerZoneWarning && <WarningInfo message={warningMessage} />}
          <PossibleResponses
            canDrag={!disabled}
            data={possibleResponses}
            onAnswerRemove={this.handleOnAnswerRemove}
            onDragBegin={this.onDragStart}
            answerChoiceTransparency={answerChoiceTransparency}
            customStyle={{
              minWidth: isVertical ? '130px' : image?.width || 'fit-content',
            }}
            isVertical={isVertical}
            minHeight={isVertical ? image?.height : undefined}
            selectedResponse={this.state.selectedResponse}
            onSelectClick={this.onResponseClick}
            onPlacementClick={this.onPlacementClick}
          />
        </React.Fragment>
      );
    };

    return (
      <DragProvider
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragCancel={this.onDragCancel}
        keyboardCoordinateGetter={closestDroppableKeyboardCoordinates}
        keyboardCodes={{ start: ['Space', 'Enter'], cancel: ['Escape'], end: ['Space', 'Enter'] }}
      >
        <StyledUiLayout extraCSSRules={extraCSSRules} id={'main-container'} fontSizeFactor={fontSizeFactor}>
          {showTeacherInstructions && (
            <StyledTeacherInstructions
              labels={{
                hidden: 'Show Teacher Instructions',
                visible: 'Hide Teacher Instructions',
              }}
            >
              <PreviewPrompt prompt={teacherInstructions} />
            </StyledTeacherInstructions>
          )}

          <PreviewPrompt
            className="prompt"
            prompt={prompt}
            autoplayAudioEnabled={autoplayAudioEnabled}
            customAudioButton={customAudioButton}
          />

          <PreviewPrompt prompt={stimulus} />

          <CorrectAnswerToggle
            show={showToggle}
            toggled={showCorrect}
            onToggle={this.toggleCorrect}
            language={language}
          />

          <InteractiveSection responseCorrect={showCorrect && showToggle ? true : responseCorrect} uiStyle={uiStyle}>
            {renderImage()}
            {renderPossibleResponses()}
          </InteractiveSection>

          {showRationale && (
            <StyledRationale
              labels={{
                hidden: 'Show Rationale',
                visible: 'Hide Rationale',
              }}
            >
              <PreviewPrompt prompt={rationale} />
            </StyledRationale>
          )}
        </StyledUiLayout>
        {/* Disable drop animation for valid drops to prevent visual snap-back */}
        {/* Keep default animation for invalid drops to show visual feedback */}
        <DragOverlay dropAnimation={isValidDrop ? null : undefined}>
          {this.renderDragOverlay()}
        </DragOverlay>
      </DragProvider>
    );
  }
}

const WarningContainer = styled('div')(({ theme }) => ({
  margin: `0 ${theme.spacing(2)}`,
  backgroundColor: '#dddddd',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    height: '30px',
  },
  '& h1': {
    padding: '0px',
    margin: '0px',
  },
}));

const WarningMessage = styled('span')(({ theme }) => ({
  paddingLeft: theme.spacing(0.5),
  userSelect: 'none',
}));

const WarningInfo = ({ message }) => {
  const nodeRef = React.useRef(null);

  return (
    <TransitionGroup>
      <CSSTransition classNames={'fb'} key="fb" timeout={300} nodeRef={nodeRef}>
        <WarningContainer ref={nodeRef} key="panel">
          <NotInterestedIcon color={'secondary'} fontSize={'small'} />
          <WarningMessage dangerouslySetInnerHTML={{ __html: message }} />
        </WarningContainer>
      </CSSTransition>
    </TransitionGroup>
  );
};

WarningInfo.propTypes = {
  message: PropTypes.string,
};

ImageClozeAssociationComponent.propTypes = {
  model: PropTypes.object.isRequired,
  session: PropTypes.object,
  updateAnswer: PropTypes.func.isRequired,
};

export default ImageClozeAssociationComponent;
