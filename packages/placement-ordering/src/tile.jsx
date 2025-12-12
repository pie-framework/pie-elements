import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';

import { PlaceHolder } from '@pie-lib/drag';
import { color } from '@pie-lib/render-ui';

const log = debug('pie-elements:placement-ordering:tile');

const StyledNumberContainer = styled('div')(({ theme }) => ({
  width: '100%',
  fontSize: theme.typography.fontSize + 4,
  textAlign: 'center',
  color: `rgba(${theme.palette.common.black}, 0.6)`,
}));

const Holder = ({ type, index, isOver, disabled }) => (
  <PlaceHolder type={type} isOver={isOver} disabled={disabled}>
    {type === 'target' && index !== undefined && <StyledNumberContainer>{index}</StyledNumberContainer>}
  </PlaceHolder>
);

Holder.propTypes = {
  type: PropTypes.string,
  index: PropTypes.number,
  isOver: PropTypes.bool,
  disabled: PropTypes.bool,
};

const StyledTileContent = styled('div')(({ theme, isDragging, isOver, disabled, outcome, label }) => ({
  cursor: 'pointer',
  width: '100%',
  height: '100%',
  padding: '10px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.grey[400]}`,
  backgroundColor: color.background(),
  transition: 'opacity 200ms linear',
  pointerEvents: 'none',
  '&:hover': {
    backgroundColor: color.secondary(),
  },

  // Apply conditional styles based on props
  ...(isOver && !disabled && {
    opacity: 0.2,
  }),

  ...(isDragging && !disabled && {
    opacity: 0.5,
    backgroundColor: color.secondaryLight(),
  }),

  ...(disabled && {
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: color.background(),
    },
  }),

  ...(outcome === 'incorrect' && {
    border: `1px solid ${color.incorrect()}`,
  }),

  ...(outcome === 'correct' && {
    border: `1px solid ${color.correct()}`,
  }),

  ...(!label && {
    border: 'none',
    '&:hover': {
      backgroundColor: 'unset',
    },
  }),
}));

const TileContent = (props) => {
  const { type, isDragging, empty, isOver, label, disabled, outcome, guideIndex } = props;

  if (empty) {
    return <Holder type={type} index={guideIndex} isOver={isOver} disabled={disabled} />;
  } else {
    return (
      <StyledTileContent
        isDragging={isDragging}
        isOver={isOver}
        disabled={disabled}
        outcome={outcome}
        label={label}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    );
  }
};

export const Tile = (props) => {
  const {
    label,
    type,
    id,
    empty,
    disabled,
    outcome,
    index,
    guideIndex,
    instanceId,
    draggable,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `tile-${id}-${instanceId}`,
    data: {
      id,
      type,
      instanceId,
      value: label,
      index
    },
    disabled: !draggable || disabled,
  });

  const {
    setNodeRef: setDropRef,
    isOver: dropIsOver,
  } = useDroppable({
    id: `drop-tile-${id ? id : index}-${instanceId}`,
    data: {
      id,
      type,
      instanceId,
      value: label,
      index
    },
  });

  const ref = React.useRef(null);

  React.useEffect(() => {
    const currentRef = ref.current;

    const handleTouchStart = (e) => {
      e.preventDefault(); // Prevent the default touch event behavior
    };

    if (currentRef) {
      currentRef.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, []);

  const setRefs = (element) => {
    ref.current = element;
    setDragRef(element);
    setDropRef(element);
  };

  log('[render], props: ', props);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    textAlign: 'center',
  };

  return (
    <div
      ref={setRefs}
      style={style}
      {...(draggable && !disabled ? { ...listeners, ...attributes } : {})}
    >
      <TileContent
        label={label}
        id={id}
        empty={empty}
        index={index}
        guideIndex={guideIndex}
        isOver={dropIsOver}
        isDragging={isDragging}
        disabled={disabled}
        outcome={outcome}
        type={type}
      />
    </div>
  );
};

Tile.propTypes = {
  id: PropTypes.any,
  label: PropTypes.string,
  isOver: PropTypes.bool,
  type: PropTypes.string,
  empty: PropTypes.bool,
  disabled: PropTypes.bool,
  outcome: PropTypes.string,
  index: PropTypes.number,
  guideIndex: PropTypes.number,
  instanceId: PropTypes.any,
  draggable: PropTypes.bool,
};

export default Tile;
