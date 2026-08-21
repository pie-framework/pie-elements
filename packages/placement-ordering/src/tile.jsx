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

const StyledTileContent = styled('div')(
  ({ theme, isDragging, isSelected, isOver, disabled, outcome, label, type }) => ({
    cursor: disabled ? 'not-allowed' : 'grab',
    width: '100%',
    height: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: type === 'choice' || type === 'target' ? `1px solid ${color.border()}` : '1px solid transparent',
    backgroundColor: type === 'choice' || type === 'target' ? color.background() : 'transparent',
    transition:
      type === 'choice' || type === 'target'
        ? 'background-color 150ms ease, border-color 150ms ease, opacity 150ms ease'
        : 'none',
    pointerEvents: 'none',
    userSelect: 'none',

    ...((type === 'choice' || type === 'target') && {
      '&:hover': {
        backgroundColor: disabled ? color.background() : color.secondary(),
        // The disabled branch says "disabled", so it takes the disabled token rather
        // than the neutral stroke the resting state uses.
        borderColor: disabled ? color.disabled() : theme.palette.primary.main,
        transform: disabled ? 'none' : 'scale(1.02)',
      },
    }),

    // Apply conditional styles based on props (only if not empty spacing tile)
    ...((type === 'choice' || type === 'target') &&
      isOver &&
      !disabled && {
        opacity: 0.4,
        backgroundColor: color.primaryLight(),
        borderColor: theme.palette.primary.main,
        borderStyle: 'dashed',
        transform: 'scale(1.05)',
      }),

    ...((type === 'choice' || type === 'target') &&
      (isDragging || isSelected) &&
      !disabled && {
        opacity: 0.6,
        backgroundColor: color.secondaryLight(),
        transform: 'scale(1.05) rotate(2deg)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        cursor: 'grabbing',
      }),

    ...((type === 'choice' || type === 'target') &&
      disabled && {
        cursor: 'not-allowed',
        '&:hover': {
          backgroundColor: color.background(),
          transform: 'none',
        },
      }),

    ...((type === 'choice' || type === 'target') &&
      outcome === 'incorrect' && {
        border: `1px solid ${color.incorrect()}`,
      }),

    ...((type === 'choice' || type === 'target') &&
      outcome === 'correct' && {
        border: `1px solid ${color.correct()}`,
      }),

    ...(!label && {
      border: 'none',
      '&:hover': {
        backgroundColor: 'unset',
      },
    }),
  }),
);

const TileContent = (props) => {
  const { type, isDragging, isSelected, empty, isOver, label, disabled, outcome, guideIndex } = props;

  if (empty) {
    return <Holder type={type} index={guideIndex} isOver={isOver} disabled={disabled} />;
  } else {
    return (
      <StyledTileContent
        type={type}
        isDragging={isDragging}
        isSelected={isSelected}
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
    tileIndex,
    selectedChoice,
    onChoiceClick,
    onPlacementClick,
  } = props;

  // Use type + tileIndex in the IDs to guarantee uniqueness in all modes.
  // In includeTargets mode, a choice (id:'c1', type:'choice') and a target (id:'c1', type:'target')
  // can coexist — the type differentiates them.
  // tileIndex (array position from tiler) ensures empty placeholders are also unique.
  const dragId = `tile-${type}-${id != null ? id : 'empty'}-${tileIndex}-${instanceId}`;
  const dropId = `drop-${type}-${id != null ? id : 'empty'}-${tileIndex}-${instanceId}`;

  // Built once and reused for dnd-kit's own drag/drop data and for the click handlers
  // below, so a click carries exactly the same shape a real drag would.
  const tileData = { id, type, instanceId, value: label, index };

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: dragId,
    data: tileData,
    disabled: !draggable || disabled,
  });

  const { setNodeRef: setDropRef, isOver: dropIsOver } = useDroppable({
    id: dropId,
    data: tileData,
    // Disable droppable on the tile currently being dragged so closestCenter
    // cannot pick it as the drop target (prevents self-collision and wrong matches).
    disabled: isDragging,
  });

  const isSelected =
    !!selectedChoice &&
    selectedChoice.type === tileData.type &&
    selectedChoice.id === tileData.id &&
    selectedChoice.index === tileData.index;

  // dnd-kit's own isOver (dropIsOver) only reflects real collision detection during an
  // active drag, so it stays false while a placement area is merely a candidate for a
  // pending click-based placement. Track hovering locally and fold it into the same
  // isOver signal the styling below already uses, so hovering a response area while
  // something is selected gets the exact same treatment as hovering it during a real
  // drag — one code path, no duplicated CSS.
  const [isHovered, setIsHovered] = React.useState(false);
  const hasSelection = !!selectedChoice && !disabled;
  const showsHoverEffect = dropIsOver || (type === 'target' && hasSelection && isHovered);

  // Click-to-select/click-to-place (both choices and targets are handled by this same
  // component, differentiated by `type`):
  //  - Choice tile: selects/switches/deselects it, UNLESS a placed answer (a "target")
  //    is currently selected, in which case clicking any choice-row tile returns it to
  //    the choices column/row (choice -> choice has no placement meaning in the
  //    reducer, so there's no ambiguity there).
  //  - Target tile: clicking the already-selected placed answer again deselects it;
  //    clicking it while something else is selected places that selection here
  //    (empty or occupied); clicking a filled target with nothing selected selects
  //    that placed answer for moving, the same way Tab+Space/Enter does. An empty
  //    target with nothing selected is a no-op.
  const handleClick = () => {
    if (disabled) return;

    if (type === 'choice') {
      if (selectedChoice?.type === 'target') {
        onPlacementClick?.(tileData);
      } else if (draggable) {
        onChoiceClick?.(tileData);
      }
    } else if (type === 'target') {
      if (isSelected) {
        onChoiceClick?.(tileData);
      } else if (selectedChoice) {
        onPlacementClick?.(tileData);
      } else if (draggable) {
        onChoiceClick?.(tileData);
      }
    }
  };

  // dnd-kit's own draggable attributes (spread below) already make a draggable tile a
  // native Tab stop with its own Space/Enter activation. An empty tile is never
  // draggable, so without this it wouldn't be reachable by Tab at all — needed for
  // "select a choice, then Tab to a placement area and press Space/Enter" to work.
  // Gated to non-draggable tiles specifically so it never overrides dnd-kit's own
  // keydown handling (see the conditional spread order below).
  const isNativeTabStop = !(draggable && !disabled) && !disabled;

  const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

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
    cursor: disabled ? 'not-allowed' : type === 'target' && hasSelection ? 'pointer' : isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
  };

  return (
    <div
      ref={setRefs}
      style={style}
      role={isNativeTabStop ? 'button' : undefined}
      tabIndex={isNativeTabStop ? 0 : undefined}
      onKeyDown={isNativeTabStop ? handleKeyDown : undefined}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...(draggable && !disabled ? { ...listeners, ...attributes } : {})}
    >
      <TileContent
        label={label}
        id={id}
        empty={empty}
        index={index}
        guideIndex={guideIndex}
        isOver={showsHoverEffect}
        isDragging={isDragging}
        isSelected={isSelected}
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
  tileIndex: PropTypes.number,
  selectedChoice: PropTypes.object,
  onChoiceClick: PropTypes.func,
  onPlacementClick: PropTypes.func,
};

export default Tile;
