import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Popover, TextField } from '@material-ui/core';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { getDOMNodes, wrapRange, getRangeDetails, clearSelection, isSideLabel } from './annotation-utils';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
import FreeformEditor from './freeform-editor';
import AnnotationMenu from './annotation-menu';

const style = {
  textContainer: {
    padding: '10px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflowY: 'scroll'
  },
  labelsContainer: {
    width: '220px'
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
    '&.positive': {
      backgroundColor: 'rgb(51, 255, 51, 0.5)',
    },
    '&.negative': {
      backgroundColor: 'rgba(255, 102, 204, 0.4)',
    }
  },
  annotationLabel: {
    position: 'absolute',
    // pointerEvents: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    top: '-10px',
    left: 0,
    fontSize: '10px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    '-webkit-user-select': 'none', /* Safari */
    '-moz-user-select': 'none', /* Firefox */
    '-ms-user-select': 'none' /* IE10+/Edge */,
    '&.positive': {
      color: 'rgb(0, 128, 0)',
    },
    '&.negative': {
      color: 'rgb(204, 0, 136)',
    }
  },
  hover: {
    filter: 'brightness(85%)',
    zIndex: 10
  },
  sideAnnotationHover: {
    zIndex: 10,
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
    // backgroundColor: '#d3d3d3',
    borderRadius: '4px',
    marginLeft: '8px',
    maxWidth: '180px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    border: '2px solid #ffffff',

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
      // borderRightColor: '#d3d3d3'
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
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      openedMenu: false,
      openedEditor: false,
      selectedElems: [],
      labelElem: null,
      selectionDetails: {},
      annotation: null,
      annotationIndex: null
    };
  };

  componentDidMount() {
    const { annotations, text } = this.props;

    if (text) {
      annotations.forEach(annotation => {
        const [ domStart, domEnd ] = getDOMNodes(annotation.start, annotation.end, this.textRef);
        const range = document.createRange();
        range.setStart(domStart.node, domStart.offset);
        range.setEnd(domEnd.node, domEnd.offset);

        const spans = wrapRange(range);
        this.createDOMAnnotation(spans, annotation);
      });
    }

    this.adjustAnnotationsPosition();
    this.textRef.addEventListener('scroll', this.adjustAnnotationsPosition);
  };

  adjustAnnotationsPosition = () => {
    const left = this.textRef.offsetLeft + this.textRef.offsetWidth + 8;

    Array.from(this.labelsRef.children).forEach(label => {
      const spans = this.getAnnotationElements(label.dataset.annId);
      const top = spans[0].offsetTop - this.textRef.scrollTop; // - spans[0].offsetHeight

      label.style.top = `${top}px`;
      label.style.left = `${left}px`;
    });
  };

  getAnnotationElements = id => {
    return Array.from(document.querySelectorAll(`[data-id='${id}']`));
  };

  getLabelElement = id => {
    return document.querySelector(`[data-ann-id='${id}']`);
  }

  handleClick = event => {
    const { annotations, classes } = this.props;
    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = this.getAnnotationElements(annotationId);
    const labelElem = this.getLabelElement(annotationId)
    const annotationIndex = annotations.findIndex(annotation => annotation.id === annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');
    console.log('annotations', annotations);
    console.log('annotationindex', annotationIndex);
    console.log('annotations[annotationIndex]', annotations[annotationIndex]);
    console.log('labelElem', labelElem);

    this.setState({
      anchorEl: selectedElems[0],
      openedMenu: !!id || !!annId && !isSideLabel,
      openedEditor: !!annId && isSideLabel,
      selectedElems,
      labelElem,
      annotationIndex,
      annotation: annotations[annotationIndex],
      selectionDetails: {}
    });
  };

  handleHover = event => {
    const { classes } = this.props;
    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = this.getAnnotationElements(annotationId);
    const labelElem = this.getLabelElement(annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    selectedElems.forEach(elem => elem.classList.add(classes.hover));
    labelElem.classList.add(isSideLabel ? classes.sideAnnotationHover : classes.hover);
  };

  handleCancelHover = event => {
    const { classes } = this.props;
    const { id, annId } = event.target.dataset;
    const annotationId = id || annId;
    const selectedElems = this.getAnnotationElements(annotationId);
    const labelElem = this.getLabelElement(annotationId);
    const isSideLabel = labelElem.hasAttribute('data-freeform');

    selectedElems.forEach(elem => elem.classList.remove(classes.hover));
    labelElem.classList.remove(isSideLabel ? classes.sideAnnotationHover : classes.hover);
  };

  handleClose = event => {
    const { selectedElems } = this.state;

    if (selectedElems.length && !selectedElems[0].hasAttribute('data-id')) {
      this.removeElemsWrapping(selectedElems);
    }

    this.setState({
      anchorEl: null,
      openedMenu: false,
      openedEditor: false,
      selectedElems: [],
      labelElem: null,
      selectionDetails: {},
      annotationIndex: null,
      annotation: null
    });

    clearSelection();
  };

  handleSelection = event => {
    const selection = window.getSelection();

    if (event.detail <= 2 && selection && selection.rangeCount > 0) { // prevent unwanted selections
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

  removeElemsWrapping = elems => {
    elems.forEach(elem => {
      const parent = elem.parentNode;
      const childNodes = elem.childNodes;
      const childNodesLength = childNodes.length;

      if (childNodesLength > 0) {
        for (let i = 0; i < childNodesLength; i++) {
          parent.insertBefore(childNodes[0], elem);
        }
      } else {
        parent.insertBefore(document.createTextNode(elem.textContent), elem);
      }

      parent.removeChild(elem);
    });

    this.textRef.normalize();
  };

  deleteAnnotation = () => {
    const { annotations, onChange } = this.props;
    const { selectedElems, labelElem, annotationIndex, annotation } = this.state;
    const parentRef = isSideLabel(annotation.label) ? this.labelsRef : selectedElems[0];

    parentRef.removeChild(labelElem);
    this.removeElemsWrapping(selectedElems);

    annotations.splice(annotationIndex, 1);
    onChange(annotations);
    this.handleClose();
  };

  createDOMAnnotation = (elems, annotation) => {
    const { classes, disabled } = this.props;
    const { id, label, type } = annotation;

    elems.forEach(elem => {
      elem.dataset.id = id;
      elem.className = classNames(classes.annotation, type);
      elem.onclick = !disabled && this.handleClick;
      elem.onmouseover = this.handleHover;
      elem.onmouseout = this.handleCancelHover;
    });

    const firstSpan = elems[0];
    const labelElem = document.createElement('SPAN');

    labelElem.dataset.annId = id;
    labelElem.innerHTML = label;
    labelElem.onclick = !disabled && this.handleClick;
    labelElem.onmouseover = this.handleHover;
    labelElem.onmouseout = this.handleCancelHover;

    if (isSideLabel(label)) {
      const top = firstSpan.offsetTop - this.textRef.scrollTop;
      const left = this.textRef.offsetLeft + this.textRef.offsetWidth + 8;

      labelElem.dataset.freeform = true;
      labelElem.className = classNames(classes.sideAnnotation, type);
      labelElem.style.top = `${top}px`;
      labelElem.style.left = `${left}px`;
      this.labelsRef.appendChild(labelElem);
    } else {
      labelElem.className = classNames(classes.annotationLabel, type);
      firstSpan.insertBefore(labelElem, firstSpan.firstChild);
    }
  };

  handleMenuClick = (event, newAnnotation) => {
    const { annotations, onChange } = this.props;
    const { selectedElems, selectionDetails, annotation, annotationIndex } = this.state;
    const { type, text: label } = newAnnotation;

    if (!_.isEmpty(annotation)) {
      const updatedAnnotation = { ...annotation, label, type };
      const { type: oldType, label: oldLabel } = annotation;

      this.updateLabel(oldLabel, updatedAnnotation, type !== oldType && oldType);
      annotations.splice(annotationIndex, 1, updatedAnnotation);
    } else {
      const newAnnotation = {
        id: uuidv4(),
        label,
        type,
        ...selectionDetails
      };

      this.createDOMAnnotation(selectedElems, newAnnotation);
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
    const { selectedElems, selectionDetails } = this.state;
    const { annotations, onChange } = this.props;
    const annotation = {
      id: uuidv4(),
      label: '',
      type,
      ...selectionDetails
    };

    this.createDOMAnnotation(selectedElems, annotation);
    annotations.push(annotation);
    const labelElem = this.getLabelElement(annotation.id);

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
    const { classes } = this.props;
    const { selectedElems, labelElem } = this.state;
    const { label, type } = annotation;

    if (isSideLabel(label) && isSideLabel(oldLabel) || !isSideLabel(label) && !isSideLabel(oldLabel)) {
      labelElem.innerHTML = label;

      if (oldType) {
        labelElem.classList.remove(oldType);
        labelElem.classList.add(type);
      }
    } else if (isSideLabel(label) && !isSideLabel(oldLabel)) {
      console.log('selectedElems', selectedElems);
      console.log('labelElem', labelElem);
      if (selectedElems[0]) {
        selectedElems[0].removeChild(labelElem);
      }
      this.createDOMAnnotation(selectedElems, annotation);
    } else if (!isSideLabel(label) && isSideLabel(oldLabel)) {
      this.labelsRef.removeChild(labelElem);
      this.createDOMAnnotation(selectedElems, annotation);
    }
  };

  changeAnnotationType = (newLabel) => {
    const { annotations, onChange, classes } = this.props;
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
    const { annotations, classes, comment, disabled, height, width, maxHeight, onCommentChange, predefinedAnnotations, text } = this.props;
    const { anchorEl, openedMenu, openedEditor, selectionDetails, currentValue, annotation } = this.state;
    const topOffset = this.textRef && anchorEl ? (anchorEl.offsetTop - this.textRef.scrollTop - 8) : 0;
    console.log('annotations', annotations);
    console.log('annotation', annotation);

    return (
      <div>
        <div className={classes.wrapper}>
          <div
            className={classes.textContainer}
            style={{ width: width, minHeight: height, maxHeight: maxHeight }}
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
            width={'534' || width && width.toString()}
            disabled={disabled}
            // highlightShape={true}
            // imageSupport={imageSupport}
            nonEmpty={false}
            // toolbarOpts={toolbarOpts}

            // pluginProps={{
            //   math: {
            //     disabled: !mathInput,
            //     customKeys: this.props.model.customKeys,
            //     keypadMode: this.props.model.equationEditor,
            //     controlledKeypadMode: false
            //   },
            //   video: {
            //     disabled: true
            //   },
            //   audio: {
            //     disabled: true
            //   }
            // }}
          />
        </InputContainer>

        <AnnotationMenu
          anchorEl={anchorEl}
          open={openedMenu && !disabled}
          annotations={predefinedAnnotations}
          isNewAnnotation={_.isEmpty(selectionDetails)}
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
