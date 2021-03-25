import React from 'react';
import { Arrow } from 'react-konva';

import DrawableHelper from './drawable-helper';

export default class LineDrawable extends DrawableHelper {
  static TYPE = 'LineDrawable';

  constructor(props) {
    super(props, LineDrawable.TYPE);
    const { startx, starty, x, y, posX, posY } = props;

    this.x = x || startx;
    this.y = y || starty;
    this.posX = posX || 0;
    this.posY = posY || 0;
  }

  registerMovement(x, y) {
    this.x = x;
    this.y = y;
  }

  handleOnClick(props) {
    const { paint, paintColor, forceUpdate } = props;

    if (paint) {
      this.paintColor = paintColor;
      forceUpdate();
    }
  }

  handleDragEnd = (props, event) => {
    this.posX = event.target.getX();
    this.posY = event.target.getY();

    props.handleSessionChange();
  };

  render(props) {
    const { draggable, key, onMouseOverElement, onMouseOutElement } = props;
    const points = [this.startx, this.starty, this.x, this.y];

    return (
      <Arrow
        key={key}
        draggable={draggable}
        points={points}
        fill={this.paintColor || this.outlineColor}
        onClick={() => this.handleOnClick(props)}
        stroke={this.paintColor || this.outlineColor}
        onDragEnd={this.handleDragEnd.bind(this, props)}
        onMouseEnter={onMouseOverElement}
        onMouseLeave={onMouseOutElement}
        x={this.posX}
        y={this.posY}
        pointerWidth={0}
        pointerLength={0}
      />
    );
  }
}
