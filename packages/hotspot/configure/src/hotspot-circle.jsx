import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Group, Transformer } from 'react-konva';
import { withStyles } from '@material-ui/core/styles';
import DeleteWidget from './DeleteWidget';

class CircleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      isDragging: false,
    };
    this.shapeRef = React.createRef();
    this.trRef = React.createRef();
  }

  handleClick = (e) => {
    const { radius, isDrawing, onClick, id } = this.props;
    if (radius <= 0 && isDrawing) {
      return;
    }
    e.cancelBubble = true;
    onClick(id);
  };

  handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
    this.setState({ hovered: true });
    this.trRef.current.setNode(this.shapeRef.current);
    this.trRef.current.getLayer().batchDraw();
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
    document.body.style.cursor = 'default';
  };

  handleOnDragEnd = (e) => {
    const { onDragEnd, id } = this.props;
    this.setState({ isDragging: false });
    onDragEnd(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  onResizeEnd = () => {
    const { onDragEnd, id } = this.props;
    const node = this.shapeRef.current;

    const scale = node.scaleX() !== 1 ? node.scaleX() : node.scaleY();
    const newRadius = Math.max(node.radius() * scale, 5);

    this.setState({ isDragging: false });
    onDragEnd(id, {
      x: node.x(),
      y: node.y(),
      radius: newRadius,
    });

    node.scaleX(1);
    node.scaleY(1);
  };

  handleDelete = (id) => {
    const { onDeleteShape } = this.props;
    onDeleteShape(id);
  };

  onTransform = () => {
    const node = this.shapeRef.current;
    const avgScale = (node.scaleX() + node.scaleY()) / 2;
    node.scaleX(avgScale);
    node.scaleY(avgScale);
  };

  render() {
    const { classes, correct, radius, hotspotColor, id, outlineColor, x, y, strokeWidth = 5 } = this.props;

    return (
      <Group classes={classes.group} onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
        <Circle
          classes={classes.base}
          ref={this.shapeRef}
          radius={radius}
          fill={hotspotColor}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable
          stroke={outlineColor}
          strokeWidth={correct ? strokeWidth : 0}
          onDragStart={() => this.setState({ isDragging: true })}
          onDragEnd={this.handleOnDragEnd}
          onTransformStart={() => this.setState({ isDragging: true })}
          onTransformEnd={this.onResizeEnd}
          x={x}
          y={y}
        />
        {!this.state.isDragging && this.state.hovered && (
          <DeleteWidget id={id} radius={radius} x={x} y={y} handleWidgetClick={this.handleDelete} isCircle={true} />
        )}
        {this.state.hovered && (
          <Transformer
            ref={this.trRef}
            rotateEnabled={false}
            keepRatio={true}
            onTransform={this.onTransform}
            enabledAnchors={['middle-left', 'middle-right', 'top-center', 'bottom-center']}
            boundBoxFunc={(oldBox, newBox) => {
              // Constraint to prevent resizing too small
              if (newBox.width < 10 || newBox.height < 10) {
                return oldBox;
              }

              const oldCenterX = oldBox.x + oldBox.width / 2;
              const oldCenterY = oldBox.y + oldBox.height / 2;
              const newCenterX = newBox.x + newBox.width / 2;
              const newCenterY = newBox.y + newBox.height / 2;

              const offsetX = oldCenterX - newCenterX;
              const offsetY = oldCenterY - newCenterY;

              newBox.x += offsetX;
              newBox.y += offsetY;

              return newBox;
            }}
          />
        )}
      </Group>
    );
  }
}

const styles = () => ({
  base: {
    cursor: 'pointer',
    opacity: 0.5,
  },

  group: {
    padding: '12px',
  },
});

CircleComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  correct: PropTypes.bool,
  isDrawing: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  radius: PropTypes.number.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDeleteShape: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
};

CircleComponent.defaultProps = {
  correct: false,
};

export default withStyles(styles)(CircleComponent);
