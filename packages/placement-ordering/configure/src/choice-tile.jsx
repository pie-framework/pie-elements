import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import CardActions from '@mui/material/CardActions';
import DragHandle from '@mui/icons-material/DragHandle';
import IconButton from '@mui/material/IconButton';
import RemoveCircle from '@mui/icons-material/RemoveCircle';
import { styled } from '@mui/material/styles';

import { color } from '@pie-lib/render-ui';
import EditableHtml, { DEFAULT_PLUGINS } from '@pie-lib/editable-html-tip-tap';

const log = debug('@pie-element:placement-ordering:configure:choice-tile');

const StyledChoiceTile = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(1)}px 0`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  cursor: 'move'
}));

const StyledEditableHtml = styled(EditableHtml)(({ theme, isTargetPrompt }) => ({
  width: '80%',
  border: 'none',
  borderRadius: '4px',
  ...(isTargetPrompt && {
    backgroundColor: theme.palette.error.light,
  }),
}));

const StyledControls = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));

const StyledActions = styled(DragHandle)(({ theme }) => ({
  color: theme.palette.error[400],
}));

const StyledErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  marginLeft: theme.spacing(5),
  marginTop: theme.spacing(1),
}));

const StyledRemoveCircle = styled(RemoveCircle)(({ theme }) => ({
  fill: theme.palette.error[500],
}));

const StyledIconButton = styled(IconButton)({
  color: `${color.tertiary()} !important`,
});

export const ChoiceTile = (props) => {
  const {
    choice,
    index,
    onChoiceChange,
    onDelete,
    imageSupport,
    spellCheck,
    toolbarOpts,
    pluginProps,
    maxImageWidth,
    maxImageHeight,
    error,
    mathMlOptions = {},
  } = props;
  const { label, editable, type } = choice;
  const draggableId = `${type}-${choice.id}`;
  const droppableId = `${type}-drop-${choice.id}`;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: draggableId,
    data: {
      id: choice.id,
      index,
      type,
    },
  });

  const {
    setNodeRef: setDropRef,
  } = useDroppable({
    id: droppableId,
    data: {
      id: choice.id,
      index,
      type,
    },
  });

  const onLabelChange = (label) => {
    choice.label = label;
    onChoiceChange(choice);
  };

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    width: '100%',
  };

  const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
    (p) => p !== 'bulleted-list' && p !== 'numbered-list',
  );

  return (
    <div ref={setDropRef}>
      <div ref={setDragRef} {...listeners} {...attributes}>
        <StyledChoiceTile style={style}>
          <div style={{ width: '100%', display: 'flex' }}>
            <CardActions>
              <StyledActions />
            </CardActions>

            <StyledEditableHtml
              disabled={!editable}
              placeholder={type !== 'target' && !label.includes('data-latex') ? 'Enter a choice' : ''}
              markup={label}
              imageSupport={imageSupport || undefined}
              onChange={onLabelChange}
              pluginProps={pluginProps}
              toolbarOpts={toolbarOpts}
              activePlugins={filteredDefaultPlugins}
              spellCheck={spellCheck}
              autoWidthToolbar
              maxImageWidth={maxImageWidth}
              maxImageHeight={maxImageHeight}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              error={editable && error}
              mathMlOptions={mathMlOptions}
            />

            {editable && (
              <StyledControls>
                <StyledIconButton onClick={onDelete} size="large">
                  <StyledRemoveCircle />
                </StyledIconButton>
              </StyledControls>
            )}
          </div>

          {editable && error && <StyledErrorText>{error}</StyledErrorText>}
        </StyledChoiceTile>
      </div>
    </div>
  );
};

ChoiceTile.propTypes = {
  id: PropTypes.any,
  maxImageHeight: PropTypes.object,
  maxImageWidth: PropTypes.object,
  label: PropTypes.string,
  isOver: PropTypes.bool,
  type: PropTypes.string,
  empty: PropTypes.bool,
  disabled: PropTypes.bool,
  outcome: PropTypes.object,
  index: PropTypes.number,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }),
  choice: PropTypes.object,
  choices: PropTypes.array.isRequired,
  onChoiceChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  toolbarOpts: PropTypes.object,
  pluginProps: PropTypes.object,
  choicesLabel: PropTypes.string,
  error: PropTypes.string,
  spellCheck: PropTypes.bool,
  mathMlOptions: PropTypes.object,
};

export default ChoiceTile;
