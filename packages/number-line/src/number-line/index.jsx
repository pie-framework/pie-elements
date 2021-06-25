import Feedback from './feedback';
import Graph from './graph';
import PropTypes from 'prop-types';
import PointChooser from './point-chooser';
import React from 'react';
import Toggle from '@pie-lib/correct-answer-toggle';
import { buildElementModel } from './graph/elements/builder';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { color } from '@pie-lib/render-ui';
import injectSheet from 'react-jss';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isEqual from 'lodash/isEqual';

export { Graph };

const styles = {
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  graphTitle: {
    textAlign: 'center',
    pointerEvents: 'none',
    userSelect: 'none'
  },
  numberLine: {
    padding: '10px',
    boxSizing: 'unset'
  },
  black_on_rose: {
    backgroundColor: 'mistyrose'
  },
  white_on_black: {
    backgroundColor: 'black',
    '--correct-answer-toggle-label-color': 'white',
    '--tick-color': 'white',
    '--line-stroke': 'white',
    '--arrow-color': 'white',
    '--point-stroke': 'white',
    '--point-fill': 'black'
  },
  prompt: {
    verticalAlign: 'middle',
    marginBottom: '16px'
  }
};

export class NumberLine extends React.Component {
  static propTypes = {
    onMoveElement: PropTypes.func.isRequired,
    onDeleteElements: PropTypes.func.isRequired,
    onAddElement: PropTypes.func.isRequired,
    onUndoElement: PropTypes.func.isRequired,
    onClearElements: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    answer: PropTypes.array,
    classes: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    let initialType = props.model.graph ? props.model.graph.initialType : null;
    initialType = initialType
      ? initialType.toLowerCase()
      : PointChooser.DEFAULT_TYPE;

    this.state = {
      selectedElements: [],
      elementType: initialType,
      answers: props.answer
    };
  }

  toggleElement(index) {
    let selected = [];
    if (this.state.selectedElements.indexOf(index) === -1) {
      selected = this.state.selectedElements.concat([index]);
    } else {
      selected = this.state.selectedElements.filter(e => e !== index);
    }
    this.setState({ selectedElements: selected });
  }

  elementTypeSelected(t) {
    this.setState({ elementType: t });
  }

  addElement(x) {
    if (this.hasMaxNoOfPoints()) {
      this.setState({ showMaxPointsWarning: true });
      setTimeout(() => {
        this.setState({ showMaxPointsWarning: false });
      }, 2000);
      return;
    }

    const { ticks, domain } = this.props.model.graph;

    let elementData = buildElementModel(
      x,
      this.state.elementType,
      domain,
      ticks.minor
    );

    if (elementData) {
      const { answers } = this.state;

      const contains = answers.some((element) => {
        return JSON.stringify(element) === JSON.stringify(elementData);
      });

     if(!contains) {
       answers.push(elementData);
       this.setState({ answers });
       this.props.onAddElement(elementData);
     }
    }
  }

  hasMaxNoOfPoints() {
    let {
      answer,
      model: {
        graph: { maxNumberOfPoints }
      }
    } = this.props;

    return (
      isNumber(maxNumberOfPoints) &&
      maxNumberOfPoints > 0 &&
      (answer || []).length >= maxNumberOfPoints
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { answer } = nextProps;

    if(!isEqual(this.state.answers, answer)) {
      this.setState({showCorrectAnswer: false, answers: answer});
    }
  }

  deselectElements() {
    this.setState({ selectedElements: [] });
  }

  getSize(type, min, max, defaultValue) {
    const {
      model: { graph }
    } = this.props;

    if (graph && graph[type]) {
      return Math.max(min, Math.min(max, graph[type]));
    } else {
      return defaultValue;
    }
  }

  undo() {
    const { answers } = this.state;
    const { onUndoElement } = this.props;

    answers.pop();
    this.setState({ answers });
    onUndoElement();
  }

  clearAll() {
    const { onClearElements } = this.props;

    this.setState({ answers: [] });
    onClearElements();
  }

  render() {
    let { model, classes } = this.props;
    let { showCorrectAnswer, answers } = this.state;
    let { corrected = { correct: [], incorrect: [] }, disabled } = model;
    let addElement = this.addElement.bind(this);
    let elementsSelected =
      !disabled &&
      this.state.selectedElements &&
      this.state.selectedElements.length > 0;
    const width = this.getSize('width', 400, 1600, 600);
    const height = this.getSize('height', 300, 800, 400);

    const { ticks, domain, arrows } = model.graph;

    let graphProps = {
      disabled,
      domain,
      ticks,
      width,
      height,
      arrows
    };

    let getAnswerElements = () => {
      return (answers || []).map((e, index) => {
        let out = cloneDeep(e);
        out.selected = this.state.selectedElements.indexOf(index) !== -1;
        out.correct = corrected.correct.includes(index)
          ? true
          : corrected.incorrect.includes(index)
          ? false
          : undefined;
        return out;
      });
    };

    let getCorrectAnswerElements = () => {
      return (model.correctResponse || []).map(r => {
        r.correct = true;
        return r;
      });
    };

    let elements = showCorrectAnswer
      ? getCorrectAnswerElements()
      : getAnswerElements();

    let maxPointsMessage = () =>
      `You can only add ${model.graph.maxNumberOfPoints} element${model.graph.maxNumberOfPoints == 1 ? '' : 's'}`;


    let deleteElements = () => {
      const { selectedElements } = this.state;
      this.props.onDeleteElements(selectedElements);

      answers = answers.filter((v, index) => {
        return !selectedElements.some(d => d === index);
      });

      this.setState({ selectedElements: [], answers });
    };

    let getIcons = () => {
      if (model.graph.availableTypes) {
        return Object.keys(model.graph.availableTypes)
          .filter(k => model.graph.availableTypes[k])
          .map(k => k.toLowerCase());
      }
    };

    let onShowCorrectAnswer = show => {
      this.setState({ showCorrectAnswer: show });
    };

    let adjustedWidth = graphProps.width - 20;

    const names = classNames(classes.numberLine, classes.mainContainer, classes[model.colorContrast]);

    return (
      <div className={names} style={{ width }}>
        {model.prompt && (
          <div
            className={classes.prompt}
            dangerouslySetInnerHTML={{ __html: model.prompt }}
          />
        )}
        <div>
          <div style={{ width: adjustedWidth }}>
            <Toggle
              show={isArray(model.correctResponse) && model.correctResponse.length && !model.emptyAnswer}
              toggled={showCorrectAnswer}
              onToggle={onShowCorrectAnswer}
              initialValue={false}
            />
          </div>
          {!disabled && (
            <PointChooser
              elementType={this.state.elementType}
              showDeleteButton={elementsSelected}
              onDeleteClick={deleteElements}
              onElementType={this.elementTypeSelected.bind(this)}
              onClearElements={this.clearAll.bind(this)}
              onUndoElement={this.undo.bind(this)}
              icons={getIcons()}
            />
          )}
          <Graph
            {...graphProps}
            elements={elements}
            onAddElement={addElement}
            onMoveElement={this.props.onMoveElement}
            onToggleElement={this.toggleElement.bind(this)}
            onDeselectElements={this.deselectElements.bind(this)}
            debug={false}
          />
          {model.graph.title && (
            <div
              className={classes.graphTitle}
              dangerouslySetInnerHTML={{ __html: model.graph.title }}
            />
          )}
          {this.state.showMaxPointsWarning && (
            <Feedback
              type="info"
              width={adjustedWidth}
              message={maxPointsMessage()}
            />
          )}
          {model.feedback && !showCorrectAnswer && (
            <Feedback {...model.feedback} width={adjustedWidth} />
          )}
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(NumberLine);
