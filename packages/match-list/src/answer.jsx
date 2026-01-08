import { useDraggable, useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import { PlaceHolder } from '@pie-lib/drag';
import isEmpty from 'lodash/isEmpty';
import { color } from '@pie-lib/render-ui';

const log = debug('pie-elements:match-title:answer');

const HolderNumber = styled('div')(({ theme }) => ({
  width: '100%',
  fontSize: '18px',
  textAlign: 'center',
  color: `rgba(${theme.palette.common.black}, 0.6)`,
}));

const Holder = ({ index, isOver, disabled, type }) => (
  <PlaceHolder
    extraStyles={{
      display: 'flex',
      padding: '0',
      alignItems: 'center',
      justifyContent: 'center',
      height: '40px',
    }}
    disabled={disabled}
    isOver={isOver}
    type={type}
  >
    {index !== undefined && <HolderNumber>{index}</HolderNumber>}
  </PlaceHolder>
);

Holder.propTypes = {
  index: PropTypes.number,
  isOver: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

const AnswerContentContainer = styled('div')(({ theme, isDragging, isOver, disabled, outcome }) => ({
  color: color.text(),
  backgroundColor: color.white(),
  border: `1px solid ${outcome === 'correct' ? color.correct() :
    outcome === 'incorrect' ? color.incorrect() :
      theme.palette.grey[400]
    }`,
  cursor: disabled ? 'not-allowed' : 'pointer',
  width: '100%',
  padding: '10px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  transition: 'opacity 200ms linear',
  wordBreak: 'break-word',
  opacity: isDragging && !disabled ? 0.5 : isOver && !disabled ? 0.2 : 1,
}));

const AnswerContent = (props) => {
  const { isDragging, isOver, title, disabled, empty, outcome, guideIndex, type } = props;

  if (empty) {
    return <Holder
      index={guideIndex}
      isOver={isOver}
      disabled={disabled}
      type={type}

    />;
  } else {
    return (
      <AnswerContentContainer
        isDragging={isDragging}
        isOver={isOver}
        disabled={disabled}
        outcome={outcome}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    );
  }
};

const AnswerContainer = styled('div')(({ correct, theme }) => ({
  boxSizing: 'border-box',
  minHeight: 40,
  minWidth: '200px',
  overflow: 'hidden',
  margin: theme.spacing(0.5),
  padding: '0px',
  textAlign: 'center',
  height: 'initial',
  border: correct === true ? `1px solid var(--feedback-correct-bg-color, ${color.correct()})` :
    correct === false ? `1px solid var(--feedback-incorrect-bg-color, ${color.incorrect()})` :
      'none',
}));

export class Answer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    isDragging: PropTypes.bool,
    id: PropTypes.any,
    title: PropTypes.string,
    isOver: PropTypes.bool,
    empty: PropTypes.bool,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    correct: PropTypes.bool,
  };

  componentDidMount() {
    if (this.ref) {
      // NOTE: preventing default on touchstart can block dnd-kit pointer handling on some devices.
      // Consider removing this if you have issues on touch devices.
      this.ref.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    }
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.removeEventListener('touchstart', this.handleTouchStart);
    }
  }

  handleTouchStart = (e) => {
    // do NOT call e.preventDefault() here — it prevents pointer events necessary for dnd-kit.
    // Keep this handler empty or remove it if you don't need it.
    // e.preventDefault();
  };

  render() {
    const {
      id,
      title,
      isDragging = false,
      className,
      disabled,
      isOver = false,
      type,
      correct,
    } = this.props;

    log('[render], props: ', this.props);

    return (
      <AnswerContainer correct={correct} className={className} ref={(ref) => (this.ref = ref)}>
        <AnswerContent
          title={title}
          id={id}
          isOver={isOver}
          empty={isEmpty(title)}
          isDragging={isDragging}
          disabled={disabled}
          type={type}
        />
      </AnswerContainer>
    );
  }
}

function DragAndDropAnswer(props) {
  const { id, instanceId, promptId, draggable = true, disabled = false, type } = props;

  const dragId = `${type || 'answer'}-${id}`;
  // droppable only if promptId exists
  const dropId = promptId ? `drop-${promptId}` : undefined;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: dragId,
    data: {
      type: type || 'answer',
      id,
      instanceId,
      value: props.title,
      promptId,
    },
    disabled: !draggable || disabled,
  });

  const droppable = useDroppable({
    id: dropId,
    data: dropId ? { type: 'drop-zone', promptId, instanceId } : undefined,
    disabled: disabled || !dropId,
  });

  const setDropRef = droppable.setNodeRef;
  const isOver = droppable.isOver;

  // compute style: apply transform to the element that actually moves
  const transformStyle = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined;

  // If this item is a drop-zone (prompt slot), we render an outer droppable wrapper.
  // For droppable wrapper we apply style to the outer wrapper
  if (dropId) {
    return (
      <div
        ref={setDropRef}
        style={{
          flex: 1,
          transform: transformStyle,
          transition,
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: isOver ? 'rgba(0,0,0,0.05)' : 'transparent',
        }}
      >
        <div ref={setDragRef} {...listeners} {...attributes}>
          <Answer {...props} isDragging={isDragging} isOver={isOver} />
        </div>
      </div>
    );
  }

  // if there is NO dropId (this is a choice / draggable-only), render only draggable node and apply transform to it.
  return (
    <div
      ref={setDragRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transformStyle,
        transition,
        cursor: disabled ? 'not-allowed' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        touchAction: draggable && !disabled ? 'none' : 'auto',
      }}
    >
      <Answer {...props} isDragging={isDragging} isOver={false} />
    </div>
  );
}

DragAndDropAnswer.propTypes = {
  id: PropTypes.any,
  instanceId: PropTypes.string,
  promptId: PropTypes.any,
  title: PropTypes.string,
  draggable: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default DragAndDropAnswer;
