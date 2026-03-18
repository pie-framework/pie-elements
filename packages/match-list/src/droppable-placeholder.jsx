import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';
import { MatchDroppablePlaceholder } from '@pie-lib/drag';

const Container = styled('div')(({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minHeight: 50,
    transition: 'background-color 200ms ease',
}));

export function DroppablePlaceholder({ id, disabled, children, ...rest }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id || 'choices-pool',
        data: { type: 'choices-pool' },
        disabled,
    });

    return (
        <Container
            ref={setNodeRef}
            style={{ backgroundColor: isOver ? 'rgba(0,0,0,0.05)' : 'transparent' }}
            {...rest}
        >
            <MatchDroppablePlaceholder id={id} disabled={disabled}>
                {children}
            </MatchDroppablePlaceholder>
        </Container>
    );
}

DroppablePlaceholder.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    children: PropTypes.node,
};

export default DroppablePlaceholder;
