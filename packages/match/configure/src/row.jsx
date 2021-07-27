import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Checkbox } from '@pie-lib/config-ui';
import DragHandle from '@material-ui/icons/DragHandle';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import { DragSource, DropTarget } from 'react-dnd';
import debug from 'debug';
import EditableHtml from '@pie-lib/editable-html';
import { InfoDialog } from './common';

const log = debug('@pie-element:categorize:configure:choice');

export let canDrag = false;

export class Row extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    onDeleteRow: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onMoveRow: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    enableImages: PropTypes.bool,
    toolbarOpts: PropTypes.object
  };

  static defaultProps = {};

  state = {
    dialog: {
      open: false,
      message: ''
    }
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUpOnHandle);
  }

  onRowTitleChange = rowIndex => value => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    const rows = newModel.rows || []
    const currentRow =  rows[rowIndex] && rows[rowIndex].title;

    const sameValue = rows.filter(row => {
      const wasChanged = currentRow !== value && `<div>${currentRow}</div>` !== value;
      const sameValueEntered = row.title === value || `<div>${row.title}</div>` === value;

      return wasChanged && sameValueEntered;
    });

    const empty = value === '<div></div>';

    if (sameValue.length || empty) {
      this.setState({
        dialog: {
          open: true,
          message: 'The question row headings must be non-blank and unique.',
          onOk: () => {
            this.setState(
              {
                dialog: {
                  open: false,
                }
              }
            );
          }
        }
      });
    } else {
      newModel.rows[rowIndex].title = value;

      onChange(newModel);
    }
  };

  onRowValueChange = (rowIndex, rowValueIndex) => event => {
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
    const { model, onDeleteRow } = this.props;

    if(model.rows && model.rows.length === 1) {
      this.setState({
        dialog: {
          open: true,
          message: 'There has to be at least one question row.',
          onOk: () => {
            this.setState(
              {
                dialog: {
                  open: false,
                }
              }
            );
          }
        }
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
      toolbarOpts
    } = this.props;
    const { dialog } = this.state;
    const opacity = isDragging ? 0 : 1;

    const rowPlugins = {
      image: {
        disabled: !enableImages
      },
      audio: { disabled: true },
      video: { disabled: true }
    };

    const content = (
      <div style={{
        opacity: opacity
      }}>
        <span
          itemID={'handle'}
          className={classes.dragHandle}
          onMouseDown={this.onMouseDownOnHandle}
        >
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
              allowValidation
            />
          </div>
          {row.values.map((rowValue, rowIdx) => (
            <div key={rowIdx} className={classes.rowItem}>
              {model.choiceMode === 'radio' ? (
                <Radio
                  onChange={this.onRowValueChange(idx, rowIdx)}
                  checked={rowValue === true}
                />
              ) : (
                <Checkbox
                  onChange={this.onRowValueChange(idx, rowIdx)}
                  checked={rowValue === true}
                  label={''}
                />
              )}
            </div>
          ))}
          <div className={classes.deleteIcon}>
            <Button onClick={this.onDeleteRow(idx)}>
              <Delete className={classes.deleteIcon} />
            </Button>
          </div>
        </div>
        <hr className={classes.separator} />
        <InfoDialog
          title={dialog.message}
          open={dialog.open}
          onOk={dialog.onOk}
        />
      </div>
    );

    return connectDragSource(connectDropTarget(content));
  }
}
const styles = theme => ({
  actions: {
    padding: 0,
    justifyContent: 'space-between'
  },
  choice: {
    padding: theme.spacing.unit,
    overflow: 'visible'
  },
  dragHandle: {
    cursor: 'move'
  },
  dragDisabled: {
    cursor: 'inherit'
  },

  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column'
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  rowItem: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    '&> div': {
      width: '100%'
    }
  },
  deleteIcon: {
    flex: 0.5,
    minWidth: '88px',
  },
  questionText: {
    flex: 2,
    display: 'flex',
    justifyContent: 'flex-start'
  },
  separator: {
    marginTop: theme.spacing.unit * 2,
    border: 0,
    borderTop: '2px solid lightgray',
    width: '100%'
  }
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
      index: props.idx
    };
  }
};

const StyledSource = DragSource(NAME, choiceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(StyledRow);

export const choiceTarget = {
  hover() {
    log('[hover]');
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    log('[drop] item: ', item, 'didDrop?', monitor.didDrop());
    props.onMoveRow(item.index, props.idx);
  }
};

const StyledSourceAndTarget = DropTarget(NAME, choiceTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(StyledSource);

export default StyledSourceAndTarget;
