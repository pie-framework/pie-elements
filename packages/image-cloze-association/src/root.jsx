import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withDragContext } from '@pie-lib/drag';

import Image from './image-container';
import InteractiveSection from './interactive-section';
import PossibleResponses from './possible-responses';

import { getAnswersCorrectness } from './utils-correctness';
import { Collapsible, PreviewPrompt } from '@pie-lib/render-ui';
import _ from 'lodash';

const generateId = () =>
  Math.random()
    .toString(36)
    .substring(2) + new Date().getTime().toString(36);

class ImageClozeAssociationComponent extends React.Component {
  constructor(props) {
    super(props);
    const {
      model: {
        possibleResponses,
        responseContainers,
        duplicateResponses,
        maxResponsePerZone
      },
      session
    } = props;
    let { answers } = session || {};
    // set id for each possible response
    const possibleResponsesWithIds = (possibleResponses || []).map(
      (item, index) => ({
        value: item,
        id: `${index}`
      })
    );

    answers = _(answers || [])
      .groupBy('containerIndex')
      // keep only last maxResponsePerZone answers for each zone
      .map(grp => grp.slice(-(maxResponsePerZone || 1)))
      .flatMap()
      // set id for each answer
      .map((answer, index) => ({ ...answer, id: `${index}` }))
      // return only answer which have a valid container index
      .filter(answer => answer.containerIndex < responseContainers.length)
      .value();

    const possibleResponsesFiltered = possibleResponsesWithIds.filter(
      response => !answers.find(answer => answer.value === response.value)
    );
    this.state = {
      answers: answers || [],
      draggingElement: { id: '', value: '' },
      possibleResponses: duplicateResponses
        ? possibleResponsesWithIds
        : possibleResponsesFiltered,
      // set id for each response containers
      responseContainers: responseContainers.map((item, index) => ({
        index,
        ...item,
        id: `${index}`
      })),
      maxResponsePerZone: maxResponsePerZone || 1
    };
  }

  beginDrag = draggingElement => {
    this.setState({
      draggingElement
    });
  };

  handleOnDragEnd = () => {
    this.setState({
      draggingElement: { id: '', value: '' }
    });
  };

  handleOnAnswerSelect = (answer, responseContainerIndex) => {
    const {
      model: { duplicateResponses },
      updateAnswer
    } = this.props;
    const { answers, possibleResponses, maxResponsePerZone } = this.state;
    let answersToStore;

    if (
      maxResponsePerZone ===
      answers.filter(a => a.containerIndex === responseContainerIndex).length
    ) {
      const answersInThisContainer = answers.filter(
        a => a.containerIndex === responseContainerIndex
      );
      const answersInOtherContainers = answers.filter(
        b => b.containerIndex !== responseContainerIndex
      );

      const shiftedItem = answersInThisContainer[0];
      answersInThisContainer.shift(); // FIFO

      // if duplicates are not allowed, make sure to put the shifted value back in possible responses
      if (!duplicateResponses) {
        possibleResponses.push({
          ...shiftedItem,
          containerIndex: '',
          id: `${_.max(
            possibleResponses.map(c => parseInt(c.id)).filter(id => !isNaN(id))
          ) + 1}`
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
        ...answersInOtherContainers.filter(a =>
          duplicateResponses ? true : a.value !== answer.value
        ), // un-shifted
        {
          ...answer,
          containerIndex: responseContainerIndex,
          ...(duplicateResponses ? { id: generateId() } : {})
        }
      ];
    } else {
      // answers will be:
      // + if duplicatesAllowed, all the other answers, except the one that was dragged
      //   else: all the answers that are not having the same value
      // + new answer
      answersToStore = [
        // TODO allow duplicates case Question: should we remove answer from a container if dragged to another container?
        // if yes, this should do it: add a.id !== answer.id instead of 'true'
        ...answers.filter(a =>
          duplicateResponses ? a.id !== answer.id : a.value !== answer.value
        ),
        {
          ...answer,
          containerIndex: responseContainerIndex,
          ...(duplicateResponses ? { id: generateId() } : {})
        }
      ];
    }

    this.setState({
      answers: answersToStore,
      possibleResponses:
        // for single response per container remove answer from possible responses
        duplicateResponses
          ? possibleResponses
          : possibleResponses.filter(
              response => response.value !== answer.value
            )
    });
    updateAnswer(answersToStore);
  };

  handleOnAnswerRemove = answer => {
    const {
      model: { duplicateResponses },
      updateAnswer
    } = this.props;
    const { answers, possibleResponses } = this.state;
    const answersToStore = answers.filter(a => a.id !== answer.id);
    const shouldNotPushInPossibleResponses =
      answer.containerIndex === undefined; // don't duplicate possible responses

    this.setState({
      answers: answersToStore,
      // push back into possible responses the removed answer if responses cannot be duplicated
      possibleResponses:
        duplicateResponses || shouldNotPushInPossibleResponses
          ? possibleResponses
          : [
              ...possibleResponses,
              {
                ...answer,
                containerIndex: undefined
              }
            ]
    });
    updateAnswer(answersToStore);
  };

  render() {
    const {
      model: {
        disabled,
        duplicateResponses,
        image,
        stimulus,
        responseCorrect,
        validation,
        teacherInstructions,
        prompt,
        showDashedBorder,
      }
    } = this.props;
    const {
      answers,
      draggingElement,
      possibleResponses,
      responseContainers
    } = this.state;

    const answersToShow =
      responseCorrect !== undefined
        ? getAnswersCorrectness(answers, validation, duplicateResponses)
        : answers;

    return (
      <div>
        <PreviewPrompt className="prompt" prompt={prompt} />

        {teacherInstructions && (
          <Collapsible
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
          </Collapsible>
        )}

        <Typography>
          <span dangerouslySetInnerHTML={{ __html: stimulus }} />
        </Typography>

        <InteractiveSection responseCorrect={responseCorrect}>
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
          />

          <PossibleResponses
            canDrag={!disabled}
            data={possibleResponses}
            onAnswerRemove={this.handleOnAnswerRemove}
            onDragBegin={this.beginDrag}
            onDragEnd={this.handleOnDragEnd}
          />
        </InteractiveSection>
      </div>
    );
  }
}

ImageClozeAssociationComponent.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object.isRequired,
  session: PropTypes.object,
  updateAnswer: PropTypes.func.isRequired
};

ImageClozeAssociationComponent.defaultProps = {
  classes: {}
};

export default withDragContext(ImageClozeAssociationComponent);
