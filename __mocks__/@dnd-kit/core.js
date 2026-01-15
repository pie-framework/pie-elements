import React from 'react';

export const useDraggable = jest.fn(() => ({
  attributes: {},
  listeners: {},
  setNodeRef: jest.fn(),
  transform: null,
  isDragging: false,
}));

export const useDroppable = jest.fn(() => ({
  setNodeRef: jest.fn(),
  isOver: false,
  node: { current: null },
}));

export const DndContext = ({ children }) => <div>{children}</div>;

export const DragOverlay = ({ children }) => <div>{children}</div>;

export const useSensor = jest.fn();
export const useSensors = jest.fn(() => []);
export const PointerSensor = jest.fn();
export const KeyboardSensor = jest.fn();

export const rectIntersection = jest.fn();
export const closestCenter = jest.fn();
export const closestCorners = jest.fn();

export const getFirstCollision = jest.fn();
export const pointerWithin = jest.fn();
export const rectIntersectionAlgorithm = jest.fn();
