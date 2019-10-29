import { shallow } from 'enzyme';
import React from 'react';
import Choice, { BlankContent, tileSource } from '../choice';

describe('Choice', () => {
  let onClick;
  let onRemoveChoice;
  let connectDragSource;
  let connectDragPreview;

  beforeEach(() => {
    onClick = jest.fn();
    onRemoveChoice = jest.fn();
    connectDragSource = jest.fn();
    connectDragPreview = jest.fn();
  });

  const wrapper = extras => {
    const props = {
      classes: {},
      key: '0',
      duplicates: true,
      choice: {
        value: '<div>6</div>',
        id: '0'
      },
      targetId: '0',
      onClick,
      onRemoveChoice,
      connectDragSource,
      connectDragPreview,
      ...extras
    };

    return shallow(<Choice {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});

describe('spec', () => {
  describe('canDrag', () => {
    it('returns true if category has any value and is enabled', () => {
      const result = tileSource.canDrag({ choice: { value: '<div>6</div>', id: '0' }, disabled: false });
      expect(result).toEqual(true);
    });

    it('returns false if category has any value and is disabled', () => {
      const jsdomAlert = window.alert;  // remember the jsdom alert
      window.alert = () => {};

      const result = tileSource.canDrag({ choice: { value: '<div>6</div>', id: '0' }, disabled: true });
      expect(result).toEqual(false);

      window.alert = jsdomAlert;
    });

    it('returns false if category value is empty', () => {
      const jsdomAlert = window.alert;  // remember the jsdom alert
      window.alert = () => {};

      const result = tileSource.canDrag({ choice: { value: '', id: '0' } });
      expect(result).toEqual(false);

      window.alert = jsdomAlert;
    });
  });

  describe('beginDrag', () => {
    it('returns the proper object', () => {
      const result = tileSource.beginDrag({ choice: { value: '<div>0</div>', id: '0' }, instanceId: '1', targetId: '0' });
      expect(result).toEqual({ id: '0', instanceId: '1', value: { value: '<div>0</div>', id: '0' } });
    });
  });
});
