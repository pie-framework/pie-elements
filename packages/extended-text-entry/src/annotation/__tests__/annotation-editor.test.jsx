import { shallow } from 'enzyme';
import React from 'react';
import AnnotationEditor from '../annotation-editor';
import { unwrap } from "@material-ui/core/test-utils";
import * as utils from '../annotation-utils';

const Editor = unwrap(AnnotationEditor);
const predefinedAnnotations = [
  {
    label: 'good',
    text: 'good',
    type: 'positive'
  }, {
    label: '★',
    text: '★',
    type: 'positive'
  }, {
    label: 'cut',
    text: 'cut',
    type: 'negative'
  }, {
    label: 'sp',
    text: 'spelling',
    type: 'negative'
  }
];
const mockedElementDOM = {
  removeChild: jest.fn(),
  classList: {
    remove: jest.fn(),
    add: jest.fn()
  },
};

jest.spyOn(utils, 'removeElemsWrapping').mockImplementation(() => {});

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

  const wrapper = extras => {
    const defaults = {
      ...defaultProps,
      onChange,
      onCommentChange
    };
    const props = { ...defaults, ...extras };

    return shallow(<Editor { ...props } />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('renders disabled', () => {
      expect(wrapper({ disabled: true })).toMatchSnapshot();
    });

    it('renders with predefined annotations', () => {
      expect(wrapper({ predefinedAnnotations })).toMatchSnapshot();
    });

    it('renders with text and annotations', () => {
      expect(
        wrapper({
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
        })
      ).toMatchSnapshot();
    });

    it('renders with complex text and nested annotations', () => {
      expect(
        wrapper({
          text: '<div>This is <b>a complex </b><em>example</em><br/>This is a new line.</div>',
          annotations: [
            {
              'id': '1',
              'label': 'creative',
              'type': 'positive',
              'quote': 'This is a complex exam',
              'start': 0,
              'end': 22
            },
            {
              'id': '2',
              'label': 'punctuation',
              'type': 'negative',
              'quote': 'exampleThis is',
              'start': 18,
              'end': 32
            },
            {
              'id': '3',
              'label': 'cut',
              'type': 'negative',
              'quote': 'a comp',
              'start': 8,
              'end': 14
            }
          ]
        })
      ).toMatchSnapshot();
    });

    it('renders with text and comment', () => {
      expect(
        wrapper({
          text: '<div>This is an example.</div>',
          comment: '<div>Very good</div>'
        })
      ).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('select a predefined annotation', () => {
      it('calls onChange when new annotation selected',  () => {
        const w = wrapper({
          text: '<div>This is an example.</div>',
        });

        w.instance().createDOMAnnotation = jest.fn();
        w.instance().handleClose = jest.fn();
        w.update();

        w.setState({
          selectedElems: [mockedElementDOM, mockedElementDOM],
          selectionDetails: {
            'quote': 'This',
            'start': 0,
            'end': 4
          },
        });
        w.instance().handleMenuClick({
          type: 'positive',
          text: 'good'
        });

        expect(w.instance().createDOMAnnotation).toBeCalled();
        expect(onChange).toBeCalled();
        expect(w.instance().handleClose).toBeCalled();
      });

      it('calls onChange when old annotation selected',  () => {
        const w = wrapper({
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

        w.instance().updateLabel = jest.fn();
        w.instance().handleClose = jest.fn();
        w.update();

        w.setState({
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
        });
        w.instance().handleMenuClick({
          type: 'negative',
          text: 'wrong'
        });
        expect(w.instance().updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
        expect(w.instance().handleClose).toBeCalled();
      });
    });

    describe('write new annotation', () => {
      it('calls onChange',  () => {
        const w = wrapper({
          text: '<div>This is an example.</div>',
        });

        w.instance().createDOMAnnotation = jest.fn();
        w.update();

        w.setState({
          selectedElems: [mockedElementDOM, mockedElementDOM],
          selectionDetails: {
            'quote': 'This',
            'start': 0,
            'end': 4
          },
        });
        w.instance().addAnnotation('positive');

        expect(w.instance().createDOMAnnotation).toBeCalled();
        expect(onChange).toBeCalled();
      });
    });

    describe('edit annotation', () => {
      it('updates state',  () => {
        const w = wrapper();

        w.setState({
          openedMenu: true,
          openedEditor: false
        });
        w.instance().editAnnotation();
        expect(w.state().openedMenu).toEqual(false);
        expect(w.state().openedEditor).toEqual(true);
      });
    });

    describe('delete annotation', () => {
      it('calls onChange',  () => {
        const w = wrapper({
          text: '<div>This is an example.</div>',
        });

        w.instance().handleClose = jest.fn();
        w.update();

        w.setState({
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
        });
        w.instance().deleteAnnotation();

        expect(utils.removeElemsWrapping).toBeCalled();
        expect(onChange).toBeCalled();
        expect(w.instance().handleClose).toBeCalled();
      });
    });

    describe('update annotation', () => {
      it('calls onChange',  () => {
        const w = wrapper({
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

        w.instance().updateLabel = jest.fn();
        w.update();

        w.setState({
          annotationIndex: 0
        });
        w.instance().updateAnnotation();

        expect(w.instance().updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
      });
    });

    describe('change annotation type', () => {
      it('calls onChange',  () => {
        const w = wrapper({
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

        w.instance().updateLabel = jest.fn();
        w.instance().handleClose = jest.fn();
        w.update();

        w.setState({
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
        });
        w.instance().changeAnnotationType('very good');
        expect(w.instance().updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
        expect(w.instance().handleClose).toBeCalled();
      });
    });

    describe('update annotation label', () => {
      it('calls createDOMAnnotation',  () => {
        const w = wrapper({
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

        w.instance().updateLabel = jest.fn();
        w.instance().handleClose = jest.fn();
        w.update();

        w.setState({
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
        });
        w.instance().changeAnnotationType('very good');
        expect(w.instance().updateLabel).toBeCalled();
        expect(onChange).toBeCalled();
        expect(w.instance().handleClose).toBeCalled();
      });
    });

  });
});
