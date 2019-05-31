import { Rectangle } from './Rectangle';
import { Polygon } from './Polygon';

export interface Shape {
    /** the rectangles of the shape */
    rectangles: Rectangle[];
    /** the polygons of the shape */
    polygons: Polygon[];
}
