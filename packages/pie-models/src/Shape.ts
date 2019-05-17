export interface Shape {
    /** the id of the shape */
    id?: string;
    /** indicates if the shape is correct */
    correct?: boolean;
    /** the height of the shape */
    height: number;
    /** the width of the shape */
    width: number;
    /** the x position of the shape */
    x: number;
    /** the y position of the shape */
    y: number;
}
