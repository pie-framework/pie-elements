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

const StyledTileContent = styled('div')(({ theme, isDragging, isOver, disabled, outcome, label, type }) => ({
  cursor: disabled ? 'not-allowed' : 'grab',
  width: '100%',
  height: '100%',
  padding: '10px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  border: (type === 'choice') ? `1px solid ${theme.palette.grey[400]}` : '1px solid transparent',
  backgroundColor: (type === 'choice') ? color.background() : 'transparent',
  transition: (type === 'choice') ? 'background-color 150ms ease, border-color 150ms ease, opacity 150ms ease' : 'none',
  pointerEvents: 'none',
  userSelect: 'none',

  ...((type === 'choice') && {
    '&:hover': {
      backgroundColor: disabled ? color.background() : color.secondary(),
      borderColor: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
      transform: disabled ? 'none' : 'scale(1.02)',
    },
  }),

  // Apply conditional styles based on props (only if not empty spacing tile)
  ...((type === 'choice') && isOver && !disabled && {
    opacity: 0.4,
    backgroundColor: color.primaryLight(),
    borderColor: theme.palette.primary.main,
    borderStyle: 'dashed',
    transform: 'scale(1.05)',
  }),

  ...((type === 'choice') && isDragging && !disabled && {
    opacity: 0.6,
    backgroundColor: color.secondaryLight(),
    transform: 'scale(1.05) rotate(2deg)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    cursor: 'grabbing',
  }),

  ...((type === 'choice') && disabled && {
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: color.background(),
      transform: 'none',
    },
  }),

  ...((type === 'choice') && outcome === 'incorrect' && {
    border: `1px solid ${color.incorrect()}`,
  }),

  ...((type === 'choice') && outcome === 'correct' && {
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
    console.log('TileContent render, props: ', props);
    return (
      <StyledTileContent
        type={type}
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
    overflow: 'visible',
    padding: 0,
    margin: 0,
    textAlign: 'center',
    pointerEvents: 'auto',
    cursor: disabled ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
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
