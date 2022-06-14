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

const insertCategory = (correctAnswer, data) => {

const position = data.length -1
const categoryToInsert =  data[data.length - 1]
console.log("position to inser", position)
console.log("category to insert", categoryToInsert)
console.log(correctAnswer, "correctAnswer")
 correctAnswer.splice(position, 0,categoryToInsert);

return correctAnswer
  
}

const removeCategory = (correctAnswer, data) => {

  const position = data.length -1

  console.log("position to inser", position)
 
  console.log(correctAnswer, "correctAnswer")
   correctAnswer.splice(position, 1);
  
  return correctAnswer
    
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
    console.log(this.props.model.correctAnswer.data, 'this.props.model.correctAnswer.data');
    console.log(nextData, 'nextData ');
    console.log( data, ' data');

    // check what was changed: correctAnswer or data?

    // if (!isEqual(nextData, data)) {
    //   console.log('data changed');
      if (nextData.length > data.length && nextCorrectAnswerData.length > data.length) {
        console.log("INSERT CATEGORY")
        nextCategoies= insertCategory( nextCorrectAnswerData, nextData);
      }
      
      if (nextData.length < data.length) {
        nextCategoies = removeCategory( nextCorrectAnswerData, nextData);
     }
      
     if (!isEqual(nextCorrectAnswerData, this.props.model.correctAnswer.data)){
      console.log('correctAnswer changed');
      nextCategoies =nextCorrectAnswerData;
    } else {
      console.log('what changed ??? ');
      nextCategoies = updateCorrectResponseInitialData(
        nextCorrectAnswerData,
        nextData
      );
    }
  //  if (!isEqual(nextCorrectAnswerData, this.props.model.correctAnswer.data)) {

  //   console.log('correctAnswer changed');
  //      nextCategoies =nextCorrectAnswerData;
  //  } else 

    console.log(
      isEqual(nextCorrectAnswerData, this.props.model.correctAnswer.data),
      'nextCorrectAnswerData equality'
    );


    if (!isEqual(nextCategoies, data)) {
      this.setState({ categories: nextCategoies });
    }
  }

  changeData = (data) => {
    const { model, onChange } = this.props;
   const { correctAnswer } = model || {};

console.log(correctAnswer, "correctAnswer in change data")


    onChange({
      ...model,
      correctAnswer: {
       ...correctAnswer,
        data: data,
      },
    });

    console.log(this.props.model.correctAnswer, "correctAnswer in change data after onchange")

   // this.setState({ categories: correctAnswer });
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
