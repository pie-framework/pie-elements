import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { Chart } from '@pie-lib/charting';


import { set } from 'lodash';
import CheckBox from '@material-ui/core/es/internal/svg-icons/CheckBox';

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
    onChange: PropTypes.func.isRequired
  };

  changeData = (mark, data) => {
    const { answers } = this.props.model || {};

    answers[mark].data = data;
    this.props.onChange({
      ...this.props.model,
      answers
    });
  };

  changeEditable = (mark, value) => {
    const { answers } = this.props.model || {};

    answers[mark].editCategoryEnabled = value;
    this.props.onChange({
      ...this.props.model,
      answers
    });
  };

  changeAddRemoveEnabled = (mark, value) => {
    const { answers } = this.props.model || {};

    answers[mark].addCategoryEnabled = value;
    this.props.onChange({
      ...this.props.model,
      answers
    });
  };


  render() {
    const { classes, model, onChange, charts } = this.props;

    return (
      <div>
        Define Correct Response
        <div className={classes.container}>
          {Object.keys(model.answers).map(mark => (
            <div key={`correct-response-graph-${model.answers[mark].name}`}>
              <p>{model.answers[mark].name}</p>
              <Chart
                chartType={model.chartType}
                size={model.graph}
                domain={model.domain}
                range={model.range}
                charts={charts}
                data={model.answers[mark].data}
                title={model.title}
                onDataChange={(data) => this.changeData(mark, data)}
                editCategoryEnabled={model.answers[mark].editCategoryEnabled}
                addCategoryEnabled={model.answers[mark].addCategoryEnabled}
                categoryDefaultLabel={model.categoryDefaultLabel}
              />
              <div>
                <Checkbox
                  checked={model.answers[mark].editCategoryEnabled}
                  onChange={(e) => {
                    this.changeEditable(mark, e.target.checked)
                  }}
                />
                Student can edit category labels
              </div>
              <div>
                <Checkbox
                  checked={model.answers[mark].addCategoryEnabled}
                  onChange={(e) => {
                    this.changeAddRemoveEnabled(mark, e.target.checked)
                  }}
                />
                Student can add/remove category labels
              </div>
            </div>
          ))}

          <div
            className={classes.button}
            onClick={() => {
              set(
                model,
                `answers.${`alternate${Object.keys(model.answers).length}`}`,
                {
                  name: `Alternate ${Object.keys(model.answers).length}`,
                  data: [],
                  editCategoryEnabled: true,
                  addCategoryEnabled: true
                }
              );
              onChange(model);
            }}
          >
            ADD ALTERNATE
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CorrectResponse);
