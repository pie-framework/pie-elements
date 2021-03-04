import FreePathDrawable from './drawable-free-path';
import LineDrawable from './drawable-line';
import RectangleDrawable from './drawable-rectangle';
import CircleDrawable from './drawable-circle';
import EraserDrawable from './drawable-eraser';

const DRAWABLES = [
  FreePathDrawable,
  LineDrawable,
  RectangleDrawable,
  CircleDrawable,
  EraserDrawable
];

export default (type, props) => {
  const T = DRAWABLES.find(D => D.TYPE === type);

  if (T) {
    return new T(props);
  }

  throw new Error(
    `Can't find drawable for type: ${type} and props: ${JSON.stringify(props)}`
  );
};
