import React from 'react';
import PropTypes from 'prop-types';
import { Rect, Group, Transformer } from 'react-konva';
import { withStyles } from '@material-ui/core/styles/index';
import DeleteWidget from './DeleteWidget';

class RectComponent extends React.Component {
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
    const { width, height, isDrawing, onClick, id } = this.props;
    if (width < 0 && height < 0 && isDrawing) {
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
    // transformer is changing scale of the node
    // and NOT its width or height
    // but in the store we have only width and height
    // to match the data better we will reset scale on transform end
    const node = this.shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);
    this.setState({ isDragging: false });
    onDragEnd(id, {
      x: node.x(),
      y: node.y(),
      // set minimal value
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
    });
  };

  handleDelete = (id) => {
    const { onDeleteShape } = this.props;
    onDeleteShape(id);
  };

  render() {
    const { classes, correct, height, hotspotColor, id, outlineColor, width, x, y, strokeWidth = 5 } = this.props;
    return (
      <Group classes={classes.group} onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
        <Rect
          classes={classes.base}
          ref={this.shapeRef}
          width={width}
          height={height}
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
          <DeleteWidget
            id={id}
            height={height}
            width={width}
            x={x}
            y={y}
            outlineColor={outlineColor}
            handleWidgetClick={this.handleDelete}
          />
        )}
        {this.state.hovered && (
          <Transformer
            ref={this.trRef}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 10 || newBox.height < 10) {
                return oldBox;
              }
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

RectComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  correct: PropTypes.bool,
  isDrawing: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDeleteShape: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
};

RectComponent.defaultProps = {
  correct: false,
};

export default withStyles(styles)(RectComponent);
