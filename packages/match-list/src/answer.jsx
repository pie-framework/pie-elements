import { useDraggable, useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import { PlaceHolder } from '@pie-lib/drag';
import { isEmpty } from 'lodash-es';
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

const AnswerContentContainer = styled('div')(({ isDragging, isSelected, isOver, disabled, outcome }) => ({
  color: color.text(),
  backgroundColor: color.white(),
  border: `1px solid ${
    outcome === 'correct' ? color.correct() : outcome === 'incorrect' ? color.incorrect() : color.border()
  }`,
  cursor: disabled ? 'not-allowed' : 'pointer',
  width: '100%',
  padding: '10px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  transition: 'opacity 200ms linear',
  wordBreak: 'break-word',
  opacity: (isDragging || isSelected) && !disabled ? 0.5 : isOver && !disabled ? 0.2 : 1,
  touchAction: 'none',
}));

const AnswerContent = (props) => {
  const { isDragging, isSelected, isOver, title, disabled, empty, outcome, guideIndex, type } = props;

  if (empty) {
    return <Holder index={guideIndex} isOver={isOver} disabled={disabled} type={type} />;
  } else {
    return (
      <AnswerContentContainer
        isDragging={isDragging}
        isSelected={isSelected}
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
  border:
    correct === true
      ? `1px solid var(--feedback-correct-bg-color, ${color.correct()})`
      : correct === false
        ? `1px solid var(--feedback-incorrect-bg-color, ${color.incorrect()})`
        : 'none',
}));

export class Answer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    isDragging: PropTypes.bool,
    isSelected: PropTypes.bool,
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
      isSelected = false,
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
          isSelected={isSelected}
          disabled={disabled}
          type={type}
        />
      </AnswerContainer>
    );
  }
}

function DragAndDropAnswer(props) {
  const {
    id,
    instanceId,
    promptId,
    draggable = true,
    disabled = false,
    type,
    selectedAnswer,
    onSelectClick,
    onPlacementClick,
  } = props;

  const dragId = `${type || 'answer'}-${id}`;
  // droppable only if promptId exists
  const dropId = promptId !== undefined && promptId !== null ? `drop-${promptId}` : undefined;

  // Built once and reused for both dnd-kit's own data and the click handlers below, so
  // a click carries exactly the same shape dnd-kit's onDragStart/onDragEnd would.
  const activeData = {
    type: type || 'answer',
    id,
    instanceId,
    value: props.title,
    promptId,
  };
  const dropZoneData = dropId
    ? {
        type: 'drop-zone',
        promptId,
        instanceId,
      }
    : undefined;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: dragId,
    data: activeData,
    disabled: !draggable || disabled,
  });

  const droppable = useDroppable({
    id: dropId,
    data: dropZoneData,
    disabled: disabled || !dropId,
  });

  const setDropRef = droppable.setNodeRef;
  const isOver = droppable.isOver;

  // dnd-kit's own isOver only reflects real collision detection during an active drag,
  // so it stays false while an answer is merely click-selected (no drag in progress).
  // Track hovering locally and fold it into the same isOver signal used everywhere
  // below, so hovering a response area while something is selected gets the exact same
  // treatment as hovering it during a real drag — one code path, no duplicated CSS.
  const [isHovered, setIsHovered] = useState(false);
  const hasSelection = !!selectedAnswer;
  const showsHoverEffect = isOver || (hasSelection && isHovered && !disabled);

  const isSelected =
    !!selectedAnswer &&
    selectedAnswer.type === activeData.type &&
    selectedAnswer.id === activeData.id &&
    selectedAnswer.promptId === activeData.promptId;

  // compute style: apply transform to the element that actually moves
  const transformStyle = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined;

  // If this item is a drop-zone (prompt slot), we render an outer droppable wrapper.
  // The outer wrapper's rect is what dnd-kit measures for this slot's own droppable
  // ("drop-{promptId}"), so it must stay untransformed — applying the drag transform
  // there would make the slot's own droppable rect chase the dragged item during the
  // drag, corrupting collision/keyboard-navigation results. The transform belongs on
  // the inner draggable node instead.
  if (dropId) {
    const handleResponseAreaClick = () => {
      if (disabled) return;

      if (isSelected) {
        // Clicking the already-selected placed answer again deselects it, same as
        // for a choice in the pool.
        onSelectClick?.(activeData);
      } else if (selectedAnswer) {
        // Something else is selected — place it here, same whether this area is
        // currently empty or already occupied.
        onPlacementClick?.(dropZoneData);
      } else if (draggable) {
        // Nothing selected yet, and this response area holds an answer — clicking it
        // selects that answer for moving elsewhere, the same way Tab+Space/Enter does.
        onSelectClick?.(activeData);
      }

      // Empty response area clicked with nothing selected: nothing to place or select.
    };

    // An empty response area isn't draggable, so dnd-kit's own attributes (only
    // applied to the inner node, and only when draggable) never make it tabbable —
    // this outer wrapper needs its own focus/activation handling so "select a choice,
    // then Tab to a response area and press Space/Enter" works even when the area is
    // empty. This is independent of, and doesn't change, the existing in-drag
    // Tab-cycling (that's driven by an active dnd-kit drag, not native focus).
    //
    // Only made a native Tab stop when NOT draggable (i.e. empty): when the target is
    // filled, the inner node is already independently tabbable via dnd-kit's own
    // attributes for the existing pick-up-to-move gesture, and adding a second,
    // outer Tab stop for the same visual tile would add an extra stop to the existing
    // Tab order. Placing into an occupied area is still fully reachable by mouse click
    // here, or by the existing keyboard drag flow (Tab+Space/Enter on the choice,
    // Tab-cycle to the occupied target, Space/Enter to swap).
    const isNativeTabStop = !draggable && !disabled;

    const handleResponseAreaKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleResponseAreaClick();
      }
    };

    return (
      <div
        ref={setDropRef}
        role="button"
        tabIndex={isNativeTabStop ? 0 : -1}
        onClick={handleResponseAreaClick}
        onKeyDown={isNativeTabStop ? handleResponseAreaKeyDown : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          flex: 1,
          opacity: isDragging || isSelected ? 0.5 : 1,
          backgroundColor: isDragging || isSelected || showsHoverEffect ? 'rgba(0,0,0,0.05)' : 'transparent',
          cursor: hasSelection && !disabled ? 'pointer' : undefined,
        }}
      >
        <div ref={setDragRef} {...listeners} {...attributes} style={{ transform: transformStyle, transition }}>
          <Answer {...props} isDragging={isDragging} isSelected={isSelected} isOver={showsHoverEffect} />
        </div>
      </div>
    );
  }

  const handleChoiceClick = (e) => {
    if (disabled) {
      return;
    }

    e.stopPropagation();
    onSelectClick?.(activeData);
  };

  // if there is NO dropId (this is a choice / draggable-only), render only draggable node and apply transform to it.
  return (
    <div
      ref={setDragRef}
      {...listeners}
      {...attributes}
      onClick={handleChoiceClick}
      style={{
        transform: transformStyle,
        transition,
        cursor: disabled ? 'not-allowed' : 'grab',
        opacity: isDragging || isSelected ? 0.5 : 1,
        touchAction: draggable && !disabled ? 'none' : 'auto',
      }}
    >
      <Answer {...props} isDragging={isDragging} isSelected={isSelected} isOver={false} />
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
  selectedAnswer: PropTypes.object,
  onSelectClick: PropTypes.func,
  onPlacementClick: PropTypes.func,
};

export default DragAndDropAnswer;
