import React from 'react';
import { PlaceHolder, uid } from '@pie-lib/drag';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

export class DroppablePlaceholder extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    disabled: PropTypes.bool
  };
  render() {
    const {
      children,
      connectDropTarget,
      isOver,
      disabled
    } = this.props;

    return connectDropTarget(
      <div style={{ flex: 1 }}>
        <PlaceHolder
         // isOver={isOver}
          disabled={disabled}
          isOver={isOver}
        >
          {children}
        </PlaceHolder>
      </div>
    );
  }
}

export const spec = {
    canDrop: (props /*, monitor*/) => {
       return !props.disabled;
      },
    hover:() =>{
        console.log("i hover")
    },
  drop: (props, monitor) => {
    log('[drop] props: ', props);
    const item = monitor.getItem();
    console.log("i drag")
    props.onDropChoice(item);
  }
};

const WithTarget = DropTarget(({ uid }) => uid, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(DroppablePlaceholder);

export default uid.withUid(WithTarget);
