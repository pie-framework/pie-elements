import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Help from '../help';

// Mock the Help component from @pie-lib/config-ui
jest.mock('@pie-lib/config-ui', () => ({
  Help: ({ title, children }) => (
    <div data-testid="help-component">
      <div data-testid="help-title">{title}</div>
      <div data-testid="help-content">{children}</div>
    </div>
  ),
}));

describe('Help Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Help />);
    expect(container).toBeTruthy();
  });

  it('should render with correct title', () => {
    render(<Help />);
    expect(screen.getByTestId('help-title')).toHaveTextContent('Help');
  });

  it('should render help content', () => {
    render(<Help />);
    const content = screen.getByTestId('help-content');
    expect(content).toBeInTheDocument();
  });

  it('should contain correct help text about ordering', () => {
    render(<Help />);
    const content = screen.getByTestId('help-content');
    expect(content).toHaveTextContent(
      'In Ordering, a student is asked to sequence events or inputs in a specific order.',
    );
  });

  it('should contain instructions about drag and drop', () => {
    render(<Help />);
    const content = screen.getByTestId('help-content');
    expect(content).toHaveTextContent(
      'After setting up the choices, drag and drop them into the correct order.',
    );
  });

  it('should contain information about student view', () => {
    render(<Help />);
    const content = screen.getByTestId('help-content');
    expect(content).toHaveTextContent('Students will see a shuffled version of the choices.');
  });

  it('should render the Help component from pie-lib', () => {
    render(<Help />);
    expect(screen.getByTestId('help-component')).toBeInTheDocument();
  });

  it('should have line breaks in content', () => {
    const { container } = render(<Help />);
    const breaks = container.querySelectorAll('br');
    expect(breaks.length).toBeGreaterThan(0);
  });
});
