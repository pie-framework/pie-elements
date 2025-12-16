import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';
import { ICADroppablePlaceholder } from '@pie-lib/drag';

import PossibleResponse from './possible-response';

const BaseContainer = styled('div')(({ theme }) => ({
  backgroundColor: color.background(),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
}));

const PossibleResponses = ({
  canDrag,
  data,
  onDragBegin,
  answerChoiceTransparency,
  customStyle,
  isVertical,
  minHeight,
}) => (
  <BaseContainer style={customStyle}>
    <ICADroppablePlaceholder id="ica-board" disabled={!canDrag} isVerticalPool={isVertical} minHeight={minHeight}>
      {(data || []).map((item) => (
        <PossibleResponse
          canDrag={canDrag}
          key={item.id}
          data={item}
          onDragBegin={onDragBegin}
          answerChoiceTransparency={answerChoiceTransparency}
          containerStyle={{ margin: '4px' }}
        />
      ))}
    </ICADroppablePlaceholder>
  </BaseContainer>
);

PossibleResponses.propTypes = {
  canDrag: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  onDragBegin: PropTypes.func.isRequired,
  answerChoiceTransparency: PropTypes.bool,
  customStyle: PropTypes.object,
  isVertical: PropTypes.bool,
  minHeight: PropTypes.number,
};

export default PossibleResponses;
