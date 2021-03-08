/**
 * Not using React in order to avoid performance issues.
 * If you switch this class to a React one make sure that
 * this interaction will not have performance leaks in pie-website nor in pits.
 */
export default class DrawableHelper {
  constructor(props, type) {
    const { startx, starty, fillColor, outlineColor, createdAt } = props;
    this.startx = startx;
    this.starty = starty;
    this.createdAt = createdAt;
    this.fillColor = fillColor;
    this.outlineColor = outlineColor;
    this.type = type;
  }

  toJson() {
    const base = JSON.parse(JSON.stringify(this));
    return base;
  }
}
