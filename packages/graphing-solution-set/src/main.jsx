import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { GraphContainer } from '@pie-lib/graphing-solution-set';
import { color, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { findSectionsInSolutionSet, pointInsidePolygon, checkIfLinesAreAdded } from './utils';
import { AlertDialog } from '@pie-lib/config-ui';

const MainContainer = styled(UiLayout)(({ theme }) => ({
  color: color.text(),
  backgroundColor: color.background(),
}));

const TeacherInstructions = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Graph = styled(GraphContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    onAnswersChange: PropTypes.func,
  };

  state = {
    showingCorrect: false,
    dialog: {
      open: false,
    },
  };

  /*
   * Function to handle the AlertDialog
   * @param {boolean} open - open state of the dialog
   * @param {function} callback - callback function to be called after setting the state
   * */
  handleAlertDialog = (open, callback) =>
    this.setState(
      {
        dialog: { open },
      },
      callback,
    );

  /*
   * Function to toggle the correct answer
   * @param {boolean} showingCorrect - state of the correct answer
   * */
  toggleCorrect = (showingCorrect) => this.setState({ showingCorrect });

  /*
   * Reset the graph to original state
   * */
  onResetClick = () => {
    const { model, session, setGssData } = this.props;
    let { gssData } = model;
    this.setState({
      dialog: {
        open: true,
        title: 'Warning',
        text: `This will remove all the elements added on the graph and reset graph to original state. Are you sure you want to continue?`,
        onConfirm: () => {
          // Reset the graph to original state
          session.answer = [];
          gssData.selectedTool = 'lineA';
          gssData.lineA.lineType = 'Solid';
          if (gssData.lineB) gssData.lineB.lineType = 'Solid';
          // Set the gssData and session
          setGssData(gssData, session);
          this.handleAlertDialog(false);
        },
        onClose: () => this.handleAlertDialog(false),
      },
    });
  };

  /*
   * Function to handle the event of solution set selected
   * @param {object} point - point selected on the graph
   * */
  onSolutionSetSelected = (point) => {
    const { model, session, setGssData } = this.props;
    const { gssData, disabled } = model;
    if (disabled) {
      return;
    }
    for (const section of gssData.sections) {
      if (pointInsidePolygon(point, section)) {
        let polygon = {
          points: section,
          building: false,
          type: 'polygon',
          closed: true,
          isSolution: true,
        };
        session.answer = session.answer.filter((mark) => mark.type !== 'polygon');
        session.answer.push(polygon);
        break;
      }
    }
    setGssData(gssData, session);
  };

  /*
   * Function to handle the event of change in GSS Line Data
   * @param {object} gssData - GSS Line Data
   * @param {string} oldSelectedTool - old selected tool
   * */
  onChangeGssLineData = (gssData, oldSelectedTool) => {
    const { model, session } = this.props;
    const { domain, range, disabled } = model;
    if (disabled) {
      return;
    }
    if (gssData.selectedTool === 'solutionSet') {
      let lines = session.answer.filter((mark) => mark.type !== 'polygon');
      if (!checkIfLinesAreAdded(gssData, lines)) {
        gssData.selectedTool = oldSelectedTool;
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Please define the line(s) and then select a solution set for the item.`,
            onConfirm: () => this.handleAlertDialog(false),
          },
        });
      } else {
        let lines = session.answer.filter((mark) => mark.type !== 'polygon');
        gssData = findSectionsInSolutionSet(gssData, lines, domain, range);
      }
      this.handleGssDataChange(gssData, session);
    } else {
      let polygons = session.answer.filter((mark) => mark.type === 'polygon');
      if (oldSelectedTool === 'solutionSet' && polygons.length > 0) {
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Changing a line after adding a solution set will clear your selected solution set. Click 'Clear Solution Set' to change the line. Otherwise, click 'Cancel'.`,
            onConfirm: () => {
              session.answer = session.answer.filter((mark) => mark.type !== 'polygon');
              this.handleGssDataChange(gssData, session);
              this.handleAlertDialog(false);
            },
            onConfirmText: 'CLEAR SOLUTION SET',
            onClose: () => {
              gssData.selectedTool = oldSelectedTool;
              this.handleGssDataChange(gssData, session);
              this.handleAlertDialog(false);
            },
          },
        });
      } else {
        this.handleGssDataChange(gssData, session);
      }
    }
  };

  /*
   * Function to handle the event of change in GSS Data
   * @param {object} gssData - GSS Data
   * @param {object} session - session data
   * */
  handleGssDataChange = (gssData, session) => {
    const { setGssData } = this.props;
    if (session.answer && session.answer.length > 0 && session.answer[0] && gssData.lineA) {
      session.answer[0].fill = gssData.lineA.lineType;
    }
    if (session.answer && session.answer.length > 1 && session.answer[1] && gssData.lineB) {
      session.answer[1].fill = gssData.lineB.lineType;
    }
    if (
      (gssData.selectedTool === 'lineB' && session.answer.length === 0) ||
      (gssData.selectedTool === 'lineB' && session.answer[0].building)
    ) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `Please add Line A to the graph before adding Line B`,
          onConfirm: () => this.handleAlertDialog(false),
        },
      });
      gssData.selectedTool = 'lineA';
    }
    if (gssData.selectedTool === 'lineA' && session.answer.length > 1 && session.answer[1].building) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `Please add Line B to the graph before switching to Line A`,
          onConfirm: () => this.handleAlertDialog(false),
        },
      });
      gssData.selectedTool = 'lineB';
    }
    setGssData(gssData, session);
  };

  /*
   * Render the component
   * */
  render() {
    const { model, onAnswersChange, session } = this.props;
    const { showingCorrect, dialog } = this.state;
    const { answer } = session || {};
    const {
      answersCorrected,
      arrows,
      coordinatesOnHover,
      correctResponse,
      defaultTool,
      disabled,
      domain,
      extraCSSRules,
      labels,
      labelsEnabled,
      prompt,
      range,
      rationale,
      size,
      showToggle,
      title,
      titleEnabled,
      teacherInstructions,
      language,
      gssLineData,
      gssData,
    } = model || {};
    const marks = answersCorrected || answer || [];
    const showRationale = model.rationale && (hasText(model.rationale) || hasMedia(model.rationale));
    const showTeacherInstructions =
      model.teacherInstructions && (hasText(model.teacherInstructions) || hasMedia(model.teacherInstructions));
    return (
      <MainContainer extraCSSRules={extraCSSRules}>
        {showTeacherInstructions && (
          <TeacherInstructions
            labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </TeacherInstructions>
        )}
        {prompt && <PreviewPrompt className="prompt" prompt={prompt} />}
        <CorrectAnswerToggle
          show={showToggle}
          toggled={showingCorrect}
          onToggle={this.toggleCorrect}
          language={language}
        />
        {showingCorrect && showToggle ? (
          <Graph
            axesSettings={{ includeArrows: arrows }}
            coordinatesOnHover={coordinatesOnHover}
            disabled={true}
            disabledLabels={true}
            disabledTitle={true}
            domain={domain}
            labels={labels}
            marks={correctResponse.map((i) => ({ ...i, correctness: 'correct' }))}
            onChangeMarks={onAnswersChange}
            range={range}
            showLabels={labelsEnabled}
            showTitle={titleEnabled}
            size={size}
            title={title}
            language={language}
            gssLineData={gssLineData}
            onChangeGssLineData={this.onChangeGssLineData}
            onSolutionSetSelected={this.onSolutionSetSelected}
            toolbarTools={['line', 'polygon']}
          />
        ) : (
          <Graph
            axesSettings={{ includeArrows: arrows }}
            coordinatesOnHover={coordinatesOnHover}
            defaultTool={defaultTool}
            disabled={disabled}
            disabledLabels={true}
            disabledTitle={true}
            domain={domain}
            labels={labels}
            marks={marks}
            onChangeMarks={onAnswersChange}
            onCustomReset={this.onResetClick}
            range={range}
            showLabels={labelsEnabled}
            showTitle={titleEnabled}
            size={size}
            title={title}
            language={language}
            gssLineData={gssData}
            onChangeGssLineData={this.onChangeGssLineData}
            onSolutionSetSelected={this.onSolutionSetSelected}
            toolbarTools={['line', 'polygon']}
          />
        )}
        {showRationale && (
          <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>
            <PreviewPrompt prompt={rationale} />
          </Collapsible>
        )}
        <AlertDialog
          open={dialog.open}
          title={dialog.title}
          text={dialog.text}
          onClose={dialog.onClose}
          onConfirm={dialog.onConfirm}
          onConfirmText={dialog.onConfirmText ? dialog.onConfirmText : 'OK'}
        />
      </MainContainer>
    );
  }
}

export default Main;
