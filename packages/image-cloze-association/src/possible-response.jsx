import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';
import { useDraggable } from '@dnd-kit/core';
import { color } from '@pie-lib/render-ui';

import EvaluationIcon from './evaluation-icon';
import StaticHTMLSpan from './static-html-span';

const BaseContainer = styled('div')(() => ({
  position: 'relative',
  backgroundColor: color.white(),
  border: `1px solid ${color.borderDark()}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '28px',
  width: 'fit-content',
  '& span img': {
    // Added for touch devices, for image content.
    // This will prevent the context menu from appearing and not allowing other interactions with the image.
    // If interactions with the image in the token will be requested we should handle only the context Menu.
    pointerEvents: 'none',
  },
  '&.textAnswerChoiceStyle': {
    padding: '0 10px',
    margin: '4px 6px !important',
  },
  '&.answerChoiceTransparency': {
    border: 'none',
    backgroundColor: `${color.transparent()}`,
    '&:hover': {
      border: `1px solid ${color.borderDark()}`,
    },
  },
  '&.baseCorrect': {
    border: `2px solid ${color.correct()} !important`,
  },
  '&.baseIncorrect': {
    border: `2px solid ${color.incorrect()} !important`,
  },
}));

const StyledSpan = styled(StaticHTMLSpan)(() => ({
  backgroundColor: color.background(),
  '&.hiddenSpan': {
    visibility: 'hidden',
  },
}));

const PossibleResponse = ({ canDrag, containerStyle, data, onDragBegin, onDragEnd, answerChoiceTransparency }) => {
  const rootRef = useRef(null);
  const longPressTimer = useRef(null);

  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id: `possible-response-${data.id}`,
    data: {
      id: data.id,
      value: data.value,
      containerIndex: data.containerIndex,
    },
    disabled: !canDrag,
  });

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleTouchMove = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    longPressTimer.current = setTimeout(() => {
      if (canDrag && rootRef.current) {
        onDragBegin(data);
      }
    }, 500); // start drag after 500ms (touch and hold duration) for chromebooks and other touch devices
  };

  useEffect(() => {
    const node = rootRef.current;

    if (!node) return;

    node.addEventListener('touchstart', handleTouchStart, { passive: false });
    node.addEventListener('touchend', handleTouchEnd);
    node.addEventListener('touchmove', handleTouchMove);

    return () => {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchEnd);
      node.removeEventListener('touchmove', handleTouchMove);
    };
  }, [canDrag, data]);

  // useEffect(() => {
  //   if (!isDragging) {
  //     onDragEnd();
  //   }
  // }, [isDragging, onDragEnd]);

  const { isCorrect } = data || {};
  const evaluationStyle = {
    fontSize: 14,
    position: 'absolute',
    bottom: '3px',
    right: '3px',
  };
  const correctnessClass = isCorrect === true ? 'baseCorrect' : isCorrect === false ? 'baseIncorrect' : undefined;

  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const containsImage = imgRegex.test(data.value);

  const containerClassNames = classNames({
    answerChoiceTransparency,
    [correctnessClass]: !!correctnessClass,
    textAnswerChoiceStyle: !containsImage,
  });

  const promptClassNames = classNames({ hiddenSpan: data.hidden });

  return (
    <BaseContainer
      className={containerClassNames}
      style={containerStyle}
      ref={(ref) => {
        rootRef.current = ref;
        setNodeRef(ref);
      }}
      {...listeners}
      {...attributes}
    >
      <StyledSpan html={data.value} className={promptClassNames} />
      <EvaluationIcon isCorrect={data.isCorrect} containerStyle={evaluationStyle} />
    </BaseContainer>
  );
};

PossibleResponse.propTypes = {
  canDrag: PropTypes.bool.isRequired,
  containerStyle: PropTypes.object,
  data: PropTypes.object.isRequired,
  onDragBegin: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  answerChoiceTransparency: PropTypes.bool,
};

PossibleResponse.defaultProps = {
  containerStyle: {},
  answerChoiceTransparency: false,
};

export default PossibleResponse;
