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
import { DragSource, DropTarget } from 'react-dnd';
import debug from 'debug';
import { uid } from '@pie-lib/drag';
import { multiplePlacements } from '../../utils';
import flow from 'lodash/flow';

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

export class Choice extends React.Component {
  static propTypes = {
    allowMultiplePlacements: PropTypes.string,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    choice: PropTypes.object.isRequired,
    deleteFocusedEl: PropTypes.func,
    focusedEl: PropTypes.number,
    index: PropTypes.number,
    lockChoiceOrder: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
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
  };

  static defaultProps = {};

  changeContent = (content) => {
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

  isCheckboxShown = (allowMultiplePlacements) => allowMultiplePlacements === multiplePlacements.perChoice;

  render() {
    const {
      allowMultiplePlacements,
      classes,
      className,
      choice,
      deleteFocusedEl,
      focusedEl,
      index,
      onDelete,
      connectDropTarget,
      connectDragSource,
      connectDragPreview,
      imageSupport,
      spellCheck,
      toolbarOpts,
      error,
      maxImageWidth,
      maxImageHeight,
      uploadSoundSupport,
    } = this.props;

    const showRemoveAfterPlacing = this.isCheckboxShown(allowMultiplePlacements);
    const draggable = canDrag(this.props);

    return (
      <Card className={classNames(classes.choice, className)}>
        <CardActions className={classes.actions}>
          {connectDragSource(
            connectDropTarget(
              <span className={classNames(classes.dragHandle, draggable === false && classes.dragDisabled)}>
                <DragHandle color={draggable ? 'primary' : 'disabled'} />
              </span>,
            ),
          )}
        </CardActions>
        {connectDragPreview(
          <span>
            <InputHeader
              imageSupport={imageSupport}
              focusedEl={focusedEl}
              deleteFocusedEl={deleteFocusedEl}
              index={index}
              label={choice.content}
              onChange={this.changeContent}
              onDelete={onDelete}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheck}
              error={error}
              maxImageWidth={maxImageWidth}
              maxImageHeight={maxImageHeight}
              uploadSoundSupport={uploadSoundSupport}
            />
            {error && <div className={classes.errorText}>{error}</div>}
          </span>,
        )}

        <CardActions className={classes.actions}>
          <DeleteButton label={'delete'} onClick={onDelete} />
          {showRemoveAfterPlacing && (
            <Checkbox
              mini
              label={'Remove after placing'}
              checked={choice.categoryCount === 1}
              onChange={this.changeCategoryCount}
            />
          )}
        </CardActions>
      </Card>
    );
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
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingBottom: theme.spacing.unit,
  },
});

const StyledChoice = withStyles(styles)(Choice);

export const spec = {
  canDrag,
  beginDrag: (props) => {
    const out = {
      id: props.choice.id,
      index: props.index,
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
  },
};

export const specTarget = {
  drop: (props, monitor) => {
    log('[drop] props: ', props);
    const item = monitor.getItem();
    props.rearrangeChoices(item.index, props.index);
  },
  canDrop: (props, monitor) => {
    const item = monitor.getItem();
    return props.choice.id !== item.id;
  },
};

export default uid.withUid(
  flow(
    DragSource(
      ({ uid }) => uid,
      spec,
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
      }),
    ),
    DropTarget(
      ({ uid }) => uid,
      specTarget,
      (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
      }),
    ),
  )(StyledChoice),
);
