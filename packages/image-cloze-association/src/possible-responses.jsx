import React  from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core';
import { color } from '@pie-lib/render-ui';

import PossibleResponse from './possible-response';
import c from './constants';

const PossibleResponses = ({
  canDrag, classes, connectDropTarget, data, isOverCurrent, onDragBegin, onDragEnd
}) => connectDropTarget(
  <div className={`${classes.base} ${isOverCurrent ? classes.active : ''}`}>
    {data.map(item => (
      <PossibleResponse
        canDrag={canDrag}
        key={item.id}
        data={item}
        onDragBegin={onDragBegin}
        onDragEnd={onDragEnd}
      />
    ))}
  </div>
);

PossibleResponses.propTypes = {
  canDrag: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  data: PropTypes.array.isRequired,
  onAnswerRemove: PropTypes.func.isRequired,
  onDragBegin: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired
};

PossibleResponses.defaultProps = {
  classes: {}
};

const styles = theme => ({
  active: {
    border: `1px solid ${color.primary()}`
  },
  base: {
    backgroundColor: color.background(),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  }
});

const Styled = withStyles(styles)(PossibleResponses);

const tileSource = {
  hover(props, monitor) {
    monitor.isOver({ shallow: true });
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    props.onAnswerRemove(item);
  }
};

export default DropTarget(c.types.response, tileSource, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))(Styled);

