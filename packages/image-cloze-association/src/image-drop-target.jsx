import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';
import cx from 'classnames';

import PossibleResponse from './possible-response';

const AnswersContainer = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
}));

const ResponseContainer = styled('div')(() => ({
  position: 'absolute',
  boxSizing: 'border-box',
  '&.active': {
    border: `2px solid ${color.text()}`,
    backgroundColor: 'rgba(230, 242, 252, .8)',
  },
  '&.dashed': {
    border: `2px dashed ${color.text()}`,
  },
  '&.is-over': {
    border: '1px solid rgb(158, 158, 158)',
    backgroundColor: 'rgb(224, 224, 224)',
  },
}));

const ImageDropTarget = ({
  answers,
  canDrag,
  containerStyle,
  draggingElement,
  onDragAnswerBegin,
  onDragAnswerEnd,
  showDashedBorder,
  responseAreaFill,
  responseContainerPadding = '10px',
  imageDropTargetPadding,
  answerChoiceTransparency,
  maxResponsePerZone,
  onDrop,
  index,
}) => {
  const [shouldHaveSmallPadding, setShouldHaveSmallPadding] = useState(false);
  const dropContainerRef = useRef(null);
  const dropContainerResponsesHeightRef = useRef(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `response-container-${index}`,
    data: {
      containerIndex: index,
      onDrop,
    },
  });

  useEffect(() => {
    const container = dropContainerRef.current;

    if (!container) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const isDraggingElement = !!draggingElement.id;

  const containerClasses = cx({
    'is-over': isOver,
    dashed: showDashedBorder && !isDraggingElement,
    active: isDraggingElement,
  });

  const updatedContainerStyle = {
    padding: maxResponsePerZone === 1 ? '0' : responseContainerPadding,
    ...containerStyle,
    ...(responseAreaFill && !isDraggingElement && { backgroundColor: responseAreaFill }),
  };

  return (
    <ResponseContainer
      ref={(ref) => {
        dropContainerRef.current = ref;
        setNodeRef(ref);
      }}
      className={containerClasses}
      style={updatedContainerStyle}
    >
      {answers.length ? (
        <AnswersContainer
          ref={(ref) => {
            dropContainerResponsesHeightRef.current = ref?.getBoundingClientRect().height;
          }}
        >
          {answers.map((answer) => (
            <PossibleResponse
              key={answer.id}
              data={answer}
              canDrag={canDrag}
              onDragBegin={() => onDragAnswerBegin(answer)}
              onDragEnd={onDragAnswerEnd}
              answerChoiceTransparency={answerChoiceTransparency}
              containerStyle={{
                padding: imageDropTargetPadding ? imageDropTargetPadding : shouldHaveSmallPadding ? '2px' : '6px 10px',
              }}
            />
          ))}
        </AnswersContainer>
      ) : null}
    </ResponseContainer>
  );
};

ImageDropTarget.propTypes = {
  answer: PropTypes.object,
  answers: PropTypes.array,
  canDrag: PropTypes.bool.isRequired,
  containerStyle: PropTypes.object.isRequired,
  draggingElement: PropTypes.object.isRequired,
  onDragAnswerBegin: PropTypes.func.isRequired,
  onDragAnswerEnd: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  showDashedBorder: PropTypes.bool,
  responseAreaFill: PropTypes.string,
  answerChoiceTransparency: PropTypes.bool,
  responseContainerPadding: PropTypes.string,
  imageDropTargetPadding: PropTypes.string,
  maxResponsePerZone: PropTypes.number,
};

export default ImageDropTarget;
