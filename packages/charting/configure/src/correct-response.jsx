import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/charting';
import isEqual from 'lodash/isEqual';

const styles = theme => ({
  container: {
    border: '2px solid #ababab',
    borderRadius: '4px',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
    background: '#fafafa'
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    cursor: 'pointer',
    background: '#eee',
    padding: theme.spacing.unit * 2,
    width: 'fit-content',
    borderRadius: '4px'
  }
});

const setCorrectResponseInitialData = (correctAnswer, data) => {
  if (!correctAnswer) {
    return data
  }
  console.log("data in set  state", data )

  let correctResponseDefinition = [];
//label: model.correctAnswer.data[i].label, value: model.correctAnswer.data[i].value
//   correctAnswer.forEach((correct, i) => { 
//     correctResponseDefinition[i] = {...correct, editable: data[i].editable , interactive: data[i].interactive } ;
// })

data.forEach((category, i) => { 
  console.log("correctAnswer[i]?.value", correctAnswer[i]?.value)
  console.log("category.value", category.value)
  correctResponseDefinition[i] = {label: correctAnswer[i]?.label || category.label, value:correctAnswer[i]?.value || category.value,  editable: category.editable , interactive: category.interactive } ;
})

return correctResponseDefinition
}

export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    charts: PropTypes.array
  };

  constructor(props) {
    super(props);
    console.log(props, "props in correct response")
    this.state = {
      categories: setCorrectResponseInitialData(props.model.correctAnswer.data, props.model.data),
    };
  
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model: { data: nextData = [] } = {} } = nextProps;
    const { model: { data = [] } = {} } = this.props;

    const nextCategoies = setCorrectResponseInitialData(nextProps.model.correctAnswer.data, nextData);
    console.log("nextCategoies", nextCategoies)

    console.log(nextProps, "next props in correct response")
    console.log(nextData, "next data in correct response")

    if (!isEqual(nextCategoies, data)) {
      this.setState({ categories:  nextCategoies});
    }
  }

  changeData = data => {
    const { model, onChange } = this.props;
    const { correctAnswer } = model || {};
    const {categories} = this.state;

    onChange({
      ...model,
      correctAnswer: {
        ...correctAnswer,
        data
      }
    });
  };

  render() {
    const { classes, model, charts } = this.props;
    const {categories} = this.state;

    console.log(categories, "categories in correct response")

  

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
