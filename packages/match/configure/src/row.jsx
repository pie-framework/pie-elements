import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { AlertDialog, Checkbox } from '@pie-lib/config-ui';
import DragHandle from '@mui/icons-material/DragHandle';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import debug from 'debug';
import EditableHtml, { DEFAULT_PLUGINS } from '@pie-lib/editable-html';
import { color } from '@pie-lib/render-ui';

const log = debug('@pie-element:categorize:configure:choice');

export let canDrag = false;

const DragHandleStyled = styled('span')({
  cursor: 'move',
});

const RowContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  flex: 1,
}));

const RowItem = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '120px',
  padding: `0 ${theme.spacing(1)}`,
}));

const RadioButtonStyled = styled(Radio)(({ theme, error }) => ({
  '& input': {
    width: '100% !important',
  },
  '&.MuiRadio-root': {
    color: `${error ? theme.palette.error.main : color.tertiary()} !important`,
  },
}));

const DeleteIcon = styled('div')(({ theme }) => ({
  flex: 0.5,
  display: 'flex',
  justifyContent: 'center',
  minWidth: '45px',
  padding: `0 ${theme.spacing(1)}`,
}));

const QuestionText = styled(RowItem)(({ theme }) => ({
  flex: 2,
  display: 'flex',
  justifyContent: 'flex-start',
  padding: 0,
  maxWidth: 'unset',
  textAlign: 'left',
  minWidth: '200px',
  marginRight: theme.spacing(1),
  '&> div': {
    width: '100%',
  },
}));

const Separator = styled('hr')(({ theme }) => ({
  marginTop: theme.spacing(2),
  border: 0,
  borderTop: `2px solid ${theme.palette.grey['A100']}`,
  width: '100%',
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

export class Row extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    maxImageWidth: PropTypes.object,
    maxImageHeight: PropTypes.object,
    onDeleteRow: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    inputConfiguration: PropTypes.object,
    toolbarOpts: PropTypes.object,
    error: PropTypes.string,
    spellCheck: PropTypes.bool,
    minQuestions: PropTypes.number,
  };

  static defaultProps = {};

  state = {
    dialog: {
      open: false,
      text: '',
    },
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUpOnHandle);
  }

  onRowTitleChange = (rowIndex) => (value) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.rows[rowIndex].title = value;
    onChange(newModel);
  };

  onRowValueChange = (rowIndex, rowValueIndex) => (event) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    if (model.choiceMode === 'radio') {
      for (let i = 0; i < newModel.rows[rowIndex].values.length; i++) {
        newModel.rows[rowIndex].values[i] = false;
      }
    }

    newModel.rows[rowIndex].values[rowValueIndex] = event.target.checked;

    onChange(newModel);
  };

  onDeleteRow = (idx) => () => {
    const { model, onDeleteRow, minQuestions } = this.props;

    if (model.rows && model.rows.length === minQuestions) {
      this.setState({
        dialog: {
          open: true,
          text: `There should be at least ${minQuestions} question row` + (minQuestions > 1 ? 's' : '') + '.',
        },
      });
    } else {
      onDeleteRow(idx);
    }
  };

  onMouseDownOnHandle = () => {
    canDrag = true;
  };

  onMouseUpOnHandle = () => {
    canDrag = false;
  };

  render() {
    const {
      imageSupport,
      model,
      row,
      idx,
      inputConfiguration = {},
      toolbarOpts,
      spellCheck,
      error,
      maxImageWidth,
      maxImageHeight,
      uploadSoundSupport,
      mathMlOptions = {},
    } = this.props;
    const { dialog } = this.state;

    const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
      (p) => p !== 'bulleted-list' && p !== 'numbered-list',
    );

    const content = (
      <div style={{ width: '100%' }}>
        <DragHandleStyled itemID={'handle'} onMouseDown={this.onMouseDownOnHandle}>
          <DragHandle color={'primary'} />
        </DragHandleStyled>

        <RowContainer>
          <QuestionText>
            <EditableHtml
              imageSupport={imageSupport}
              autoWidthToolbar
              disableUnderline
              label={'label'}
              markup={row.title}
              onChange={this.onRowTitleChange(idx)}
              pluginProps={inputConfiguration}
              toolbarOpts={toolbarOpts}
              activePlugins={filteredDefaultPlugins}
              spellCheck={spellCheck}
              maxImageWidth={maxImageWidth}
              maxImageHeight={maxImageHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              error={error && error !== 'No correct response defined.'}
              mathMlOptions={mathMlOptions}
            />
          </QuestionText>

          {row.values.map((rowValue, rowIdx) => (
            <RowItem key={rowIdx}>
              {model.choiceMode === 'radio' ? (
                <RadioButtonStyled
                  error={error?.includes('No correct response defined.')}
                  onChange={this.onRowValueChange(idx, rowIdx)}
                  checked={rowValue === true}
                />
              ) : (
                <Checkbox
                  onChange={this.onRowValueChange(idx, rowIdx)}
                  checked={rowValue === true}
                  label={''}
                  error={error?.includes('No correct response defined.')}
                />
              )}
            </RowItem>
          ))}

          <DeleteIcon>
            <IconButton onClick={this.onDeleteRow(idx)} aria-label="Delete" size="large">
              <Delete />
            </IconButton>
          </DeleteIcon>
        </RowContainer>

        {error && <ErrorText>{error}</ErrorText>}
        <Separator />

        <AlertDialog
          open={dialog.open}
          title="Warning"
          text={dialog.text}
          onConfirm={() => this.setState({ dialog: { open: false } })}
        />
      </div>
    );

    return content;
  }
}

// Create a wrapper component for drag and drop functionality
function DraggableRow(props) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: `row-${props.row.id}`,
    data: {
      type: 'row',
      index: props.idx,
      id: props.row.id,
    },
  });

  const {
    setNodeRef: setDropRef,
    isOver,
  } = useDroppable({
    id: `row-drop-${props.row.id}`,
    data: {
      type: 'row',
      index: props.idx,
      id: props.row.id,
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isOver ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
  };

  return (
    <div ref={setDropRef} style={style}>
      <div ref={setDragRef} {...listeners} {...attributes}>
        <Row {...props} />
      </div>
    </div>
  );
}

export default DraggableRow;
