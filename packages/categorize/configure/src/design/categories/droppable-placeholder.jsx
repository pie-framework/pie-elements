import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ChoicePreview from './choice-preview';
import { useDroppable } from '@dnd-kit/core';
import { uid, PlaceHolder } from '@pie-lib/drag';
import debug from 'debug';

const log = debug('@pie-element:categorize:configure');

const HelperText = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: theme.typography.fontSize - 2,
  color: `rgba(${theme.palette.common.black}, 0.4)`,
  width: '100%',
  height: '100%',
}));

const Helper = () => <HelperText>Drag your correct answers here</HelperText>;

const DroppablePlaceholderContainer = styled('div')({
  minHeight: '100px',
});

const Previews = ({ alternateResponseIndex, category, choices, onDeleteChoice }) => (
  <React.Fragment>
    {(choices || []).map((c, index) =>
      c && (
        <ChoicePreview
          alternateResponseIndex={alternateResponseIndex}
          category={category}
          choice={c}
          key={index}
          choiceIndex={index}
          onDelete={(choice) => onDeleteChoice(choice, index)}
        />
      )
    )}
  </React.Fragment>
);

Previews.propTypes = {
  alternateResponseIndex: PropTypes.number,
  category: PropTypes.object,
  choices: PropTypes.array,
  onDeleteChoice: PropTypes.func,
};

const DroppablePlaceHolder = ({
  alternateResponseIndex,
  category,
  className,
  choices,
  onDeleteChoice,
  categoryId,
  isAlternate
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${categoryId}-${isAlternate ? 'alternate' : 'standard'}`,
    data: {
      accepts: ['choice', 'choice-preview'],
      alternateResponseIndex,
      categoryId,
      type: isAlternate ? 'category-alternate' : 'category',
      id: categoryId,
    },
  });

  return (
    <div ref={setNodeRef} className={className}>
      <DroppablePlaceholderContainer>
        <PlaceHolder
          isOver={isOver}
          extraStyles={{
            width: '100%',
            minHeight: '100px',
            height: 'auto',
          }}>
          {(choices || []).length === 0 ? (
            <Helper />
          ) : (
            <Previews
              alternateResponseIndex={alternateResponseIndex}
              category={category}
              choices={choices}
              onDeleteChoice={onDeleteChoice}
            />
          )}
        </PlaceHolder>
      </DroppablePlaceholderContainer>
    </div>
  );
};

DroppablePlaceHolder.propTypes = {
  alternateResponseIndex: PropTypes.number,
  category: PropTypes.object,
  className: PropTypes.string,
  choices: PropTypes.array,
  onDeleteChoice: PropTypes.func,
  categoryId: PropTypes.string.isRequired,
  isAlternate: PropTypes.bool,
};

export default uid.withUid(DroppablePlaceHolder);
