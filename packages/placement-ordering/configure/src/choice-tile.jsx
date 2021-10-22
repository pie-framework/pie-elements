import EditableHtml from '@pie-lib/editable-html';
import CardActions from '@material-ui/core/CardActions';
import DragHandle from '@material-ui/icons/DragHandle';

import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import { InfoDialog } from './choice-editor';

const log = debug('@pie-element:placement-ordering:configure:choice-tile');

export class ChoiceTile extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any,
    label: PropTypes.string,
    isOver: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    type: PropTypes.string,
    empty: PropTypes.bool,
    disabled: PropTypes.bool,
    outcome: PropTypes.object,
    index: PropTypes.number,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    choice: PropTypes.object,
    choices: PropTypes.array.isRequired,
    onChoiceChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    disableImages: PropTypes.bool,
    toolbarOpts: PropTypes.object,
    choicesLabel: PropTypes.string
  };

  state = {
    dialog: {
      open: false
    }
  };

  onLabelChange = label => {
    const { choice, onChoiceChange, choices, choicesLabel } = this.props;
    const currentValue = choice.label;
    const sameValue = choices.filter(choice => {
      const wasChanged = currentValue !== label && `<div>${currentValue}</div>` !== label;
      const sameValueEntered = choice.label === label || `<div>${choice.label}</div>` === label;

      return wasChanged && sameValueEntered;
    });

    const empty = label === '<div></div>';

    if (sameValue.length || empty) {
      this.setState({
        dialog: {
          open: true,
          message: `Each of the ${choicesLabel} must be non-empty and unique.`,
          onOk: () => {
            this.setState(
              {
                dialog: {
                  open: false
                }
              }
            );
          }
        }
      });
    } else {
      choice.label = label;
      onChoiceChange(choice);
    }
  };

  render() {
    const {
      choice: {
        label,
        editable
      },
      isDragging,
      connectDragSource,
      connectDropTarget,
      classes,
      onDelete,
      imageSupport,
      disableImages,
      toolbarOpts
    } = this.props;
    const { dialog } = this.state;

    const dragSourceOpts = {}; //dropEffect: moveOnDrag ? 'move' : 'copy'};

    const choicePlugins = {
      image: {
        disabled: disableImages
      },
      audio: { disabled: true },
      video: { disabled: true }
    };

    const opacity = isDragging ? 0 : 1;
    const markup = (
      <div className={classes.choiceTile} style={{ opacity: opacity, width: '100%' }}>
        <CardActions>
            <span className={classNames(classes.dragHandle )}>
              <DragHandle className={classes.actions} />
            </span>
        </CardActions>
        <EditableHtml
          disabled={!editable}
          className={classNames(classes.prompt, !editable && classes.targetPrompt)}
          placeholder="Enter a choice"
          markup={label}
          imageSupport={imageSupport || undefined}
          onChange={this.onLabelChange}
          pluginProps={choicePlugins}
          toolbarOpts={toolbarOpts}
          allowValidation
        />
        {editable && (
          <div className={classes.controls}>
            <IconButton color='default' onClick={onDelete}>
              <RemoveCircle
                classes={{
                  root: classes.removeCircle
                }}
              />
            </IconButton>
          </div>
        )}
        <InfoDialog
          title={dialog.message}
          open={dialog.open}
          onOk={dialog.onOk}
        />
      </div>
    );


    return connectDragSource(
      connectDropTarget(
        <div>
          {markup}
        </div>
      ),
      dragSourceOpts
    );
  }
}

const Styled = withStyles(theme => ({
  removeCircle: {
    fill: theme.palette.error[500]
  },
  choiceTile: {
    cursor: 'move',
    backgroundColor: 'white',
    marginTop: '5px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center'
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  prompt: {
    width: '80%',
    border: 'none',
  },
  targetPrompt: {
    backgroundColor: '#D7D7D7'
  },
  actions: {
    color: '#B1B1B1'
  }
}))(ChoiceTile);

const NAME = 'choice-config';

const choiceSource = {
  beginDrag(props) {
    return {
      id: props.choice.id,
      index: props.index,
      type: props.choice.type,
      instanceId: props.choice.instanceId
    };
  }
};

const StyledSource = DragSource(NAME, choiceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Styled);

const choiceTarget = {
  hover() {
    log('[hover]');
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    log('[drop] item: ', item, 'didDrop?', monitor.didDrop());

    props.onDropChoice(item, props.index);
  }
};

const StyledSourceAndTarget = DropTarget(NAME, choiceTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(StyledSource);

export default StyledSourceAndTarget;
