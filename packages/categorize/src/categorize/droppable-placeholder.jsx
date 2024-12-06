import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { PlaceHolder } from '@pie-lib/pie-toolbox/drag';

const DroppablePlaceholder = ({
                                  children,
                                  className,
                                  grid,
                                  disabled,
                                  choiceBoard,
                                  minRowHeight,
                                  onDropChoice,
                              }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'categorize',
        drop: (item) => onDropChoice(item),
        canDrop: () => !disabled,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={{ flex: 1, minHeight: minRowHeight || '80px' }}>
            <PlaceHolder
                className={className}
                isOver={isOver}
                grid={grid}
                disabled={disabled}
                choiceBoard={choiceBoard}
                isCategorize
            >
                {children}
            </PlaceHolder>
        </div>
    );
};

DroppablePlaceholder.propTypes = {
    choiceBoard: PropTypes.bool,
    isOver: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    className: PropTypes.string,
    grid: PropTypes.object,
    disabled: PropTypes.bool,
    minRowHeight: PropTypes.string,
    onDropChoice: PropTypes.func.isRequired,
};

export default DroppablePlaceholder;
