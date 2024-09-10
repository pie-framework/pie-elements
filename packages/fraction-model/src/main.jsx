import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AnswerFraction from './answer-fraction';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import FractionModelChart from './fraction-model-chart';
import { AlertDialog } from '@pie-lib/pie-toolbox/config-ui';
import cloneDeep from 'lodash/cloneDeep';

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onSessionChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      session: {
        ...props.session,
        answers: (props.session && props.session.answers) || this.generateAnswers(props.model),
      },
      showCorrect: false,
      answerChangeDialog: {
        open: false,
        text: '',
      },
      fractionModelKey: 0,
    };
    this.callOnSessionChange();
  }

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
      response: [],
    };
    if (model.allowedStudentConfig) {
      (answers.noOfModel = 0), (answers.partsPerModel = 0);
    }
    return answers;
  };

  /**
   * Function to trigger when answer change from preview
   * @param {object} newAnswers contains updated answer model
   */
  onAnswerChange = (newAnswers) => {
    let oldSession = cloneDeep(this.state.session);
    let newSession = {
      ...this.state.session,
      answers: newAnswers,
    };
    if (newAnswers.response.length > 0) {
      this.setState({
        answerChangeDialog: {
          open: true,
          oldSession: oldSession,
          newSession: newSession,
          text: 'Changing either the Number of Models or Parts per Model will remove added answer. Are you sure you want to continue?',
        },
      });
    } else {
      this.setState(
        (state) => ({
          session: newSession,
        }),
        this.callOnSessionChange,
      );
    }
  };

  /*
   * Function to toggle correct answer
   * @param {boolean} show contains boolean value to show correct answer
   * */
  toggleShowCorrect = (show) => {
    this.setState({ showCorrect: show });
    this.setState({ fractionModelKey: this.state.fractionModelKey + 1 });
  };

  /*
   * Function to trigger when response change from preview
   * @param {object} response contains updated response model
   * */
  onResponseChange = (response) => {
    this.setState(
      (state) => ({
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            response,
          },
        },
      }),
      this.callOnSessionChange,
    );
  };

  render() {
    const { model, classes } = this.props;
    const { showCorrect, session, answerChangeDialog } = this.state;
    const { correctness = {}, language } = model;
    const showCorrectAnswerToggle = correctness.correctness && correctness.correctness !== 'correct';

    return (
      <div>
        <div className={classes.modelPreview}>
          <h3 className={classes.titleContainer} dangerouslySetInnerHTML={{ __html: model.title }}></h3>
          <p dangerouslySetInnerHTML={{ __html: model.question }}></p>

          <CorrectAnswerToggle
            language={language}
            show={showCorrectAnswerToggle}
            toggled={showCorrect}
            onToggle={this.toggleShowCorrect}
          />

          <AnswerFraction
            model={model}
            showCorrect={showCorrect}
            disabled={model.view}
            onAnswerChange={this.onAnswerChange}
            answers={session.answers}
          />

          <FractionModelChart
            key={this.state.fractionModelKey}
            disabled={model.view}
            value={showCorrect ? model.correctResponse : session.answers.response}
            modelType={model.modelTypeSelected}
            noOfModels={
              showCorrect
                ? model.maxModelSelected
                : model.allowedStudentConfig
                ? session.answers.noOfModel
                : model.maxModelSelected
            }
            partsPerModel={
              showCorrect
                ? model.partsPerModel
                : model.allowedStudentConfig
                ? session.answers.partsPerModel
                : model.partsPerModel
            }
            showLabel={model.showGraphLabels}
            onChange={this.onResponseChange}
          ></FractionModelChart>

          <AlertDialog
            open={answerChangeDialog.open}
            title="Warning"
            text={answerChangeDialog.text}
            onConfirm={() => {
              let newSession = this.state.answerChangeDialog.newSession;
              newSession.answers.response = [];
              this.setState({ fractionModelKey: this.state.fractionModelKey + 1 });
              this.setState(
                (state) => ({
                  session: newSession,
                }),
                this.callOnSessionChange,
              );
              this.setState({ answerChangeDialog: { open: false } });
            }}
            onClose={() => {
              this.setState(
                (state) => ({
                  session: this.state.answerChangeDialog.oldSession,
                }),
                this.callOnSessionChange,
              );
              this.setState({ answerChangeDialog: { open: false } });
            }}
            onConfirmText={'OK'}
            onCloseText={'Cancel'}
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
    padding: '1rem',
  },
  titleContainer: {
    textAlign: 'center',
    fontSize: '1.25rem',
  },
});

export default withStyles(styles)(Main);
