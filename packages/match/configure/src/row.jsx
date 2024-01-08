import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { AlertDialog, Checkbox } from '@pie-lib/pie-toolbox/config-ui';
import DragHandle from '@material-ui/icons/DragHandle';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import { DragSource, DropTarget } from 'react-dnd';
import debug from 'debug';
import { EditableHtml, DEFAULT_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';

const log = debug('@pie-element:categorize:configure:choice');

export let canDrag = false;

export class Row extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    maxImageWidth: PropTypes.object,
    maxImageHeight: PropTypes.object,
    onDeleteRow: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onMoveRow: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    enableImages: PropTypes.bool,
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
      classes,
      imageSupport,
      connectDragSource,
      connectDropTarget,
      isDragging,
      model,
      row,
      idx,
      enableImages,
      toolbarOpts,
      spellCheck,
      error,
      maxImageWidth,
      maxImageHeight,
      uploadSoundSupport,
      mathMlOptions = {},
    } = this.props;
    const { dialog } = this.state;
    const opacity = isDragging ? 0 : 1;

    const rowPlugins = {
      image: {
        disabled: !enableImages,
      },
      audio: { disabled: true },
      video: { disabled: true },
    };
    const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
      (p) => p !== 'bulleted-list' && p !== 'numbered-list',
    );

    const content = (
      <div style={{ opacity: opacity, width: '100%' }}>
        <span itemID={'handle'} className={classes.dragHandle} onMouseDown={this.onMouseDownOnHandle}>
          <DragHandle color={'primary'} />
        </span>

        <div className={classes.rowContainer}>
          <div className={classNames(classes.rowItem, classes.questionText)}>
            <EditableHtml
              imageSupport={imageSupport}
              autoWidthToolbar
              disableUnderline
              label={'label'}
              markup={row.title}
              onChange={this.onRowTitleChange(idx)}
              className={classes.editor}
              pluginProps={rowPlugins}
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
          </div>

          {row.values.map((rowValue, rowIdx) => (
            <div key={rowIdx} className={classes.rowItem}>
              {model.choiceMode === 'radio' ? (
                <Radio
                  className={classNames({ [classes.errorResponse]: error === 'No correct response defined.' })}
                  onChange={this.onRowValueChange(idx, rowIdx)}
                  checked={rowValue === true}
                />
              ) : (
                <Checkbox
                  onChange={this.onRowValueChange(idx, rowIdx)}
                  checked={rowValue === true}
                  label={''}
                  error={error === 'No correct response defined.'}
                />
              )}
            </div>
          ))}

          <div className={classes.deleteIcon}>
            <IconButton onClick={this.onDeleteRow(idx)} aria-label="Delete">
              <Delete />
            </IconButton>
          </div>
        </div>

        {error && <div className={classes.errorText}>{error}</div>}
        <hr className={classes.separator} />

        <AlertDialog
          open={dialog.open}
          title="Warning"
          text={dialog.text}
          onConfirm={() => this.setState({ dialog: { open: false } })}
        />
      </div>
    );

    return connectDragSource(connectDropTarget(content));
  }
}

const styles = (theme) => ({
  actions: {
    padding: 0,
    justifyContent: 'space-between',
  },
  choice: {
    padding: theme.spacing.unit,
    overflow: 'visible',
  },
  dragHandle: {
    cursor: 'move',
  },
  dragDisabled: {
    cursor: 'inherit',
  },

  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  rowItem: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: '150px',
    padding: `0 ${theme.spacing.unit}px`,
  },
  deleteIcon: {
    flex: 0.5,
    display: 'flex',
    justifyContent: 'center',
    minWidth: '48px',
    padding: `0 ${theme.spacing.unit}px`,
  },
  questionText: {
    flex: 2,
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 0,
    maxWidth: 'unset',
    textAlign: 'left',
    minWidth: '350px',
    marginRight: theme.spacing.unit,
    '&> div': {
      width: '100%',
    },
  },
  separator: {
    marginTop: theme.spacing.unit * 2,
    border: 0,
    borderTop: `2px solid ${theme.palette.grey['A100']}`,
    width: '100%',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
  errorResponse: {
    color: theme.palette.error.main,
  },
});

const StyledRow = withStyles(styles)(Row);

const NAME = 'row-config';

export const choiceSource = {
  canDrag() {
    return canDrag;
  },
  beginDrag(props) {
    return {
      id: props.row.id,
      index: props.idx,
    };
  },
};

const StyledSource = DragSource(NAME, choiceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(StyledRow);

export const choiceTarget = {
  hover() {
    log('[hover]');
  },
  drop(props, monitor) {
    const item = monitor.getItem();

    log('[drop] item: ', item, 'didDrop?', monitor.didDrop());

    props.onMoveRow(item.index, props.idx);
  },
};

const StyledSourceAndTarget = DropTarget(NAME, choiceTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(StyledSource);

export default StyledSourceAndTarget;
