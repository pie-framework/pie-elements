import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import { useDraggable } from '@dnd-kit/core';
import { uid } from '@pie-lib/drag';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { color } from '@pie-lib/render-ui';

const log = debug('@pie-ui:categorize:choice');

export const ChoiceType = {
  content: PropTypes.string.isRequired,
  id: PropTypes.string,
};

const ChoiceContainer = styled('div', {
  shouldForwardProp: (prop) => !['isDragging', 'disabled', 'correct'].includes(prop),
})(({ isDragging, disabled, correct }) => ({
  direction: 'initial',
  cursor: disabled ? 'not-allowed' : isDragging ? 'move' : 'pointer',
  width: '100%',
  borderRadius: '6px',
  ...(correct === true && {
    border: `solid 2px ${color.correct()}`,
  }),
  ...(correct === false && {
    border: `solid 2px ${color.incorrect()}`,
  }),
}));

const StyledCard = styled(Card)({
  color: color.text(),
  backgroundColor: color.background(),
  width: '100%',
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  color: color.text(),
  backgroundColor: color.white(),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
  borderRadius: '4px',
  border: '1px solid',
}));

export class Layout extends React.Component {
  static propTypes = {
    ...ChoiceType,
    disabled: PropTypes.bool,
    correct: PropTypes.bool,
    isDragging: PropTypes.bool,
  };
  static defaultProps = {};
  render() {
    const { content, isDragging, disabled, correct } = this.props;

    return (
      <ChoiceContainer isDragging={isDragging} disabled={disabled} correct={correct}>
        <StyledCard>
          <StyledCardContent dangerouslySetInnerHTML={{ __html: content }} />
        </StyledCard>
      </ChoiceContainer>
    );
  }
}

const DraggableChoice = ({ id, content, disabled, correct, extraStyle, categoryId, choiceIndex }) => {
  // Generate unique draggable ID for each instance
  // If in choices board (categoryId is undefined), use 'board' suffix
  // If in a category, include categoryId and choiceIndex to make it unique
  const draggableId = categoryId !== undefined ? `choice-${id}-${categoryId}-${choiceIndex}` : `choice-${id}-board`;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: draggableId,
    data: {
      id,
      categoryId,
      choiceIndex,
      value: content,
      itemType: 'categorize',
      type: 'choice',
    },
    disabled,
  });

  return (
    <div ref={setNodeRef} style={{ margin: '4px', ...extraStyle }} {...listeners} {...attributes}>
      <Layout id={id} content={content} disabled={disabled} correct={correct} isDragging={isDragging} />
    </div>
  );
};

DraggableChoice.propTypes = {
  ...ChoiceType,
  extraStyle: PropTypes.object,
  categoryId: PropTypes.string,
  choiceIndex: PropTypes.number,
  onRemoveChoice: PropTypes.func,
};

export default uid.withUid(DraggableChoice);
