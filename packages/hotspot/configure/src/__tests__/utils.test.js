import React from 'react';
import { updateImageDimensions, getUpdatedRectangle, getUpdatedPlygon, getAllShapes, groupShapes } from '../utils';

const width = 200;
const height = 100;
const imageDimensions = { width, height };

describe('updateImageDimensions', () => {
  it.each`
      initialDimensions  |  nextDimensions              |   keepAspectRatio  |  resizeType     |    expectedWidth  | expectedHeight
      ${imageDimensions} |  ${{
    width,
    height: 300
  }}   |     ${true}        |  ${'height'}    |    ${600}         | ${300}
      ${imageDimensions} |  ${{
    width: 400,
    height
  }}   |     ${true}        |  ${'width'}     |    ${400}         | ${200}
      ${imageDimensions} |  ${{
    width,
    height: 300
  }}   |     ${true}        |  ${undefined}   |    ${200}         | ${100}
      ${imageDimensions} |  ${{
    width: 600,
    height
  }}   |     ${true}        |  ${undefined}   |    ${600}         | ${300}
      ${imageDimensions} |  ${{
    width,
    height: 300
  }}   |     ${false}       |  ${'height'}    |    ${200}         | ${300}
      ${imageDimensions} |  ${{
    width: 600,
    height
  }}   |     ${false}       |  ${'width'}     |    ${600}         | ${100}
      ${imageDimensions} |  ${{
    width: 10,
    height: 10
  }}|     ${false}       |  ${undefined}   |    ${10}          | ${10}
    `('initialDimensions = $initialDimensions, nextDimensions = $nextDimensions, keepAspectRatio = $keepAspectRatio, resizeType = $resizeType => width = $expectedWidth & height = $expectedHeight',
    async ({ initialDimensions, nextDimensions, keepAspectRatio, resizeType, expectedWidth, expectedHeight }) => {

      const result = updateImageDimensions(initialDimensions, nextDimensions, keepAspectRatio, resizeType);

      expect(result).toEqual({
        width: expectedWidth,
        height: expectedHeight
      });
    });
});


describe('getUpdatedRectangle', () => {
  const rectangle = (x, y, w, h) => ({ x, y, width: w, height: h });
  const heightUpdateLarge = { width, height: 300 };
  const heightUpdateSmall = { width, height: 50 };
  const widthUpdateLarge = { width: 300, height };
  const widthUpdateSmall = { width: 100, height };
  const bothUpdate = { width: 20, height: 50 };

  it.each`
      initialDimensions  |  nextDimensions        |   shape                                           | expected
      ${imageDimensions} |  ${heightUpdateLarge}  |   ${rectangle(10, 10, 100, 50)}     |  ${rectangle(10, 30, 100, 150)} 
      ${imageDimensions} |  ${heightUpdateSmall}  |   ${rectangle(10, 10, 100, 50)}     |  ${rectangle(10, 5, 100, 25)} 
      ${imageDimensions} |  ${bothUpdate}         |   ${rectangle(10, 10, 100, 50)}     |  ${rectangle(1, 5, 10, 25)} 
      ${imageDimensions} |  ${widthUpdateLarge}   |   ${rectangle(10, 10, 100, 50)}     |  ${rectangle(15, 10, 150, 50)} 
      ${imageDimensions} |  ${widthUpdateSmall}   |   ${rectangle(10, 10, 100, 50)}     |  ${rectangle(5, 10, 50, 50)} 
    `('initialDimensions = $initialDimensions, nextDimensions = $nextDimensions, shape = $shape => $expected',
    async ({ initialDimensions, nextDimensions, shape, expected }) => {

      const result = getUpdatedRectangle(initialDimensions, nextDimensions, shape);

      expect(result).toEqual(expected);
    });
});


describe('getUpdatedPolygon', () => {
  const updatedDimensions = { width: width / 2, height: height * 2 };

  const point = (x, y) => ({ x, y });
  const updatedPoint = (x, y) => ({ x: x / 2, y: y * 2 });

  const triangle = [point(10, 10), point(100, 10), point(100, 100)];
  const triangleUpdated = [updatedPoint(10, 10), updatedPoint(100, 10), updatedPoint(100, 100)];

  const square = [point(10, 10), point(100, 10), point(100, 100), point(10, 100)];
  const squareUpdated = [updatedPoint(10, 10), updatedPoint(100, 10), updatedPoint(100, 100), updatedPoint(10, 100)];

  const pentagon = [point(10, 10), point(20, 0), point(30, 0), point(40, 10), point(25, 20)];
  const pentagonUpdated = [updatedPoint(10, 10), updatedPoint(20, 0), updatedPoint(30, 0), updatedPoint(40, 10), updatedPoint(25, 20)];

  const hexagon = [point(10, 10), point(20, 0), point(30, 0), point(40, 10), point(30, 20), point(20, 20)];
  const hexagonUpdated = [updatedPoint(10, 10), updatedPoint(20, 0), updatedPoint(30, 0), updatedPoint(40, 10), updatedPoint(30, 20), updatedPoint(20, 20)];

  const polygon = points => ({ points });

  it.each`
      initialDimensions  |  nextDimensions         |   shape                    | expected
      ${imageDimensions} |  ${updatedDimensions}   |   ${polygon(triangle)}     |  ${polygon(triangleUpdated)} 
      ${imageDimensions} |  ${updatedDimensions}   |   ${polygon(square)}       |  ${polygon(squareUpdated)} 
      ${imageDimensions} |  ${updatedDimensions}   |   ${polygon(pentagon)}     |  ${polygon(pentagonUpdated)} 
      ${imageDimensions} |  ${updatedDimensions}   |   ${polygon(hexagon)}      |  ${polygon(hexagonUpdated)} 
    `('initialDimensions = $initialDimensions, nextDimensions = $nextDimensions, shape = $shape => $expected',
    async ({ initialDimensions, nextDimensions, shape, expected }) => {

      const result = getUpdatedPlygon(initialDimensions, nextDimensions, shape);

      expect(result).toEqual(expected);
    });
});


const shapesArray = [
  {
    height: 100,
    width: 100,
    x: 1,
    y: 1,
    group: 'rectangles'
  }, {
    height: 200,
    width: 200,
    x: 200,
    y: 1,
    group: 'rectangles'
  },
  {
    points: [
      { x: 1, y: 200 },
      { x: 1, y: 200 },
      { y: 200, x: 200 },
      { y: 200, x: 200 }],
    group: 'polygons'
  }, {
    points: [
      { x: 200, y: 100 },
      { x: 200, y: 200 },
      { x: 400, y: 200 },
      { x: 400, y: 200 }
    ],
    group: 'polygons'
  }
];


const shapesMap = {
  rectangles: [
    {
      height: 100,
      width: 100,
      x: 1,
      y: 1,
    }, {
      height: 200,
      width: 200,
      x: 200,
      y: 1,
    }
  ], polygons: [
    {
      points: [
        { x: 1, y: 200 },
        { x: 1, y: 200 },
        { y: 200, x: 200 },
        { y: 200, x: 200 }],
    }, {
      points: [
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 400, y: 200 }
      ],
    }
  ]
};


describe('getAllShapes', () => {
  it.each`
      shapesMap     |  expected
      ${shapesMap}  |  ${shapesArray}
      ${null}       |  ${[]}
      ${undefined}  |  ${[]}
      ${{}}         |  ${[]}
    `('TURNS shapes = $shapesMap INTO $expected',
    async ({ shapesMap, expected }) => {
      expect(getAllShapes(shapesMap)).toEqual(expected);
    });

});

describe('groupShapes', () => {
  it.each`
      shapesArray     |  expected
      ${shapesArray}  |  ${shapesMap}
      ${null}         |  ${{ rectangles: [], polygons: []}}
      ${undefined}    |  ${{ rectangles: [], polygons: []}}
      ${[]}           |  ${{ rectangles: [], polygons: []}}
    `('TURNS shapes = $shapesArray INTO $expected',
    async ({ shapesArray, expected }) => {
      expect(groupShapes(shapesArray)).toEqual(expected);
    });
});

