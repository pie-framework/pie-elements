import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/charting';
import isEqual from 'lodash/isEqual';

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

const updateCorrectResponseInitialData = (correctAnswer, data) => {
  if (!correctAnswer) {
    return data;
  }

  console.log(correctAnswer, "correct Answer ------------------")

  let correctResponseDefinition = [];

  data.forEach((category, currentIndex) => {
    const editable = category.editable;
    const interactive = category.interactive;

    const label =  (editable && correctAnswer[currentIndex]?.label)
    ? correctAnswer[currentIndex].label
    : category.label

    const value =  (interactive && correctAnswer[currentIndex]?.value)
    ? correctAnswer[currentIndex].value
    : category.value

    console.log(interactive && correctAnswer[currentIndex], interactive, correctAnswer[currentIndex]?.label, "interactive && correctAnswer[currentIndex]?.value")
    correctResponseDefinition[currentIndex] = {
      label:label,
      value:value,
      editable: category.editable,
      interactive: category.interactive,
    };
  });

  if (correctResponseDefinition.length < correctAnswer.length) {
    const missingCategories = correctAnswer.slice(correctResponseDefinition.length, correctAnswer.length)

    console.log('missingCategories', missingCategories)

    return correctResponseDefinition.concat(missingCategories);
  }

  return correctResponseDefinition;
};

export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    charts: PropTypes.array,
  };

  constructor(props) {
    super(props);
    console.log(props, 'props in correct response');
    this.state = {
      categories: updateCorrectResponseInitialData(
        props.model.correctAnswer.data,
        props.model.data
      )
    };
  }

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
        correctAnswer: {
          data: [],
        },
      } = {},
    } = this.props;

    let nextCategoies = [];

    console.log(nextCorrectAnswerData, 'nextCorrectAnswerData');
    console.log(this.props, "this props")
    console.log(nextProps, "next props")
    // check what was changed: correctAnswer or data?

  //  if (!isEqual(nextCorrectAnswerData, this.props.model.correctAnswer.data)) {
      //  nextCategoies = setCorrectResponseInitialData(nextData, nextProps.model.correctAnswer.data);
  //  } else if (!isEqual(nextData, data)) {
      nextCategoies = updateCorrectResponseInitialData(
        this.props.model.correctAnswer.data,
        nextData
      );
 //   }

    console.log(
      isEqual(nextCorrectAnswerData, this.props.model.correctAnswer.data),
      'nextCorrectAnswerData equality'
    );
    console.log(isEqual(nextData, data), 'nextData equality');

    console.log('nextCategoies', nextCategoies);

    console.log(nextProps, 'next props in correct response');
    console.log(nextData, 'next data in correct response');

    if (!isEqual(nextCategoies, data)) {
     // this.setState({ categories: nextCategoies });
      this.setState({ categories: nextCategoies });
     
    }
  }

  changeData = (data) => {
    const { model, onChange } = this.props;
   const { correctAnswer } = model || {};
   const {categories} = this.state;
   // const { correctAnswer } = this.state;
console.log(correctAnswer, "correctAnswer in change data")
console.log(categories, "categories in on change data")
    onChange({
      ...model,
      correctAnswer: {
        data
      },
    });
  };

  render() {
    const { classes, model, charts } = this.props;
    const { categories } = this.state;

   // console.log(categories, 'categories in correct response');

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
