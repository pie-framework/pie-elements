import React from 'react';
import PropTypes from 'prop-types';
import { withDragContext } from '@pie-lib/pie-toolbox/drag';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { color, Collapsible, PreviewPrompt, UiLayout, hasText } from '@pie-lib/pie-toolbox/render-ui';
import { withStyles } from '@material-ui/core/styles';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import Translator from '@pie-lib/pie-toolbox/translator';

const { translator } = Translator;
import Image from './image-container';
import InteractiveSection from './interactive-section';
import PossibleResponses from './possible-responses';
import { getUnansweredAnswers, getAnswersCorrectness } from './utils-correctness';
import _ from 'lodash';

const generateId = () => Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

const styles = (theme) => ({
  main: {
    color: color.text(),
    backgroundColor: color.background(),
    position: 'relative'
  },
  teacherInstructions: {
    marginBottom: theme.spacing.unit * 2,
  },
  rationale: {
    marginTop: theme.spacing.unit * 2,
  },
});

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

    answers = _(answers || [])
      .groupBy('containerIndex')
      // keep only last maxResponsePerZone answers for each zone
      .map((grp) => grp.slice(-(maxResponsePerZone || 1)))
      .flatMap()
      // set id for each answer
      .map((answer, index) => ({ ...answer, id: `${index}` }))
      // return only answer which have a valid container index
      .filter((answer) => answer.containerIndex < responseContainers.length)
      .value();

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

  beginDrag = (draggingElement) => {
    this.setState({
      draggingElement,
    });
  };

  handleOnDragEnd = () => {
    this.setState({
      draggingElement: { id: '', value: '' },
    });
  };

  filterPossibleAnswers = (possibleResponses, answer) => {
    const index = possibleResponses.findIndex((response) => response.value === answer.value);

    if (index >= 0) {
      return [
        ...possibleResponses.slice(0, index), // Elements before the found item
        ...possibleResponses.slice(index + 1), // Elements after the found item
      ];
    }

    return possibleResponses;
  };

  handleOnAnswerSelect = (answer, responseContainerIndex) => {
    const {
      model: { duplicateResponses },
      updateAnswer,
    } = this.props;
    const { answers, maxResponsePerZone } = this.state;
    let { possibleResponses } = this.state;
    let answersToStore;

    if (maxResponsePerZone === answers.filter((a) => a.containerIndex === responseContainerIndex).length) {
      const answersInThisContainer = answers.filter((a) => a.containerIndex === responseContainerIndex);
      const answersInOtherContainers = answers.filter((b) => b.containerIndex !== responseContainerIndex);

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
      classes,
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

    if (validResponse) {
      (validResponse.value || []).forEach((container, i) => {
        (container.images || []).forEach((v) => {
          correctAnswers.push({
            value: v,
            containerIndex: i,
            isCorrect: true
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

    // Safari, Firefox, and Edge do not support autoplay audio smoothly in our use case
    const addAutoplayAudio = autoplayAudioEnabled && !(/Safari|Firefox|Edg/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));

    return (
      <UiLayout extraCSSRules={extraCSSRules} id={'main-container'} className={classes.main} fontSizeFactor={fontSizeFactor}>
        {teacherInstructions && hasText(teacherInstructions) && (
          <Collapsible
            className={classes.teacherInstructions}
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </Collapsible>
        )}

        <PreviewPrompt className="prompt" prompt={prompt} autoplayAudioEnabled={addAutoplayAudio} />

        <PreviewPrompt prompt={stimulus} />

        <CorrectAnswerToggle
          show={showToggle}
          toggled={showCorrect}
          onToggle={this.toggleCorrect}
          language={language}
        />

        {showCorrect && showToggle ? (
          <InteractiveSection responseCorrect={true} uiStyle={uiStyle}>
            <Image
              canDrag={false}
              answers={correctAnswers}
              draggingElement={draggingElement}
              duplicateResponses={duplicateResponses}
              image={image}
              onAnswerSelect={this.handleOnAnswerSelect}
              onDragAnswerBegin={this.beginDrag}
              onDragAnswerEnd={this.handleOnDragEnd}
              responseContainers={responseContainers}
              showDashedBorder={showDashedBorder}
              responseAreaFill={responseAreaFill}
              responseContainerPadding={responseContainerPadding}
              imageDropTargetPadding={imageDropTargetPadding}
              maxResponsePerZone={maxResponsePerZone}
            />
          </InteractiveSection>
        ) : (
          <InteractiveSection responseCorrect={responseCorrect} uiStyle={uiStyle}>
            <Image
              canDrag={!disabled}
              answers={answersToShow}
              draggingElement={draggingElement}
              duplicateResponses={duplicateResponses}
              image={image}
              onAnswerSelect={this.handleOnAnswerSelect}
              onDragAnswerBegin={this.beginDrag}
              onDragAnswerEnd={this.handleOnDragEnd}
              responseContainers={responseContainers}
              showDashedBorder={showDashedBorder}
              responseAreaFill={responseAreaFill}
              answerChoiceTransparency={answerChoiceTransparency}
              responseContainerPadding={responseContainerPadding}
              imageDropTargetPadding={imageDropTargetPadding}
              maxResponsePerZone={maxResponsePerZone}
            />

            {maxResponsePerZoneWarning && <WarningInfo message={warningMessage} />}

            <PossibleResponses
              canDrag={!disabled}
              data={possibleResponses}
              onAnswerRemove={this.handleOnAnswerRemove}
              onDragBegin={this.beginDrag}
              onDragEnd={this.handleOnDragEnd}
              answerChoiceTransparency={answerChoiceTransparency}
              customStyle={{
                minWidth: isVertical ? '130px' : image?.width || 'fit-content',
              }}
              isVertical={isVertical}
              minHeight={isVertical ? image?.height : undefined}
            />
          </InteractiveSection>
        )}

        {rationale && hasText(rationale) && (
          <Collapsible
            className={classes.rationale}
            labels={{
              hidden: 'Show Rationale',
              visible: 'Hide Rationale',
            }}
          >
            <PreviewPrompt prompt={rationale} />
          </Collapsible>
        )}
      </UiLayout>
    );
  }
}

const WarningInfo = withStyles((theme) => ({
  warning: {
    margin: `0 ${theme.spacing.unit * 2}px`,
    backgroundColor: '#dddddd',
    padding: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      height: '30px',
    },
    '& h1': {
      padding: '0px',
      margin: '0px',
    },
  },
  message: {
    paddingLeft: theme.spacing.unit / 2,
    userSelect: 'none',
  },
}))(({ classes, message }) => (
  <TransitionGroup>
    <CSSTransition classNames={'fb'} key="fb" timeout={300}>
      <div key="panel" className={classes.warning}>
        <NotInterestedIcon color={'secondary'} fontSize={'small'}/>
        <span className={classes.message} dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    </CSSTransition>
  </TransitionGroup>
));

WarningInfo.propTypes = {
  message: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

ImageClozeAssociationComponent.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object.isRequired,
  session: PropTypes.object,
  updateAnswer: PropTypes.func.isRequired,
};

ImageClozeAssociationComponent.defaultProps = {
  classes: {},
};

const StyledComponent = withStyles(styles)(ImageClozeAssociationComponent);

export default withDragContext(StyledComponent);
