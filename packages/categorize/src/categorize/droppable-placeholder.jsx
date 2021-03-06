import React from 'react';
import { PlaceHolder } from '@pie-lib/drag';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { uid } from '@pie-lib/drag';
import debug from 'debug';

const log = debug('@pie-ui:categorize:droppable-placeholder');

export class DroppablePlaceholder extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    className: PropTypes.string,
    grid: PropTypes.object,
    disabled: PropTypes.bool
  };
  render() {
    const {
      children,
      connectDropTarget,
      isOver,
      className,
      grid,
      disabled
    } = this.props;

    return connectDropTarget(
      <div style={{ flex: 1 }}>
        <PlaceHolder
          className={className}
          isOver={isOver}
          grid={grid}
          disabled={disabled}
        >
          {children}
        </PlaceHolder>
      </div>
    );
  }
}

export const spec = {
  drop: (props, monitor) => {
    log('[drop] props: ', props);
    const item = monitor.getItem();
    props.onDropChoice(item);
  },
  canDrop: (props /*, monitor*/) => {
    return !props.disabled;
  }
};

const WithTarget = DropTarget(({ uid }) => uid, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(DroppablePlaceholder);

export default uid.withUid(WithTarget);
