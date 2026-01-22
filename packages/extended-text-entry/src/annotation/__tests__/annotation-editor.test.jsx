import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import AnnotationEditor from '../annotation-editor';
import * as utils from '../annotation-utils';

jest.mock('@pie-lib/editable-html', () => ({
  __esModule: true,
  default: ({ markup, onChange, disabled }) => (
    <div data-testid="editable-html" onClick={() => !disabled && onChange && onChange('new value')}>
      {markup}
    </div>
  ),
}));

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: ({ children, label }) => (
    <div compname="InputContainer">{label || 'InputContainer'}</div>
  ),
}));

jest.mock('../freeform-editor', () => ({
  __esModule: true,
  default: (props) => <div data-testid="freeform-editor" {...props} />,
}));

jest.mock('../annotation-menu', () => ({
  __esModule: true,
  default: (props) => <div data-testid="annotation-menu" {...props} />,
}));

const theme = createTheme();

const mockedElementDOM = {
  removeChild: jest.fn(),
  classList: {
    remove: jest.fn(),
    add: jest.fn()
  },
};

jest.spyOn(utils, 'removeElemsWrapping').mockImplementation(() => {});

// Store the original componentDidMount
let originalComponentDidMount;

beforeAll(() => {
  // Save original componentDidMount
  originalComponentDidMount = AnnotationEditor.prototype.componentDidMount;
});

describe('freeform editor', () => {
  const defaultProps = {
    classes: {},
    text: '',
    annotations: [],
    comment: '',
    predefinedAnnotations: [],
    width: 500,
    height: 100,
    maxHeight: '40vh',
    disabled: false,
    disabledMath: false,
    customKeys: [],
    keypadMode: 'miscellaneous',
  };
  let onChange;
  let onCommentChange;

  beforeEach(() => {
    onChange = jest.fn();
    onCommentChange = jest.fn();

    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
  });

  describe('logic', () => {
    describe('select a predefined annotation', () => {
      it('calls onChange when new annotation selected',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
          text: '<div>This is an example.</div>',
        });

        testInstance.createDOMAnnotation = jest.fn();
        testInstance.handleClose = jest.fn();

        testInstance.state = {
          selectedElems: [mockedElementDOM, mockedElementDOM],
          selectionDetails: {
            'quote': 'This',
            'start': 0,
            'end': 4
          },
        };

        testInstance.handleMenuClick({
          type: 'positive',
          text: 'good'
        });

        expect(testInstance.createDOMAnnotation).toBeCalled();
        expect(onChange).toBeCalled();
        expect(testInstance.handleClose).toBeCalled();
      });

      it('calls onChange when old annotation selected',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
          text: '<div>This is an example.</div>',
          annotations: [
            {
              'id': '1',
              'label': 'good',
              'type': 'positive',
              'quote': 'This',
              'start': 0,
              'end': 4
            }
          ]
        });

        testInstance.updateLabel = jest.fn();
        testInstance.handleClose = jest.fn();

        testInstance.state = {
          annotation: {
            'id': '1',
            'label': 'good',
            'type': 'positive',
            'quote': 'This',
            'start': 0,
            'end': 4
          },
          labelElem: mockedElementDOM,
          selectedElems: [mockedElementDOM, mockedElementDOM],
          annotationIndex: 0
        };

        testInstance.handleMenuClick({
          type: 'negative',
          text: 'wrong'
        });

        expect(testInstance.updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
        expect(testInstance.handleClose).toBeCalled();
      });
    });

    describe('write new annotation', () => {
      it('calls onChange',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
          text: '<div>This is an example.</div>',
        });

        testInstance.createDOMAnnotation = jest.fn();

        testInstance.state = {
          selectedElems: [mockedElementDOM, mockedElementDOM],
          selectionDetails: {
            'quote': 'This',
            'start': 0,
            'end': 4
          },
        };

        testInstance.addAnnotation('positive');

        expect(testInstance.createDOMAnnotation).toBeCalled();
        expect(onChange).toBeCalled();
      });
    });

    describe('edit annotation', () => {
      it('updates state',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
        });

        testInstance.state = {
          openedMenu: true,
          openedEditor: false
        };

        testInstance.setState = jest.fn((newState) => {
          testInstance.state = { ...testInstance.state, ...newState };
        });

        testInstance.editAnnotation();

        expect(testInstance.state.openedMenu).toEqual(false);
        expect(testInstance.state.openedEditor).toEqual(true);
      });
    });

    describe('delete annotation', () => {
      it('calls onChange',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
          text: '<div>This is an example.</div>',
        });

        testInstance.handleClose = jest.fn();

        testInstance.state = {
          annotation: {
            'id': '1',
            'label': 'good',
            'type': 'positive',
            'quote': 'This',
            'start': 0,
            'end': 4
          },
          labelElem: mockedElementDOM,
          selectedElems: [mockedElementDOM, mockedElementDOM],
          annotationIndex: 0
        };

        testInstance.deleteAnnotation();

        expect(utils.removeElemsWrapping).toBeCalled();
        expect(onChange).toBeCalled();
        expect(testInstance.handleClose).toBeCalled();
      });
    });

    describe('update annotation', () => {
      it('calls onChange',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
          text: '<div>This is an example.</div>',
          annotations: [
            {
              'id': '1',
              'label': 'good',
              'type': 'positive',
              'quote': 'This',
              'start': 0,
              'end': 4
            }
          ]
        });

        testInstance.updateLabel = jest.fn();

        testInstance.state = {
          annotationIndex: 0
        };

        testInstance.updateAnnotation();

        expect(testInstance.updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
      });
    });

    describe('change annotation type', () => {
      it('calls onChange',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
          text: '<div>This is an example.</div>',
          annotations: [
            {
              'id': '1',
              'label': 'good',
              'type': 'positive',
              'quote': 'This',
              'start': 0,
              'end': 4
            }
          ]
        });

        testInstance.updateLabel = jest.fn();
        testInstance.handleClose = jest.fn();

        testInstance.state = {
          annotation: {
            'id': '1',
            'label': 'good',
            'type': 'positive',
            'quote': 'This',
            'start': 0,
            'end': 4
          },
          labelElem: mockedElementDOM,
          selectedElems: [mockedElementDOM, mockedElementDOM],
          annotationIndex: 0
        };

        testInstance.changeAnnotationType('very good');

        expect(testInstance.updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
        expect(testInstance.handleClose).toBeCalled();
      });
    });

    describe('update annotation label', () => {
      it('calls createDOMAnnotation',  () => {
        const testInstance = new AnnotationEditor({
          ...defaultProps,
          onChange,
          onCommentChange,
          text: '<div>This is an example.</div>',
          annotations: [
            {
              'id': '1',
              'label': 'good',
              'type': 'positive',
              'quote': 'This',
              'start': 0,
              'end': 4
            }
          ]
        });

        testInstance.updateLabel = jest.fn();
        testInstance.handleClose = jest.fn();

        testInstance.state = {
          annotation: {
            'id': '1',
            'label': 'good',
            'type': 'positive',
            'quote': 'This',
            'start': 0,
            'end': 4
          },
          labelElem: mockedElementDOM,
          selectedElems: [mockedElementDOM, mockedElementDOM],
          annotationIndex: 0
        };

        testInstance.changeAnnotationType('very good');

        expect(testInstance.updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
        expect(testInstance.handleClose).toBeCalled();
      });
    });

  });
});
