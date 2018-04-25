import { Checkbox } from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';

import { DragSource, DropTarget } from 'react-dnd';

import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import debug from 'debug';
import { withStyles } from 'material-ui/styles';

const log = debug('@pie-element:placement-ordering:configure:choice-tile');

class ChoiceTile extends React.Component {
  static propTypes = {
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    choice: PropTypes.object,
    onChoiceChange: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.onLabelChange = label => {
      const { choice, onChoiceChange } = this.props;
      choice.label = label;
      onChoiceChange(choice);
    };

    this.onMoveOnDragChange = (event, value) => {
      const { choice, onChoiceChange } = this.props;
      choice.moveOnDrag = value;
      onChoiceChange(choice);
    };
  }

  render() {
    const {
      choice,
      connectDragSource,
      connectDropTarget,
      isDragging,
      classes,
      onDelete,
      imageSupport
    } = this.props;

    const opacity = isDragging ? 0 : 1;
    const markup = (
      <div className={classes.choiceTile} style={{ opacity: opacity }}>
        <EditableHtml
          style={{ display: 'inline-block' }}
          placeholder="Enter a choice"
          markup={choice.label}
          imageSupport={imageSupport}
          onChange={this.onLabelChange}
        />
        <div className={classes.controls}>
          <Checkbox
            label="Remove tile after placing"
            checked={choice.moveOnDrag === true}
            onChange={this.onMoveOnDragChange}
          />
          <IconButton color="primary" onClick={onDelete}>
            <RemoveCircle
              classes={{
                root: classes.removeCircle
              }}
            />
          </IconButton>
        </div>
      </div>
    );

    return connectDragSource(connectDropTarget(markup));
  }
}

const Styled = withStyles(theme => ({
  removeCircle: {
    fill: theme.palette.error[500]
  },
  choiceTile: {
    cursor: 'move',
    backgroundColor: 'white',
    border: '1px solid #c2c2c2',
    marginTop: '5px',
    marginBottom: '5px',
    padding: '5px'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))(ChoiceTile);

const NAME = 'choice-config';

const choiceSource = {
  beginDrag(props) {
    return {
      id: props.choice.id,
      index: props.index
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
    props.onMoveChoice(item.index, props.index);
  }
};

const StyledSourceAndTarget = DropTarget(NAME, choiceTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(StyledSource);

export default StyledSourceAndTarget;
