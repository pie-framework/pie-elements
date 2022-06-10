import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/charting';

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

export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    charts: PropTypes.array
  };

  changeData = data => {
    const { model, onChange } = this.props;
    const { correctAnswer } = model || {};

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
              data={model.correctAnswer.data || []}
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
