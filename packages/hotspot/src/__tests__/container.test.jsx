import React from 'react';
import { render } from '@testing-library/react';
import Konva from 'konva';


import Container from '../hotspot/container';
import HotspotComponent from '../hotspot/index';

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

Konva.isBrowser = false;

jest.mock('react-konva', () => {
  const React = require('react');
  return {
    Stage: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'stage', ...props }, children),
    Layer: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'layer', ...props }, children),
    Rect: (props) => React.createElement('div', { 'data-testid': 'rect', ...props }),
    Circle: (props) => React.createElement('div', { 'data-testid': 'circle', ...props }),
    Line: (props) => React.createElement('div', { 'data-testid': 'line', ...props }),
    Group: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'group', ...props }, children),
    Image: (props) => React.createElement('div', { 'data-testid': 'image', ...props }),
  };
});

describe('CorrectAnswerToggle', () => {
  const model = {
    mode: 'evaluate',
    responseCorrect: false,
  };

  const createComponent = (props) => {
    return render(
      <HotspotComponent
        model={{
          ...model,
          ...props,
        }}
      />
    );
  };

  it('does not render outside of evaluate mode', () => {
    const { container } = createComponent({ mode: 'gather' });
    const toggle = container.querySelector('[data-testid="correct-answer-toggle"]');
    expect(toggle).toBeNull();
  });

  it('does not render if the response is correct', () => {
    const { container } = createComponent({ responseCorrect: true });
    const toggle = container.querySelector('[data-testid="correct-answer-toggle"]');
    expect(toggle).toBeNull();
  });
});
