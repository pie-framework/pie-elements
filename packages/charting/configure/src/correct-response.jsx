import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/charting';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

const styles = (theme) => ({
  container: {
    border: '2px solid #ababab',
    borderRadius: '4px',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
    background: '#fafafa',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    cursor: 'pointer',
    background: '#eee',
    padding: theme.spacing.unit * 2,
    width: 'fit-content',
    borderRadius: '4px',
  },
});

const addCategoryProps = (correctAnswer, data) => correctAnswer.map((correct, index) => ({...correct, editable: index<data.length  ? data[index].editable: true, interactive: index<data.length ?  data[index].interactive :true}));;

const updateCorrectResponseData = (correctAnswer, data) => {
  if (!correctAnswer) {
    return data;
  }

  const correctAnswerData = [...correctAnswer];

  let correctResponseDefinition = [];

  data.forEach((category, currentIndex) => {
    const editable = category.editable;
    const interactive = category.interactive;

    const label = (editable && correctAnswer[currentIndex]?.label)
      ? correctAnswer[currentIndex].label
      : category.label

    const value = (interactive && correctAnswer[currentIndex]?.value)
      ? correctAnswer[currentIndex].value
      : category.value

    correctResponseDefinition[currentIndex] = {
      label: label,
      value: value,
      editable: category.editable,
      interactive: category.interactive,
    };
  });

  if (correctResponseDefinition.length < correctAnswer.length) {
    const missingCategories = correctAnswerData.slice(correctResponseDefinition.length, correctAnswer.length)

    return addCategoryProps(correctResponseDefinition.concat(missingCategories), data);
  }

  return correctResponseDefinition;
};

const insertCategory = (correctAnswer, data) => {
  const positionToInsert = data.length - 1;
  const {editable, interactive, deletable, ... categoryToInsert} = data[data.length - 1];

  correctAnswer.splice(positionToInsert, 0, categoryToInsert);
  const correctAnswerData = [...correctAnswer];

  return addCategoryProps(correctAnswerData, data);
}

const removeCategory = (correctAnswer, data) => {
  const positionToRemove = data.length - 1

  correctAnswer.splice(positionToRemove, 1);

  const correctAnswerData = [...correctAnswer];

  return addCategoryProps(correctAnswerData, data);
}
export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    charts: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      categories: updateCorrectResponseData(
        props.model.correctAnswer.data,
        props.model.data
      )
    };
  }

  changeData = (data) => {
    const { model, onChange } = this.props;
    const { correctAnswer } = model || {};

    onChange({
      ...model,
      correctAnswer: {
        ...correctAnswer,
        data: data.map(({interactive, editable,  ...keepAttrs}) => keepAttrs),
      },
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      model: {
        data: nextData = [],
        correctAnswer: { data: nextCorrectAnswerData = [] },
      } = {},
    } = nextProps;
    
    const {
      model: {
        data = [],
      } = {},
    } = this.props;

    let nextCategories = [];

    if (nextData.length > data.length && nextCorrectAnswerData.length > data.length) {
      nextCategories= insertCategory( nextCorrectAnswerData, nextData);
    }

    if (nextData.length < data.length) {
      nextCategories = removeCategory( nextCorrectAnswerData, nextData);
   }

   if (!isEqual(nextCorrectAnswerData, this.props.model.correctAnswer.data)){
    nextCategories = nextCorrectAnswerData.map((correct, index) => ({...correct, editable: index<data.length? data[index].editable: true, interactive: index<data.length?  data[index].interactive :true}));
  } else if (isEmpty(nextCategories)) {
    nextCategories = updateCorrectResponseData(
      nextCorrectAnswerData,
      nextData
    );
  }

    if (!isEqual(nextCategories, data)) {
      this.setState({ categories: nextCategories });
    }
  }



  render() {
    const {  model, charts } = this.props;
    const { categories } = this.state;

    return (
      <div>
        Define Correct Response
        <div key={`correct-response-graph-${model.correctAnswer.name}`}>
          <p>{model.correctAnswer.name}</p>
          <Chart
            chartType={model.chartType}
            size={model.graph}
            domain={model.domain}
            range={model.range}
            charts={charts}
            data={categories}
            title={model.title}
            onDataChange={(data) => this.changeData(data)}
            addCategoryEnabled={model.addCategoryEnabled}
            categoryDefaultLabel={model.categoryDefaultLabel}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CorrectResponse);
