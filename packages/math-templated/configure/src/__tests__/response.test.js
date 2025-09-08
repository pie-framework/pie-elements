import React from 'react';
import { shallow, mount } from 'enzyme';
import { Response } from '../response'; // Adjust the import path as necessary
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { MathToolbar } from '@pie-lib/math-toolbar';

const classes = {
  responseContainer: 'responseContainer',
  cardContent: 'cardContent',
  title: 'title',
  selectContainer: 'selectContainer',
  inputContainer: 'inputContainer',
  titleBar: 'titleBar',
  responseEditor: 'responseEditor',
  mathToolbar: 'mathToolbar',
  alternateButton: 'alternateButton',
  removeAlternateButton: 'removeAlternateButton',
  errorText: 'errorText',
  responseBox: 'responseBox',
  alternateBar: 'alternateBar',
};

const ResponseWithStyles = withStyles(() => classes)(Response);

const mockOnResponseChange = jest.fn();

const defaultProps = {
  classes,
  responseKey: '1',
  response: {
    answer: '',
    alternates: {},
    validation: 'literal',
    ignoreOrder: false,
    allowTrailingZeros: false,
  },
  onResponseChange: mockOnResponseChange,
  cIgnoreOrder: { enabled: true, label: 'Ignore Order' },
  cAllowTrailingZeros: { enabled: true, label: 'Allow Trailing Zeros' },
  error: {},
  defaultResponse: false,
  mode: '8',
};

describe('Response component', () => {
  let wrapper;
  beforeEach(() => {
    mockOnResponseChange.mockClear();
    wrapper = mount(<ResponseWithStyles {...defaultProps} />);
  });

  it('Match Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('changes validation method', () => {
    const select = wrapper.find(Select).at(0);
    select.props().onChange({ target: { value: 'symbolic' } });

    expect(mockOnResponseChange).toHaveBeenCalledWith(expect.objectContaining({ validation: 'symbolic' }), '1');
  });

  it('toggles allow trailing zeros', () => {
    const checkbox = wrapper.find(Checkbox).at(0);
    checkbox.props().onChange({ target: { checked: true } });

    expect(mockOnResponseChange).toHaveBeenCalledWith(expect.objectContaining({ allowTrailingZeros: true }), '1');
  });

  it('toggles ignore order', () => {
    const checkbox = wrapper.find(Checkbox).at(1);
    checkbox.props().onChange({ target: { checked: true } });

    expect(mockOnResponseChange).toHaveBeenCalledWith(expect.objectContaining({ ignoreOrder: true }), '1');
  });

  it('adds an alternate answer', () => {
    const button = wrapper.find(Button).at(0);
    button.props().onClick();

    expect(mockOnResponseChange).toHaveBeenCalledWith(
      expect.objectContaining({
        alternates: { 1: '' },
      }),
      '1',
    );
  });

  it('removes an alternate answer', () => {
    const propsWithAlternate = {
      ...defaultProps,
      response: {
        ...defaultProps.response,
        alternates: { 1: 'some answer' },
      },
    };
    const wrapper = mount(<ResponseWithStyles {...propsWithAlternate} />);

    const iconButton = wrapper.find(IconButton).at(2);
    iconButton.props().onClick();

    expect(defaultProps.onResponseChange).toHaveBeenCalledWith(
      {
        allowTrailingZeros: false,
        answer: '',
        ignoreOrder: false,
        validation: 'literal',
        alternates: {},
      },
      '1',
    );
  });

  it('changes the main answer', () => {
    const mathToolbar = wrapper.find(MathToolbar).at(0);
    mathToolbar.props().onChange('new main answer');

    expect(mockOnResponseChange).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: 'new main answer',
      }),
      '1',
    );
  });

  it('changes an alternate answer', () => {
    const propsWithAlternate = {
      ...defaultProps,
      response: {
        ...defaultProps.response,
        alternates: { 1: 'some answer' },
      },
    };
    const wrapper = mount(<ResponseWithStyles {...propsWithAlternate} />);

    const mathToolbar = wrapper.find(MathToolbar).at(1);
    mathToolbar.props().onChange('new alternate answer');

    expect(mockOnResponseChange).toHaveBeenCalledWith(
      expect.objectContaining({
        alternates: { 1: 'new alternate answer' },
      }),
      '1',
    );
  });

  it('toggles allow trailing zeros checkbox state', () => {
    const checkbox = wrapper.find(Checkbox).at(0);
    checkbox.props().onChange({ target: { checked: true } });

    expect(mockOnResponseChange).toHaveBeenCalledWith(expect.objectContaining({ allowTrailingZeros: true }), '1');
  });

  it('toggles ignore order checkbox state', () => {
    const checkbox = wrapper.find(Checkbox).at(1);
    checkbox.props().onChange({ target: { checked: true } });

    expect(mockOnResponseChange).toHaveBeenCalledWith(expect.objectContaining({ ignoreOrder: true }), '1');
  });

  it('displays error messages for main answer and alternates', () => {
    const propsWithError = {
      ...defaultProps,
      error: {
        answer: 'Main answer error',
        1: 'First alternate error',
      },
    };
    const wrapper = mount(<ResponseWithStyles {...propsWithError} />);

    expect(wrapper.find('.errorText').at(0).text()).toBe('Main answer error');
    expect(wrapper.find('.errorText').at(1).text()).toBe('First alternate error');
  });

  it('handles empty response object', () => {
    const propsWithEmptyResponse = {
      ...defaultProps,
      response: {},
    };
    const wrapper = mount(<ResponseWithStyles {...propsWithEmptyResponse} />);
    expect(wrapper.exists()).toBe(true);

    const addButton = wrapper.find(Button);
    addButton.simulate('click');

    expect(mockOnResponseChange).toHaveBeenCalledWith(
      expect.objectContaining({
        alternates: { 1: '' },
      }),
      '1',
    );
  });
});
