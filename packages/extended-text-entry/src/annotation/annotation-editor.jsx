import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  clearSelection,
  isSideLabel,
  getAnnotationElements,
  getDOMNodes,
  getLabelElement,
  getRangeDetails,
  removeElemsWrapping,
  wrapRange
} from './annotation-utils';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
import FreeformEditor from './freeform-editor';
import AnnotationMenu from './annotation-menu';

const style = {
  textContainer: {
    padding: '10px 120px 10px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflowY: 'scroll',
    lineHeight: '36px',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    '& p': {
      margin: 0
    },
    '& span[data-latex]': {
      userSelect: 'none',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none'
    }
  },
  labelsContainer: {
    width: '230px'
  },
  wrapper: {
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex'
  },
  commentContainer: {
    paddingTop: 16,
    marginBottom: 16,
    marginTop: 16,
    width: '100%'
  },
  annotation: {
    position: 'relative',
    cursor: 'pointer',
    lineHeight: '19px',

    '&.positive': {
      backgroundColor: 'rgb(51, 255, 51, 0.5)',
    },

    '&.negative': {
      backgroundColor: 'rgba(255, 102, 204, 0.4)',
    }
  },
  annotationLabel: {
    backgroundColor: 'rgb(242, 242, 242)',
    padding: '2px',
    position: 'absolute',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    top: '-10px',
    left: '-2px',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '6px',
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',

    '&.positive': {
      color: 'rgb(0, 128, 0)',
    },

    '&.negative': {
      color: 'rgb(204, 0, 136)',
    }
  },
  labelHover: {
    zIndex: 20,

    '&.positive': {
      color: 'rgb(0, 77, 0)',
    },

    '&.negative': {
      color: 'rgb(153, 0, 102)',
    }
  },
  highlight: {
    zIndex: 10
  },
  hover: {
    zIndex: 20,

    '&.positive': {
      backgroundColor: 'rgb(51, 255, 51, 0.7)',
    },

    '&.negative': {
      backgroundColor: 'rgba(255, 102, 204, 0.55)',
    }
  },
  sideAnnotationHover: {
    zIndex: 20,

    '&.negative': {
      backgroundColor: 'rgb(255, 179, 230) !important',
      '&:before': {
        borderRightColor: 'rgb(255, 179, 230) !important'
      }
    },

    '&.positive': {
      backgroundColor: 'rgb(128, 255, 128) !important',
      '&:before': {
        borderRightColor: 'rgb(153, 255, 153) !important'
      }
    }
  },
  sideAnnotation: {
    position: 'absolute',
    padding: '4px',
    borderRadius: '4px',
    marginLeft: '8px',
    width: '180px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    border: '2px solid #ffffff',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 'normal',

    '&:before': {
      position: 'absolute',
      right: '100%',
      top: '5px',
      border: 'solid transparent',
      content: '""',
      height: 0,
      width: 0,
      pointerEvents: 'none',
      borderWidth: '7px',
    },

    '&.negative': {
      backgroundColor: 'rgb(255, 204, 238)',
      '&:before': {
        borderRightColor: 'rgb(255, 204, 238)'
      }
    },

    '&.positive': {
      backgroundColor: 'rgb(153, 255, 153)',
      '&:before': {
        borderRightColor: 'rgb(153, 255, 153)'
      }
    }
  },
};

class AnnotationEditor extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    comment: PropTypes.string,
    annotations: PropTypes.array,
    predefinedAnnotations: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onCommentChange: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    maxHeight: PropTypes.string,
    disabled: PropTypes.bool,
    disabledMath: PropTypes.bool,
    customKeys: PropTypes.array,
    keypadMode: PropTypes.string,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      openedMenu: false,
      openedEditor: false,
      selectedElems: [],
      labelElem: null,
      selectionDetails: null,
      annotation: null,
      annotationIndex: null
    };
  };

  componentDidMount() {
    const { annotations, text } = this.props;

    if (text) {
      annotations.forEach(annotation => {
        const [ domStart, domEnd ] = getDOMNodes(annotation.start, annotation.end, this.textRef);

        if (domStart && domEnd) {
          const range = document.createRange();

          range.setStart(domStart.node, domStart.offset);
          range.setEnd(domEnd.node, domEnd.offset);

          const spans = wrapRange(range);

          this.createDOMAnnotation(spans, annotation);
        }
      });
    }

    if (this.textRef) {
      this.adjustAnnotationsPosition();
      this.textRef.addEventListener('scroll', this.adjustAnnotationsPosition);
    }
  };

  adjustAnnotationsPosition = () => {
    if (this.textRef && this.labelsRef) {
      const left = this.textRef.offsetLeft + this.textRef.offsetWidth + 8;

      Array.from(this.labelsRef.children).forEach(label => {
        const spans = getAnnotationElements(label.dataset.annId);
        const spanOffset = spans[0].offsetTop ? spans[0].offsetTop : spans[0].offsetParent.offsetTop;
        const top = spanOffset - this.textRef.scrollTop - 6;

        label.style.top = `${top}px`;
        label.style.left = `${left}px`;
      });
    }
  };

  handleClick = event => {
    const { annotations, classes } = this.props;
    const { selectionDetails } = this.state;

    if (selectionDetails) {
      // new selection was made inside another annotation and should not update that annotation
      return;
    }

    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = getAnnotationElements(annotationId);
    const labelElem = getLabelElement(annotationId);
    const annotationIndex = annotations.findIndex(annotation => annotation.id === annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    if (isSideLabel) {
      labelElem.classList.add(classes.highlight);
    }

    this.setState({
      anchorEl: selectedElems[0],
      openedMenu: !!id || !!annId && !isSideLabel, // true if the annotation or the label was clicked
      openedEditor: !!annId && isSideLabel, // true if the side label was clicked
      selectedElems,
      labelElem,
      annotationIndex,
      annotation: annotations[annotationIndex],
      selectionDetails: null
    });
  };

  handleHover = event => {
    const { classes } = this.props;
    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = getAnnotationElements(annotationId);
    const labelElem = getLabelElement(annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    selectedElems.forEach(elem => elem.classList.add(classes.hover));
    labelElem.classList.add(isSideLabel ? classes.sideAnnotationHover : classes.labelHover);
  };

  handleCancelHover = event => {
    const { classes } = this.props;
    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = getAnnotationElements(annotationId);
    const labelElem = getLabelElement(annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    selectedElems.forEach(elem => elem.classList.remove(classes.hover));
    labelElem.classList.remove(isSideLabel ? classes.sideAnnotationHover : classes.labelHover);
  };

  handleClose = event => {
    const { classes } = this.props;
    const { selectedElems, labelElem } = this.state;

    if (selectedElems.length && !selectedElems[0].hasAttribute('data-id')) {
      removeElemsWrapping(selectedElems, this.textRef);
    }

    if (labelElem) {
      labelElem.classList.remove(classes.highlight);
    }

    this.setState({
      anchorEl: null,
      openedMenu: false,
      openedEditor: false,
      selectedElems: [],
      labelElem: null,
      selectionDetails: null,
      annotationIndex: null,
      annotation: null
    });

    clearSelection();
  };

  handleSelection = event => {
    const selection = window.getSelection();

    // prevent unwanted selections
    if (event.detail > 2) {
      clearSelection();
      return;
    }

    if (selection && selection.rangeCount > 0) {
      const selectedRange = selection.getRangeAt(0);
      const selectedText = selectedRange.toString();
      const isSelectionInside = this.textRef.contains(selectedRange.commonAncestorContainer);

      if (!selection.isCollapsed && selectedText !== '' && isSelectionInside) {
        const selectionDetails = getRangeDetails(selectedRange, this.textRef);
        const selectedElems = wrapRange(selectedRange);

        this.setState({
          anchorEl: selectedElems[0],
          openedMenu: true,
          selectedElems,
          selectionDetails
        });
      }
    }
  };

  deleteAnnotation = () => {
    const { annotations, onChange } = this.props;
    const { selectedElems, labelElem, annotationIndex, annotation } = this.state;
    const parentRef = isSideLabel(annotation.label) ? this.labelsRef : selectedElems[0];

    parentRef.removeChild(labelElem);
    removeElemsWrapping(selectedElems, this.textRef);
    annotations.splice(annotationIndex, 1);

    onChange(annotations);
    this.handleClose();
  };

  createDOMAnnotation = (elems, annotation) => {
    const { classes, disabled } = this.props;
    const { id, label, type } = annotation;

    (elems || []).forEach(elem => {
      elem.dataset.id = id;
      elem.className = classNames(classes.annotation, type);
      elem.onclick = !disabled && this.handleClick;
      elem.onmouseover = this.handleHover;
      elem.onmouseout = this.handleCancelHover;
    });

    const firstSpan = elems && elems[0] || {};
    const labelElem = document.createElement('SPAN');

    labelElem.dataset.annId = id;
    labelElem.innerHTML = label;
    labelElem.onclick = !disabled && this.handleClick;
    labelElem.onmouseover = this.handleHover;
    labelElem.onmouseout = this.handleCancelHover;

    if (isSideLabel(label)) {
      const spanOffset = firstSpan.offsetTop ? firstSpan.offsetTop : firstSpan.offsetParent.offsetTop;
      const top = spanOffset - this.textRef.scrollTop;
      const left = this.textRef.offsetLeft + this.textRef.offsetWidth + 8;

      labelElem.dataset.freeform = true;
      labelElem.className = classNames(classes.sideAnnotation, type);
      labelElem.style.top = `${top}px`;
      labelElem.style.left = `${left}px`;

      this.labelsRef.appendChild(labelElem);
    } else {
      labelElem.className = classNames(classes.annotationLabel, type);
      firstSpan.appendChild(labelElem);
    }
  };

  createNewAnnotation = (label, type) => {
    const { selectedElems, selectionDetails } = this.state;
    const annotation = {
      id: [selectionDetails.start, selectionDetails.end, new Date().getTime()].join('-'),
      label,
      type,
      ...selectionDetails
    };

    this.createDOMAnnotation(selectedElems, annotation);

    return annotation;
  };

  handleMenuClick = newAnnotation => {
    const { annotations, onChange } = this.props;
    const { annotation, annotationIndex } = this.state;
    const { type, text: label } = newAnnotation;

    if (annotation) {
      const updatedAnnotation = { ...annotation, label, type };
      const { type: oldType, label: oldLabel } = annotation;

      this.updateLabel(oldLabel, updatedAnnotation, type !== oldType && oldType);
      annotations.splice(annotationIndex, 1, updatedAnnotation);
    } else {
      const newAnnotation = this.createNewAnnotation(label, type);

      annotations.push(newAnnotation);
    }

    onChange(annotations);
    this.handleClose();
  };

  editAnnotation = () => {
    this.setState({
      openedMenu: false,
      openedEditor: true
    });
  };

  addAnnotation = type => {
    const { annotations, onChange } = this.props;
    const annotation = this.createNewAnnotation('', type);
    const labelElem = getLabelElement(annotation.id);

    annotations.push(annotation);

    this.setState({
      openedMenu: false,
      openedEditor: true,
      annotationIndex: annotations.length - 1,
      annotation,
      labelElem
    });

    onChange(annotations);
  };

  updateLabel = (oldLabel, annotation, oldType) => {
    const { selectedElems, labelElem } = this.state;
    const { label, type } = annotation;

    if (isSideLabel(label) && isSideLabel(oldLabel) || !isSideLabel(label) && !isSideLabel(oldLabel)) {
      labelElem.innerHTML = label;

      if (oldType) {
        labelElem.classList.remove(oldType);
        labelElem.classList.add(type);

        selectedElems.forEach(elem => {
          elem.classList.remove(oldType);
          elem.classList.add(type);
        });
      }
    } else if (isSideLabel(label) && !isSideLabel(oldLabel)) {
      selectedElems[0].removeChild(labelElem);
      this.createDOMAnnotation(selectedElems, annotation);
    } else if (!isSideLabel(label) && isSideLabel(oldLabel)) {
      this.labelsRef.removeChild(labelElem);
      this.createDOMAnnotation(selectedElems, annotation);
    }
  };

  changeAnnotationType = (newLabel) => {
    const { annotations, onChange } = this.props;
    const { annotationIndex, selectedElems } = this.state;
    const { type: oldType, label: oldLabel } = annotations[annotationIndex];
    const type = oldType === 'positive' ? 'negative' : 'positive';
    const updatedAnnotation = { ...annotations[annotationIndex], type, label: newLabel };

    selectedElems.forEach(span => {
      span.classList.remove(oldType);
      span.classList.add(type);
    });

    this.updateLabel(oldLabel, updatedAnnotation, oldType);
    annotations.splice(annotationIndex, 1, updatedAnnotation);

    onChange(annotations);
    this.handleClose();
  };

  updateAnnotation = (oldLabel, newLabel) => {
    const { annotations, onChange } = this.props;
    const { annotationIndex } = this.state;
    const updatedAnnotation = { ...annotations[annotationIndex], label: newLabel };

    this.updateLabel(oldLabel, updatedAnnotation);
    annotations.splice(annotationIndex, 1, updatedAnnotation);

    onChange(annotations);
  };

  componentWillUnmount() {
    this.textRef.removeEventListener('scroll', this.adjustAnnotationsPosition);
  };

  render() {
    const {
      classes,
      comment,
      customKeys,
      disabled,
      disabledMath,
      keypadMode,
      height,
      width,
      maxHeight,
      onCommentChange,
      predefinedAnnotations,
      text
    } = this.props;
    const { anchorEl, annotation, openedMenu, openedEditor, selectionDetails } = this.state;
    const anchorOffset = anchorEl && (anchorEl.offsetTop ? anchorEl.offsetTop : anchorEl.offsetParent.offsetTop);
    const topOffset = this.textRef && anchorOffset ? (anchorOffset - this.textRef.scrollTop - 8) : 0;

    return (
      <div>
        <div className={classes.wrapper}>
          <div
            className={classes.textContainer}
            style={{ width: width - 34, minHeight: height, maxHeight: maxHeight }}
            ref={r => (this.textRef = r)}
            onMouseDown={!disabled ? clearSelection : () => {}}
            onMouseUp={!disabled ? this.handleSelection : () => {}}
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <div
            className={classes.labelsContainer}
            ref={r => (this.labelsRef = r)}
          />
        </div>

        <InputContainer label={'Comment'} className={classes.commentContainer}>
          <EditableHtml
            className={classes.prompt}
            markup={comment|| ''}
            onChange={onCommentChange}
            width={width && (width + 104).toString()}
            disabled={disabled}
            pluginProps={{
              math: {
                disabled: disabledMath,
                customKeys: customKeys,
                keypadMode: keypadMode,
                controlledKeypadMode: false
              },
              video: {
                disabled: true
              },
              audio: {
                disabled: true
              }
            }}
          />
        </InputContainer>

        <AnnotationMenu
          anchorEl={anchorEl}
          open={openedMenu && !disabled}
          annotations={predefinedAnnotations}
          isNewAnnotation={!!selectionDetails}
          onClose={this.handleClose}
          onDelete={this.deleteAnnotation}
          onEdit={this.editAnnotation}
          onWrite={this.addAnnotation}
          onAnnotate={this.handleMenuClick}
        />

        <FreeformEditor
          anchorEl={this.textRef}
          open={openedEditor && !disabled}
          offset={topOffset}
          value={annotation && annotation.label || ''}
          type={annotation && annotation.type}
          onClose={this.handleClose}
          onDelete={this.deleteAnnotation}
          onSave={this.updateAnnotation}
          onTypeChange={this.changeAnnotationType}
        />
      </div>
    );
  }
};

export default withStyles(style)(AnnotationEditor);
