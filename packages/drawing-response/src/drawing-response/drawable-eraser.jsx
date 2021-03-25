import React from 'react';
import { Line } from 'react-konva';

import DrawableHelper from './drawable-helper';

export default class EraserDrawable extends DrawableHelper {
  static TYPE = 'EraserDrawable';
  constructor(props) {
    super(props, EraserDrawable.TYPE);
    const { startx, starty, points, posX, posY } = props;

    this.points = points || [startx, starty];
    this.posX = posX || 0;
    this.posY = posY || 0;
  }

  registerMovement(x, y) {
    this.points = [...this.points, x, y];
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
        globalCompositeOperation="destination-out"
        tension={0}
        bezier={true}
        points={this.points}
        onDragEnd={this.handleDragEnd.bind(this, props)}
        onMouseEnter={onMouseOverElement}
        onMouseLeave={onMouseOutElement}
        strokeStyle="#df4b26"
        lineJoin="round"
        lineWidth="5"
        fill="white"
        stroke="white"
        strokeWidth={5}
        x={this.posX}
        y={this.posY}
      />
    );
  }
}
