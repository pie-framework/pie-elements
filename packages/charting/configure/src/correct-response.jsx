import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart } from '@pie-lib/charting';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 2.5,
    display: 'flex',
    flex: 1,
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    cursor: 'pointer',
    background: theme.palette.grey[200],
    padding: theme.spacing.unit * 2,
    width: 'fit-content',
    borderRadius: '4px',
  },
  column: {
    flex: 1,
  },
  chartError: {
    border: `2px solid ${theme.palette.error.main}`,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
});

const addCategoryProps = (correctAnswer, data) =>
  correctAnswer.map((correct, index) => ({
    ...correct,
    editable: index < data.length ? data[index].editable : true,
    interactive: index < data.length ? data[index].interactive : true,
    deletable: index >= data.length ? true : false,
  }));

const updateCorrectResponseData = (correctAnswer, data) => {
  if (!correctAnswer) {
    return data;
  }

  const correctAnswerData = [...correctAnswer];
  let correctResponseDefinition = [];

  (data || []).forEach((category, currentIndex) => {
    const editable = category.editable;
    const interactive = category.interactive;
    const label = editable && correctAnswer[currentIndex]?.label ? correctAnswer[currentIndex].label : category.label;
    const value =
      (interactive && correctAnswer[currentIndex]?.value) || (interactive && correctAnswer[currentIndex]?.value == 0)
        ? correctAnswer[currentIndex].value
        : category.value;

    correctResponseDefinition[currentIndex] = {
      label: label,
      value: value,
      editable: category.editable,
      interactive: category.interactive,
    };
  });

  if (correctResponseDefinition.length < correctAnswer.length) {
    const missingCategories = (correctAnswerData || []).slice(correctResponseDefinition.length, correctAnswer.length);

    return addCategoryProps((correctResponseDefinition || []).concat(missingCategories), data);
  }

  return correctResponseDefinition;
};

const insertCategory = (correctAnswer, data) => {
  const positionToInsert = data.length - 1;
  // eslint-disable-next-line no-unused-vars
  const { editable, interactive, deletable, ...categoryToInsert } = data[data.length - 1];

  (correctAnswer || []).splice(positionToInsert, 0, categoryToInsert);
  const correctAnswerData = [...correctAnswer];

  return addCategoryProps(correctAnswerData, data);
};

const removeCategory = (correctAnswer, data, positionToRemove) => {
  (correctAnswer || []).splice(positionToRemove, 1);
  const correctAnswerData = [...correctAnswer];

  return addCategoryProps(correctAnswerData, data);
};

export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    correctAnswerErrors: PropTypes.object,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    charts: PropTypes.array,
    error: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  changeData = (data) => {
    const { model, onChange } = this.props;
    const { correctAnswer } = model || {};

    onChange({
      ...model,
      correctAnswer: {
        ...correctAnswer,
        // eslint-disable-next-line no-unused-vars
        data: data.map(({ interactive, editable, index, ...keepAttrs }) => keepAttrs),
      },
    });
  };

  getUpdatedCategories(nextProps, prevProps = this.props, prevState = this.state) {
    const nextData = nextProps.model.data || [];
    const data = prevProps.model.data || [];
    const nextCorrectAnswerData = nextProps.model.correctAnswer.data || [];
    const categories = prevState ? prevState.categories : [];

    let nextCategories = [];
    if (nextData.length > data.length) {
      nextCategories = insertCategory(nextCorrectAnswerData, nextData);
    }

    if (nextData.length < data.length) {
      let removedIndex = nextData.length;

      // we need to remove the category from the correct answer data and categories, from the same index it was removed from the data
      // index is a property of the nextData category
      for (let index = 0; index < nextData.length; index++) {
        if (nextData[index].index !== index) {
          removedIndex = index;
          break;
        }
      }

      (this.props.model.correctAnswer.data || []).splice(removedIndex, 1);
      nextCategories = removeCategory(categories, nextData, removedIndex);
    }

    if (!isEqual(nextCorrectAnswerData, this.props.model.correctAnswer.data)) {
      nextCategories = nextCorrectAnswerData.map((correct, index) => ({
        ...correct,
        editable: index < data.length ? data[index].editable : true,
        interactive: index < data.length ? data[index].interactive : true,
      }));
    } else if (isEmpty(nextCategories)) {
      nextCategories = updateCorrectResponseData(nextCorrectAnswerData, nextData);

      nextCorrectAnswerData.map((answer, currentIndex) => {
        const dataExists = currentIndex < nextData.length;
        let label;
        let value;

        if (dataExists) {
          label = nextData[currentIndex].editable ? answer.label : nextData[currentIndex].label;
          value = nextData[currentIndex].interactive ? answer.value : nextData[currentIndex].value;
        } else {
          label = answer.label;
          value = answer.value;
        }

        nextCorrectAnswerData[currentIndex] = {
          label: label,
          value: value,
        };
      });
    }

    if (
      !isEqual(nextCategories, data) ||
      !isEqual(nextCorrectAnswerData, prevProps.model.correctAnswer.data) ||
      !isEqual(nextCategories, categories) ||
      (isEmpty(nextCategories) && isEmpty(data))
    ) {
      return nextCategories;
    }
    return null;
  }

  componentDidMount() {
    const initialCategories = this.getUpdatedCategories(this.props, this.props, null);
    this.setState({
      categories:
        initialCategories || updateCorrectResponseData(this.props.model.correctAnswer.data, this.props.model.data),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const nextCategories = this.getUpdatedCategories(this.props, prevProps, prevState);
    if (nextCategories && !isEqual(nextCategories, prevState.categories)) {
      this.setState({ categories: nextCategories });
    }
  }

  render() {
    const { classes, model, charts, error, correctAnswerErrors } = this.props;
    const { categories } = this.state;
    const { domain = {}, range = {} } = model || {};
    const { identicalError, categoriesError } = correctAnswerErrors || {};

    return (
      <div>
        <div className={classes.title}>Define Correct Response</div>
        <div className={classes.container}>
          <div className={classes.column} key="graph">
            <Typography component="div" type="body1">
              <span>Use the tools below to define the correct answer.</span>
            </Typography>

            <div
              key={`correct-response-graph-${model.correctAnswer.name}`}
              className={identicalError || categoriesError ? classes.chartError : ''}
            >
              <Chart
                chartType={model.chartType}
                size={model.graph}
                domain={domain}
                range={range}
                charts={charts}
                data={categories}
                title={model.title}
                onDataChange={(data) => this.changeData(data)}
                addCategoryEnabled={model.addCategoryEnabled}
                categoryDefaultLabel={model.categoryDefaultLabel}
                error={error}
              />
            </div>

            {(identicalError || categoriesError) && (
              <Typography component="div" type="body1" className={classes.errorText}>
                <span>{identicalError || categoriesError}</span>
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CorrectResponse);
