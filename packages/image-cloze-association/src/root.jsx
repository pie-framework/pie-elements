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
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';

const { translator } = Translator;
import Image from './image-container';
import InteractiveSection from './interactive-section';
import PossibleResponses from './possible-responses';
import { getUnansweredAnswers, getAnswersCorrectness } from './utils-correctness';
import PossibleResponse from './possible-response';

const generateId = () => Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

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
    };
  }

  onDragStart = (event) => {
    const { active } = event;

    if (active?.data?.current) {
      this.setState({
        draggingElement: active.data.current,
      });
    }
  };

  onDragEnd = (event) => {
    const { active, over } = event;

    this.setState({ draggingElement: { id: '', value: '' } });

    if (!over || !active) {
      return;
    }

    const draggedItem = active.data.current;

    if (!draggedItem) {
      return;
    }

    if (over.id === 'ica-board') {
      this.handleOnAnswerRemove(draggedItem);
      return;
    }

    const responseArea = over.data.current;

    if (responseArea) {
      this.handleOnAnswerSelect(draggedItem, responseArea.containerIndex);
    }
  };

  renderDragOverlay = () => {
    const { draggingElement } = this.state;
    const { model } = this.props;

    if (!draggingElement.id) return null;

    if (draggingElement.id) {
      return (
        <PossibleResponse
          key={draggingElement.id}
          data={draggingElement}
          answerChoiceTransparency={model.answerChoiceTransparency}
          containerStyle={{ margin: '4px' }}
        />
      );
    }

    return null;
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
          />
        </React.Fragment>
      );
    };

    return (
      <DragProvider onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
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
        <DragOverlay>{this.renderDragOverlay()}</DragOverlay>
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
