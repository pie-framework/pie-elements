import React from 'react';
import PropTypes from 'prop-types';
import { Rect, Group } from 'react-konva';
import { withStyles } from '@material-ui/core/styles/index';

class RectComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRemove: false,
    };
  }

  handleClick = (e) => {
    const { width, height, isDrawing, onClick, index } = this.props;
    if (width < 0 && height < 0 && isDrawing) {
      return;
    }
    e.cancelBubble = true;
    onClick(index);
  };

  handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
    this.setState({ showRemove: true });
  };

  handleMouseLeave = () => {
    document.body.style.cursor = 'default';
    this.setState({ showRemove: false });
  };

  handleRemoveClick = (e) => {
    e.cancelBubble = true;
    const { index, onRemove } = this.props;
    onRemove(index);
  };

  render() {
    const { classes, hotspotColor, outlineColor, width, height, x, y, correct } = this.props;

    return (
      <Group>
        <Rect
          classes={classes.base}
          width={width}
          height={height}
          fill={hotspotColor}
          onClick={this.handleClick}
          draggable={true}
          stroke={outlineColor}
          strokeWidth={correct ? 2 : 0}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
          x={x}
          y={y}
        >
        </Rect>
        {/*<Text*/}
        {/*x={this.props.x}*/}
        {/*y={this.props.y}*/}
        {/*text="rm"*/}
        {/*onClick={this.handleRemoveClick}*/}
        {/*onMouseEnter={this.handleMouseEnter}*/}
        {/*onMouseLeave={this.handleMouseLeave}*/}
        {/*/>*/}
      </Group>
    );
  }
}

const styles = theme => ({
  base: {
    cursor: 'pointer',
    opacity: 0.5,
    position: 'relative'
  },
});

RectComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  correct: PropTypes.bool.isRequired,
  isDrawing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default withStyles(styles)(RectComponent);
