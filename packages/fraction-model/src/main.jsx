import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import AnswerFraction from './answer-fraction';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import FractionModelChart from './fraction-model-chart';
import { AlertDialog } from '@pie-lib/config-ui';
import { PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
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
      (answers.noOfModel = ''), (answers.partsPerModel = '');
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

  /*
   * Method to generate random key
   * */
  generateRandomKey = () => {
    return Math.floor(Math.random() * 10000);
  };

  render() {
    const { model, classes } = this.props;
    const { showCorrect, session, answerChangeDialog } = this.state;
    const { prompt, title, correctness = {}, extraCSSRules, language } = model;
    const showCorrectAnswerToggle = correctness.correctness && correctness.correctness !== 'correct';
    const fractionModelChartKey = this.generateRandomKey();

    return (
      <UiLayout extraCSSRules={extraCSSRules}>
        <div className={classes.modelPreview}>
          <div className={classes.titleContainer}>
            <PreviewPrompt className="prompt" prompt={title} tagName="h3" />
          </div>
          <PreviewPrompt className="prompt" prompt={prompt} tagName="p" />

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
            key={fractionModelChartKey}
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
              this.setState(
                () => ({
                  session: newSession,
                  answerChangeDialog: { open: false },
                }),
                this.callOnSessionChange,
              );
            }}
            onClose={() => {
              this.setState(
                (prevState) => ({
                  session: prevState.answerChangeDialog.oldSession,
                  answerChangeDialog: { open: false },
                }),
                this.callOnSessionChange,
              );
            }}
            onConfirmText={'OK'}
            onCloseText={'Cancel'}
          />
        </div>
      </UiLayout>
    );
  }
}

const styles = () => ({
  previewHeading: {
    fontWeight: '400',
    fontSize: '24px',
    margin: '14px 0',
  },
  modelPreview: {
    padding: '16px',
  },
  titleContainer: {
    textAlign: 'center',
    fontSize: '20px',
  },
});

export default withStyles(styles)(Main);
