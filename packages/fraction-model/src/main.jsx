import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AnswerFraction from './answer-fraction';

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onSessionChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      session: {
        ...props.session,
        answers: (props.session && props.session.answers) || this.generateAnswers(props.model),
      },
      showCorrect: false,
    };
    this.callOnSessionChange();
  };

  /**
   * Function to trigger when session value change for fraction model
   */
  callOnSessionChange = () => {
    const { onSessionChange } = this.props;

    if (onSessionChange) {
      onSessionChange(this.state.session);
    }
  };

  /**
   * Function to generate answers for preview selection
   * @param {object} model contains model object for fraction model
   * @returns answer model
   */
  generateAnswers = (model) => {
    const answers = {
      selection: [],
    };
    if(model.allowedStudentConfig) {
      answers.noOfModel = 0,
      answers.partsPerModel = 0
    }
    return answers;
  };

  /**
   * Function to trigger when answer change from preview
   * @param {object} newAnswers contains updated answer model
   */
  onAnswerChange = (newAnswers) => {
    this.setState(
      (state) => ({
        session: {
          ...state.session,
          answers: newAnswers,
        },
      }),
      this.callOnSessionChange,
    );
  };

  render() {
    const { model, classes } = this.props;
    const { showCorrect, session } = this.state;
    const { correctness = {}, language } = model;
    return (
      <div>
        <h2 className={classes.previewHeading}>Student Preview</h2>
        <div className={classes.modelPreview}>
          <h3 className={classes.titleContainer} 
            dangerouslySetInnerHTML={{ __html: model.title }}>
          </h3>
          <p dangerouslySetInnerHTML={{ __html: model.question }}></p>

          <AnswerFraction
            model={model}
            showCorrect={showCorrect}
            correctAnswers={model.correctResponse}
            view={model.view}
            onAnswerChange={this.onAnswerChange}
            answers={showCorrect ? model.correctResponse || {} : session.answers}
          />
        </div>
      </div>
    );
  }
}

const styles = () => ({
  previewHeading: {
    fontWeight: '400',
    fontSize: '1.5rem',
    margin: '0.875rem 0',
  },
  modelPreview: {
    border: '1px dashed #D3D3D3',
    padding: '1rem',
  },
  titleContainer: {
    textAlign: 'center',
    fontSize: '1.25rem',
  },
})

export default withStyles(styles)(Main);
