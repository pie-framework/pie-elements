import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import InputHeader from '../input-header';
import { Checkbox } from '@pie-lib/config-ui';
import { DeleteButton } from '../buttons';
import DragHandle from '@mui/icons-material/DragHandle';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import debug from 'debug';
import { uid } from '@pie-lib/drag';
import { multiplePlacements } from '../../utils';

const log = debug('@pie-element:categorize:configure:choice');

const canDrag = (props) => {
  if (props.lockChoiceOrder) {
    return true;
  }
  const count = props.choice.categoryCount || 0;
  if (count === 0) {
    return true;
  } else {
    return props.correctResponseCount < count;
  }
};

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: '196px',
  padding: theme.spacing(1),
  overflow: 'visible',
}));

const StyledCardActions = styled(CardActions)({
  padding: 0,
  justifyContent: 'space-between',
});

const DragHandleContainer = styled('span', {
  shouldForwardProp: (prop) => prop !== 'draggable',
})(({ draggable }) => ({
  cursor: draggable ? 'move' : 'inherit',
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingBottom: theme.spacing(1),
}));

const Choice = ({
  allowMultiplePlacements,
  configuration,
  choice,
  deleteFocusedEl,
  focusedEl,
  index,
  onDelete,
  onChange,
  correctResponseCount,
  lockChoiceOrder,
  imageSupport,
  spellCheck,
  toolbarOpts,
  error,
  maxImageWidth,
  maxImageHeight,
  uploadSoundSupport,
}) => {
  const draggable = canDrag({ choice, correctResponseCount, lockChoiceOrder });

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    isDragging,
  } = useDraggable({
    id: `choice-${choice.id}`,
    data: {
      id: choice.id,
      index,
      type: 'choice',
    },
    disabled: !draggable,
  });

  const {
    setNodeRef: setDropNodeRef,
  } = useDroppable({
    id: `choice-drop-${choice.id}`,
    data: {
      id: choice.id,
      index,
      type: 'choice',
    },
  });

  const changeContent = (content) => {
    choice.content = content;
    onChange(choice);
  };

  const changeCategoryCount = () => {
    if (choice.categoryCount === 1) {
      choice.categoryCount = 0;
    } else {
      choice.categoryCount = 1;
    }
    onChange(choice);
  };

  const isCheckboxShown = (allowMultiplePlacements) => allowMultiplePlacements === multiplePlacements.perChoice;

  const showRemoveAfterPlacing = isCheckboxShown(allowMultiplePlacements);

  const setNodeRef = (element) => {
    setDragNodeRef(element);
    setDropNodeRef(element);
  };

  return (
    <StyledCard ref={setNodeRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <StyledCardActions>
        <DragHandleContainer draggable={draggable} {...dragAttributes} {...dragListeners}>
          <DragHandle color={draggable ? 'primary' : 'disabled'} />
        </DragHandleContainer>
      </StyledCardActions>
      <InputHeader
        imageSupport={imageSupport}
        focusedEl={focusedEl}
        deleteFocusedEl={deleteFocusedEl}
        index={index}
        label={choice.content}
        onChange={changeContent}
        onDelete={onDelete}
        toolbarOpts={toolbarOpts}
        spellCheck={spellCheck}
        error={error}
        maxImageWidth={maxImageWidth}
        maxImageHeight={maxImageHeight}
        uploadSoundSupport={uploadSoundSupport}
        configuration={configuration}
      />
      {error && <ErrorText>{error}</ErrorText>}

      <StyledCardActions>
        <DeleteButton label={'delete'} onClick={onDelete} />
        {showRemoveAfterPlacing && (
          <Checkbox
            mini
            label={'Remove after placing'}
            checked={choice.categoryCount === 1}
            onChange={changeCategoryCount}
          />
        )}
      </StyledCardActions>
    </StyledCard>
  );
};

Choice.propTypes = {
  allowMultiplePlacements: PropTypes.string,
  configuration: PropTypes.object.isRequired,
  choice: PropTypes.object.isRequired,
  deleteFocusedEl: PropTypes.func,
  focusedEl: PropTypes.number,
  index: PropTypes.number,
  lockChoiceOrder: PropTypes.bool,
  maxImageHeight: PropTypes.object,
  maxImageWidth: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  correctResponseCount: PropTypes.number.isRequired,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
  toolbarOpts: PropTypes.object,
  error: PropTypes.string,
  uploadSoundSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
  spellCheck: PropTypes.bool,
  rearrangeChoices: PropTypes.func,
};

export default uid.withUid(Choice);
