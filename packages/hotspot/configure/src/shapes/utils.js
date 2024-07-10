import { CircleShape } from './circle';
import { PolygonShape } from './polygon';
import { RectangleShape } from './rectagle';

export const SUPPORTED_SHAPES = {
  CIRCLE: CircleShape.name,
  POLYGON: PolygonShape.name,
  RECTANGLE: RectangleShape.name,
  NONE: 'none',
};

export const SHAPE_GROUPS = {
  CIRCLES: 'circles',
  POLYGONS: 'polygons',
  RECTANGLES: 'rectangles',
};
