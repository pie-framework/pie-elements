import React from 'react';
import { Line } from 'react-konva';

import DrawableHelper from './drawable-helper';

export default class FreePathDrawable extends DrawableHelper {
  static TYPE = 'FreePathDrawable';

  constructor(props) {
    super(props, FreePathDrawable.TYPE);
    const { startx, starty, points, posX, posY } = props;

    this.points = points || [startx, starty];
    this.posX = posX || 0;
    this.posY = posY || 0;
  }

  registerMovement(x, y) {
    this.points = [...this.points, x, y];
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

    return (
      <Line
        key={key}
        draggable={draggable}
        tension={0}
        bezier={true}
        points={this.points}
        fill={this.paintColor || this.fillColor}
        onClick={() => this.handleOnClick(props)}
        onDragEnd={this.handleDragEnd.bind(this, props)}
        onMouseEnter={onMouseOverElement}
        onMouseLeave={onMouseOutElement}
        stroke={this.paintColor || this.outlineColor}
        x={this.posX}
        y={this.posY}
      />
    );
  }
}
