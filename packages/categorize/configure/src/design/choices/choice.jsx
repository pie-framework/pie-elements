import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import InputHeader from '../input-header';
import { Checkbox } from '@pie-lib/config-ui';
import { DeleteButton } from '../buttons';
import DragHandle from '@material-ui/icons/DragHandle';
import { DragSource } from 'react-dnd';
import debug from 'debug';
import { uid } from '@pie-lib/drag';

const log = debug('@pie-element:categorize:configure:choice');

const canDrag = props => {
  const count = props.choice.categoryCount || 0;
  if (count === 0) {
    return true;
  } else {
    return props.correctResponseCount < count;
  }
};

export class Choice extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    choice: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    correctResponseCount: PropTypes.number.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    toolbarOpts: PropTypes.object,
    error: PropTypes.string
  };

  static defaultProps = {};

  changeContent = content => {
    const { onChange, choice } = this.props;
    choice.content = content;
    onChange(choice);
  };

  changeCategoryCount = () => {
    const { onChange, choice } = this.props;
    if (choice.categoryCount === 1) {
      choice.categoryCount = 0;
    } else {
      choice.categoryCount = 1;
    }
    onChange(choice);
  };

  render() {
    const {
      classes,
      className,
      choice,
      onDelete,
      connectDragSource,
      connectDragPreview,
      imageSupport,
      spellCheck,
      toolbarOpts,
      error
    } = this.props;

    const draggable = canDrag(this.props);

    return (
      <Card className={classNames(classes.choice, className)}>
        <CardActions className={classes.actions}>
          {connectDragSource(
            <span
              className={classNames(
                classes.dragHandle,
                draggable === false && classes.dragDisabled
              )}
            >
              <DragHandle color={draggable ? 'primary' : 'disabled'} />
            </span>
          )}
        </CardActions>
        {connectDragPreview(
          <span>
            <InputHeader
              imageSupport={imageSupport}
              label={choice.content}
              onChange={this.changeContent}
              onDelete={onDelete}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheck}
              error={error}
            />
            {error && <div className={classes.errorText}>{error}</div>}
          </span>
        )}

        <CardActions className={classes.actions}>
          <DeleteButton label={'delete'} onClick={onDelete} />
          <Checkbox
            mini
            label={'Remove after placing'}
            checked={choice.categoryCount === 1}
            onChange={this.changeCategoryCount}
          />
        </CardActions>
      </Card>
    );
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
  errorText: {
    fontSize: '11px',
    color: 'red',
    paddingBottom: '5px'
  },
});

const StyledChoice = withStyles(styles)(Choice);

export const spec = {
  canDrag,
  beginDrag: props => {
    const out = {
      id: props.choice.id
    };
    log('[beginDrag] out:', out);
    return out;
  },
  endDrag: (props, monitor) => {
    if (!monitor.didDrop()) {
      const item = monitor.getItem();
      if (item.categoryId) {
        log('wasnt droppped - what to do?');
        props.onRemoveChoice(item);
      }
    }
  }
};

const DraggableChoice = DragSource(
  ({ uid }) => uid,
  spec,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(StyledChoice);

export default uid.withUid(DraggableChoice);
