import React from 'react';
import { getUpdatedCategories } from '../correct-response';
import cloneDeep from 'lodash/cloneDeep';

jest.mock('@pie-lib/charting', () => ({
  Chart: (props) => <div data-testid="chart">{props.children}</div>,
}));

describe('CorrectResponse - getUpdatedCategories function', () => {
  const prevProps = {
    model: {
      data: [
        { label: 'A', value: 0, interactive: true, editable: true },
        { label: 'B', value: 1, interactive: true, editable: false },
        { label: 'C', value: 2, interactive: true, editable: false },
      ],
      correctAnswer: {
        data: [
          { label: 'A', value: 1 },
          { label: 'B', value: 1 },
          { label: 'C', value: 1 },
        ],
      },
    },
  };

  const prevState = {
    categories: [
      { label: 'A', value: 0, interactive: true, editable: true },
      { label: 'B', value: 1, interactive: true, editable: false },
      { label: 'C', value: 2, interactive: true, editable: false },
    ],
  };

  // Test when a new category is added to Define Chart
  it('should handle category addition correctly', () => {
    const nextProps = cloneDeep(prevProps);
    nextProps.model.data.push({ label: 'D', value: 2, interactive: true, editable: true });

    const updatedCategories = getUpdatedCategories(nextProps, prevProps, prevState);

    expect(updatedCategories).toEqual([
      { label: 'A', value: 1, interactive: true, editable: true, deletable: false },
      { label: 'B', value: 1, interactive: true, editable: false, deletable: false },
      { label: 'C', value: 1, interactive: true, editable: false, deletable: false },
      { label: 'D', value: 2, interactive: true, editable: true, deletable: false },
    ]);
  });

  // Test when a category is removed from Define Chart
  it('should handle category removal correctly', () => {
    const nextProps = {
      model: {
        data: [
          {
            label: 'A',
            value: 0,
            interactive: true,
            editable: true,
            index: 0,
            deletable: true,
          },
          {
            label: 'C',
            value: 2,
            interactive: true,
            editable: false,
            index: 2,
            deletable: true,
          },
        ],
      },
    };

    const updatedCategories = getUpdatedCategories(nextProps, prevProps, prevState);

    expect(updatedCategories).toEqual([
      { label: 'A', value: 0, interactive: true, editable: true, deletable: false },
      { label: 'C', value: 2, interactive: true, editable: false, deletable: false },
    ]);
  });

  // Test when all categories are removed from Define Chart
  it('should handle all category removal correctly', () => {
    const nextProps = {
      model: {
        data: [],
      },
    };

    const prevState = {
      "categories": [
          {
              "label": "A",
              "value": 0,
              "editable": true,
              "interactive": true
          }
      ]
  }

    const updatedCategories = getUpdatedCategories(nextProps, prevProps, prevState);

    expect(updatedCategories).toEqual([]);
  });
});
