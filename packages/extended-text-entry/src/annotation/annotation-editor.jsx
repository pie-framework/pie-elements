import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import {
  clearSelection,
  isSideLabel,
  getAnnotationElements,
  getDOMNodes,
  getLabelElement,
  getRangeDetails,
  removeElemsWrapping,
  wrapRange,
} from './annotation-utils';
import FreeformEditor from './freeform-editor';
import AnnotationMenu from './annotation-menu';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';

const TextContainer = styled('div')({
  padding: '10px 120px 10px 16px',
  backgroundColor: 'rgba(0, 0, 0, 0.06)',
  border: '1px solid #ccc',
  borderRadius: '4px',
  overflowY: 'scroll',
  lineHeight: '36px',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  '& p': {
    margin: 0,
  },
  '& span[data-latex]': {
    userSelect: 'none',
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
  },
});

const LabelsContainer = styled('div')({
  width: '230px',
});

const Wrapper = styled('div')({
  position: 'relative',
  overflowX: 'hidden',
  display: 'flex',
});

const CommentContainer = styled(InputContainer)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  width: '100%',
}));

// Global styles for pseudo-elements that can't be applied inline
const globalStyles = `
  .sideAnnotation:before {
    position: absolute;
    right: var(--before-right, 100%);
    top: var(--before-top, 5px);
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    pointer-events: none;
    border-width: var(--before-border-width, 7px);
    border-right-color: var(--before-border-color, rgb(153, 255, 153));
  }
`;

// Inject styles if not already injected
if (!document.getElementById('annotation-editor-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'annotation-editor-styles';
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

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
      annotationIndex: null,
    };
  }

  componentDidMount() {
    const { annotations, text } = this.props;

    if (text) {
      annotations.forEach((annotation) => {
        const [domStart, domEnd] = getDOMNodes(annotation.start, annotation.end, this.textRef);

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
  }

  adjustAnnotationsPosition = () => {
    if (this.textRef && this.labelsRef) {
      const left = this.textRef.offsetLeft + this.textRef.offsetWidth + 8;

      Array.from(this.labelsRef.children).forEach((label) => {
        const spans = getAnnotationElements(label.dataset.annId);
        const spanOffset = spans[0].offsetTop ? spans[0].offsetTop : spans[0].offsetParent.offsetTop;
        const top = spanOffset - this.textRef.scrollTop - 6;

        label.style.top = `${top}px`;
        label.style.left = `${left}px`;
      });
    }
  };

  handleClick = (event) => {
    const { annotations } = this.props;
    const { selectionDetails } = this.state;

    if (selectionDetails) {
      // new selection was made inside another annotation and should not update that annotation
      return;
    }

    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = getAnnotationElements(annotationId);
    const labelElem = getLabelElement(annotationId);
    const annotationIndex = annotations.findIndex((annotation) => annotation.id === annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    if (isSideLabel) {
      labelElem.style.zIndex = '10';
    }

    this.setState({
      anchorEl: selectedElems[0],
      openedMenu: !!id || (!!annId && !isSideLabel), // true if the annotation or the label was clicked
      openedEditor: !!annId && isSideLabel, // true if the side label was clicked
      selectedElems,
      labelElem,
      annotationIndex,
      annotation: annotations[annotationIndex],
      selectionDetails: null,
    });
  };

  handleHover = (event) => {
    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = getAnnotationElements(annotationId);
    const labelElem = getLabelElement(annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    selectedElems.forEach((elem) => {
      elem.style.zIndex = '20';
      if (elem.classList.contains('positive')) {
        elem.style.backgroundColor = 'rgb(51, 255, 51, 0.7)';
      } else if (elem.classList.contains('negative')) {
        elem.style.backgroundColor = 'rgba(255, 102, 204, 0.55)';
      }
    });

    if (isSideLabel) {
      labelElem.style.zIndex = '20';
      if (labelElem.classList.contains('positive')) {
        labelElem.style.backgroundColor = 'rgb(128, 255, 128)';
        labelElem.style.setProperty('--before-border-color', 'rgb(153, 255, 153)');
      } else if (labelElem.classList.contains('negative')) {
        labelElem.style.backgroundColor = 'rgb(255, 179, 230)';
        labelElem.style.setProperty('--before-border-color', 'rgb(255, 179, 230)');
      }
    } else {
      labelElem.style.zIndex = '20';
      if (labelElem.classList.contains('positive')) {
        labelElem.style.color = 'rgb(0, 77, 0)';
      } else if (labelElem.classList.contains('negative')) {
        labelElem.style.color = 'rgb(153, 0, 102)';
      }
    }
  };

  handleCancelHover = (event) => {
    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = getAnnotationElements(annotationId);
    const labelElem = getLabelElement(annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    selectedElems.forEach((elem) => {
      elem.style.zIndex = '';
      if (elem.classList.contains('positive')) {
        elem.style.backgroundColor = 'rgb(51, 255, 51, 0.5)';
      } else if (elem.classList.contains('negative')) {
        elem.style.backgroundColor = 'rgba(255, 102, 204, 0.4)';
      }
    });

    if (isSideLabel) {
      labelElem.style.zIndex = '';
      if (labelElem.classList.contains('positive')) {
        labelElem.style.backgroundColor = 'rgb(153, 255, 153)';
        labelElem.style.removeProperty('--before-border-color');
      } else if (labelElem.classList.contains('negative')) {
        labelElem.style.backgroundColor = 'rgb(255, 204, 238)';
        labelElem.style.removeProperty('--before-border-color');
      }
    } else {
      labelElem.style.zIndex = '';
      if (labelElem.classList.contains('positive')) {
        labelElem.style.color = 'rgb(0, 128, 0)';
      } else if (labelElem.classList.contains('negative')) {
        labelElem.style.color = 'rgb(204, 0, 136)';
      }
    }
  };

  handleClose = (event) => {
    const { selectedElems, labelElem } = this.state;

    if (selectedElems.length && !selectedElems[0].hasAttribute('data-id')) {
      removeElemsWrapping(selectedElems, this.textRef);
    }

    if (labelElem) {
      labelElem.style.zIndex = '';
    }

    this.setState({
      anchorEl: null,
      openedMenu: false,
      openedEditor: false,
      selectedElems: [],
      labelElem: null,
      selectionDetails: null,
      annotationIndex: null,
      annotation: null,
    });

    clearSelection();
  };

  handleSelection = (event) => {
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
          selectionDetails,
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
    const { disabled } = this.props;
    const { id, label, type } = annotation;

    (elems || []).forEach((elem) => {
      elem.dataset.id = id;
      elem.className = `annotation ${type}`;
      // Apply annotation styles directly
      elem.style.position = 'relative';
      elem.style.cursor = 'pointer';
      if (type === 'positive') {
        elem.style.backgroundColor = 'rgb(51, 255, 51, 0.5)';
      } else if (type === 'negative') {
        elem.style.backgroundColor = 'rgba(255, 102, 204, 0.4)';
      }
      elem.onclick = !disabled && this.handleClick;
      elem.onmouseover = this.handleHover;
      elem.onmouseout = this.handleCancelHover;
    });

    const firstSpan = (elems && elems[0]) || {};
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
      labelElem.className = `sideAnnotation ${type}`;
      
      // Apply side annotation styles directly
      labelElem.style.position = 'absolute';
      labelElem.style.padding = '4px';
      labelElem.style.borderRadius = '4px';
      labelElem.style.marginLeft = '8px';
      labelElem.style.width = '180px';
      labelElem.style.whiteSpace = 'pre-wrap';
      labelElem.style.wordBreak = 'break-word';
      labelElem.style.border = '2px solid #ffffff';
      labelElem.style.fontSize = '14px';
      labelElem.style.fontStyle = 'normal';
      labelElem.style.fontWeight = 'normal';
      labelElem.style.top = `${top}px`;
      labelElem.style.left = `${left}px`;
      
      if (type === 'negative') {
        labelElem.style.backgroundColor = 'rgb(255, 204, 238)';
      } else if (type === 'positive') {
        labelElem.style.backgroundColor = 'rgb(153, 255, 153)';
      }
      
      // Add pseudo-element styles via CSS
      labelElem.style.setProperty('--before-border-width', '7px');
      labelElem.style.setProperty('--before-top', '5px');
      labelElem.style.setProperty('--before-right', '100%');
      if (type === 'negative') {
        labelElem.style.setProperty('--before-border-color', 'rgb(255, 204, 238)');
      } else if (type === 'positive') {
        labelElem.style.setProperty('--before-border-color', 'rgb(153, 255, 153)');
      }

      this.labelsRef.appendChild(labelElem);
    } else {
      labelElem.className = `annotationLabel ${type}`;
      
      // Apply annotation label styles directly
      labelElem.style.backgroundColor = 'rgb(242, 242, 242)';
      labelElem.style.padding = '2px';
      labelElem.style.position = 'absolute';
      labelElem.style.userSelect = 'none';
      labelElem.style.whiteSpace = 'nowrap';
      labelElem.style.top = '-10px';
      labelElem.style.left = '-2px';
      labelElem.style.fontSize = '12px';
      labelElem.style.fontStyle = 'normal';
      labelElem.style.fontWeight = 'normal';
      labelElem.style.lineHeight = '6px';
      labelElem.style.webkitUserSelect = 'none';
      labelElem.style.mozUserSelect = 'none';
      labelElem.style.msUserSelect = 'none';
      
      if (type === 'positive') {
        labelElem.style.color = 'rgb(0, 128, 0)';
      } else if (type === 'negative') {
        labelElem.style.color = 'rgb(204, 0, 136)';
      }
      
      firstSpan.appendChild(labelElem);
    }
  };

  createNewAnnotation = (label, type) => {
    const { selectedElems, selectionDetails } = this.state;
    const annotation = {
      id: [selectionDetails.start, selectionDetails.end, new Date().getTime()].join('-'),
      label,
      type,
      ...selectionDetails,
    };

    this.createDOMAnnotation(selectedElems, annotation);

    return annotation;
  };

  handleMenuClick = (newAnnotation) => {
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
      openedEditor: true,
    });
  };

  addAnnotation = (type) => {
    const { annotations, onChange } = this.props;
    const annotation = this.createNewAnnotation('', type);
    const labelElem = getLabelElement(annotation.id);

    annotations.push(annotation);

    this.setState({
      openedMenu: false,
      openedEditor: true,
      annotationIndex: annotations.length - 1,
      annotation,
      labelElem,
    });

    onChange(annotations);
  };

  updateLabel = (oldLabel, annotation, oldType) => {
    const { selectedElems, labelElem } = this.state;
    const { label, type } = annotation;

    if ((isSideLabel(label) && isSideLabel(oldLabel)) || (!isSideLabel(label) && !isSideLabel(oldLabel))) {
      labelElem.innerHTML = label;

      if (oldType) {
        labelElem.classList.remove(oldType);
        labelElem.classList.add(type);

        selectedElems.forEach((elem) => {
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

    selectedElems.forEach((span) => {
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
  }

  render() {
    const {
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
      text,
    } = this.props;
    const { anchorEl, annotation, openedMenu, openedEditor, selectionDetails } = this.state;

    const anchorOffset = anchorEl && (anchorEl.offsetTop ? anchorEl.offsetTop : anchorEl.offsetParent.offsetTop);
    const topOffset = this.textRef && anchorOffset ? anchorOffset - this.textRef.scrollTop - 8 : 0;

    return (
      <div>
        <Wrapper>
          <TextContainer
            style={{ width: width - 34, minHeight: height, maxHeight: maxHeight }}
            ref={(r) => (this.textRef = r)}
            onMouseDown={!disabled ? clearSelection : () => {}}
            onMouseUp={!disabled ? this.handleSelection : () => {}}
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <LabelsContainer ref={(r) => (this.labelsRef = r)} />
        </Wrapper>

        <CommentContainer label={'Comment'}>
          <EditableHtml
            className="prompt"
            markup={comment || ''}
            onChange={onCommentChange}
            width={width && (width + 104).toString()}
            disabled={disabled}
            pluginProps={{
              math: {
                disabled: disabledMath,
                customKeys: customKeys,
                keypadMode: keypadMode,
                controlledKeypadMode: false,
              },
              video: {
                disabled: true,
              },
              audio: {
                disabled: true,
              },
              textAlign: {
                disabled: true,
              },
            }}
          />
        </CommentContainer>

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
          value={(annotation && annotation.label) || ''}
          type={annotation && annotation.type}
          onClose={this.handleClose}
          onDelete={this.deleteAnnotation}
          onSave={this.updateAnnotation}
          onTypeChange={this.changeAnnotationType}
        />
      </div>
    );
  }
}

export default AnnotationEditor;
