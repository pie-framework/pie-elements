import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph } from '@pie-lib/graphing-solution-set';
import { AlertDialog } from '@pie-lib/config-ui';
import { set } from 'lodash';
import { RadioGroup, Typography } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { findSectionsInSolutionSet, pointInsidePolygon, checkIfLinesAreAdded } from './utils';

const styles = (theme) => ({
  column: {
    flex: 1,
  },
  graphingTools: {
    color: theme.palette.grey['A200'],
  },
  availableTool: {
    cursor: 'pointer',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    border: `2px solid ${theme.palette.common.white}`,
    textTransform: 'capitalize',
    '&:hover': {
      color: theme.palette.grey[800],
    },
  },
  selectedTool: {
    background: theme.palette.grey['A100'],
    border: `2px solid ${theme.palette.grey['A200']}`,
  },
  container: {
    border: `2px solid ${theme.palette.grey['A200']}`,
    borderRadius: '4px',
    padding: `0 ${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px`,
    background: theme.palette.grey[50],
  },
  button: {
    margin: `${theme.spacing.unit * 2.5}px 0`,
    cursor: 'pointer',
    background: theme.palette.grey[200],
    padding: theme.spacing.unit * 1.5,
    width: 'fit-content',
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.grey['A100'],
    },
  },
  responseTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2.5,
  },
  iconButton: {
    marginLeft: '6px',
    color: theme.palette.grey[600],
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.common.black,
    },
  },
  name: {
    marginBottom: theme.spacing.unit / 2,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  subtitleText: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit,
  },
  toolsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultTool: {
    display: 'flex',
    alignItems: 'center',
    width: '300px',
  },
  defaultToolSelect: {
    marginLeft: theme.spacing.unit,
    textTransform: 'uppercase',
    color: theme.palette.grey[800],
  },
  menuItem: {
    textTransform: 'uppercase',
  },
  noDefaultTool: {
    padding: theme.spacing.unit / 2,
  },
  error: {
    color: theme.palette.error.main,
  },
  errorMessage: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    marginTop: theme.spacing.unit,
  },
  graphError: {
    border: `2px solid ${theme.palette.error.main}`,
  },
  radioButtonClass: {
    height: '20px',
    width: 'fit-content',
    padding: '.5rem 0',
  },
  radioButton: {
    color: '#000000 !important',
  },
});

export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    dialog: {
      open: false,
    },
  };

  /*
   * Function to handle the alert dialog open and close
   * @param {boolean} open - open or close the dialog
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
   * Function to change the marks on the graph
   * @param {array} marks - marks to be added on the graph
   * */
  changeMarks = (marks) => {
    const { model, onChange } = this.props;
    const { gssLineData } = model;
    if (gssLineData.selectedTool === 'lineA' && marks.length > 0) {
      marks[0].fill = gssLineData['lineA'].lineType;
    }
    if (gssLineData.selectedTool === 'lineB' && marks.length > 1) {
      marks[1].fill = gssLineData['lineB'].lineType;
    }
    if (marks.length === 0) {
      gssLineData.selectedTool = 'lineA';
      set(model, `gssLineData`, gssLineData);
    }
    set(model, `answers.correctAnswer.marks`, marks);
    onChange(model);
  };

  /*
   * Reset the graph to original state and remove all the elements added on the graph
   * */
  onResetClick = () => {
    const { model, onChange } = this.props;
    const { gssLineData, answers } = model;
    this.setState({
      dialog: {
        open: true,
        title: 'Warning',
        text: `This will remove all the elements added on the graph and reset graph to original state. Are you sure you want to continue?`,
        onConfirm: () => {
          // Reset the graph to original state
          answers.correctAnswer.marks = [];
          gssLineData.selectedTool = 'lineA';
          gssLineData.lineA.lineType = 'Solid';
          if (gssLineData.lineB) gssLineData.lineB.lineType = 'Solid';
          set(model, `answers`, answers);
          set(model, `gssLineData`, gssLineData);
          onChange(model);
          this.handleAlertDialog(false);
        },
        onClose: () => this.handleAlertDialog(false),
      },
    });
  };

  /*
   * Function to change the number of lines on the graph
   * @param {object} e - event object
   * @param {number} value - number of lines to be added on the graph
   * */
  changeNumberOfLines = (e, value) => {
    const { model } = this.props;
    let gssLineData = model.gssLineData;
    if (gssLineData.selectedTool === 'solutionSet') {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `Changing number of lines after adding solution set will remove added solution set. Are you sure you want to continue?`,
          onConfirm: () => {
            this.changeLine(e, value);
            this.handleAlertDialog(false);
          },
          onClose: () => this.handleAlertDialog(false),
        },
      });
    } else {
      this.changeLine(e, value);
    }
  };

  /*
   * Function to change the number of line on the graph
   * @param {object} e - event object
   * @param {number} value - number of lines to be added on the graph
   * */
  changeLine = (e, value) => {
    const { model, onChange } = this.props;
    const { answers } = model;
    let gssLineData = model.gssLineData;
    //remove polygon from correct answer
    answers.correctAnswer.marks = answers.correctAnswer.marks.filter((mark) => mark.type !== 'polygon');
    if (Number.parseInt(value) === 1) {
      //remove lineB from gssLineData and correct answer
      delete gssLineData.lineB;
      if (answers.correctAnswer.marks.length > 1) answers.correctAnswer.marks.pop();
      gssLineData.numberOfLines = 1;
      gssLineData.selectedTool = 'lineA';
    } else {
      gssLineData.numberOfLines = 2;
      if (answers.correctAnswer.marks.length > 0) gssLineData.selectedTool = 'lineB';
      gssLineData.lineB = {
        lineType: 'Solid',
      };
    }
    //reset solution set
    set(model, `answers`, answers);
    set(model, `gssLineData`, gssLineData);
    onChange(model);
  };

  /*
   * Function to handle the changes to solution set on the graph
   * @param {object} point - point selected on the graph
   * */
  onSolutionSetSelected = (point) => {
    const { model, onChange } = this.props;
    const { answers, gssLineData } = model;
    for (const section of gssLineData.sections) {
      //check if the point is inside the polygon
      if (pointInsidePolygon(point, section)) {
        let polygon = {
          points: section,
          building: false,
          type: 'polygon',
          closed: true,
          isSolution: true,
        };
        //remove old answer section from correct answer
        answers.correctAnswer.marks = answers.correctAnswer.marks.filter((mark) => mark.type !== 'polygon');
        //add new answer section to correct answer
        answers.correctAnswer.marks.push(polygon);
        break;
      }
    }
    set(model, `answers`, answers);
    onChange(model);
  };

  /*
   * Function to handle the changes to line data on the graph
   * @param {object} gssLineData - line data on the graph
   * @param {string} oldSelectedTool - old selected tool
   * */
  onChangeGssLineData = (gssLineData, oldSelectedTool) => {
    const { model } = this.props;
    const { answers, domain, range } = model;
    //handle solution set changes
    if (gssLineData.selectedTool === 'solutionSet') {
      let lines = answers.correctAnswer.marks.filter((mark) => mark.type !== 'polygon');
      if (!checkIfLinesAreAdded(gssLineData, lines)) {
        gssLineData.selectedTool = oldSelectedTool;
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Please define the line(s) and then select a solution set for the item.`,
            onConfirm: () => this.handleAlertDialog(false),
          },
        });
      } else {
        let lines = answers.correctAnswer.marks.filter((mark) => mark.type !== 'polygon');
        gssLineData = findSectionsInSolutionSet(gssLineData, lines, domain, range);
      }
      this.handleGssLineDataChange(gssLineData, answers);
    } else {
      let polygons = answers.correctAnswer.marks.filter((mark) => mark.type === 'polygon');
      if (oldSelectedTool === 'solutionSet' && polygons.length > 0) {
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Changing a line after adding a solution set will clear your selected solution set. Click 'Clear Solution Set' to change the line. Otherwise, click 'Cancel'.`,
            onConfirm: () => {
              answers.correctAnswer.marks = answers.correctAnswer.marks.filter((mark) => mark.type !== 'polygon');
              this.handleGssLineDataChange(gssLineData, answers);
              this.handleAlertDialog(false);
            },
            onConfirmText: 'CLEAR SOLUTION SET',
            onClose: () => {
              gssLineData.selectedTool = oldSelectedTool;
              this.handleGssLineDataChange(gssLineData, answers);
              this.handleAlertDialog(false);
            },
          },
        });
      } else {
        this.handleGssLineDataChange(gssLineData, answers);
      }
    }
  };

  /*
   * Function to handle the changes to line data on the graph
   * @param {object} gssLineData - line data on the graph
   * @param {object} answers - correct answer
   * */
  handleGssLineDataChange = (gssLineData, answers) => {
    const { model, onChange } = this.props;
    //handle line type changes from solid to dashed and vice versa
    if (answers.correctAnswer.marks.length > 0 && answers.correctAnswer.marks[0] && gssLineData.lineA) {
      answers.correctAnswer.marks[0].fill = gssLineData.lineA.lineType;
    }
    if (answers.correctAnswer.marks.length > 1 && answers.correctAnswer.marks[1] && gssLineData.lineB) {
      answers.correctAnswer.marks[1].fill = gssLineData.lineB.lineType;
    }
    //check if line is added to the graph before switching to lineB
    if (
      (gssLineData.selectedTool === 'lineB' && answers.correctAnswer.marks.length === 0) ||
      (gssLineData.selectedTool === 'lineB' && answers.correctAnswer.marks[0].building)
    ) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `Please add Line A to the graph before adding Line B`,
          onConfirm: () => this.handleAlertDialog(false),
        },
      });
      gssLineData.selectedTool = 'lineA';
    }
    //check if lineB is added to the graph before switching to lineA
    if (
      gssLineData.selectedTool === 'lineA' &&
      answers.correctAnswer.marks.length > 1 &&
      answers.correctAnswer.marks[1].building
    ) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `Please add Line B to the graph before switching to Line A`,
          onConfirm: () => this.handleAlertDialog(false),
        },
      });
      gssLineData.selectedTool = 'lineB';
    }
    set(model, `gssLineData`, gssLineData);
    set(model, `answers`, answers);
    onChange(model);
  };

  /*
   * Function to update the model
   * @param {object} props - updated props
   * */
  updateModel = (props) => {
    const { model, onChange } = this.props;
    onChange({
      ...model,
      ...props,
    });
  };

  /*
   * Render the component
   * */
  render() {
    const { classes, errors, model, mathMlOptions = {} } = this.props;
    const { dialog } = this.state;
    //get the default values to GssLineData
    const {
      gssLineData = {
        numberOfLines: 1,
        selectedTool: 'lineA',
        lineA: {
          lineType: 'Solid',
        },
      },
      arrows,
      coordinatesOnHover,
      domain,
      graph = {},
      labels,
      labelsEnabled,
      range,
      title,
      titleEnabled,
      marks,
      answers,
    } = model || {};
    const { correctAnswerErrors = '' } = errors || {};
    return (
      <div>
        <Typography component="div" variant="subheading">
          Define Line Type(s) and Correct Response
        </Typography>
        <Typography component="div" variant="body1" className={classes.subtitleText}>
          Use this interface to choose how many lines students will be able to draw, and to define the correct answer.
        </Typography>
        <Typography component="div" variant="body1" className={classes.subtitleText}>
          Choose Number of Lines
        </Typography>
        <RadioGroup name="numberOfLines" value={gssLineData.numberOfLines} onChange={this.changeNumberOfLines}>
          <FormControlLabel
            className={classes.radioButtonClass}
            value="1"
            control={<Radio checked={gssLineData.numberOfLines === 1} className={classes.radioButton} />}
            label="One"
          />
          <FormControlLabel
            className={classes.radioButtonClass}
            value="2"
            control={<Radio checked={gssLineData.numberOfLines === 2} className={classes.radioButton} />}
            label="Two"
          />
        </RadioGroup>
        <React.Fragment>
          <Graph
            className={correctAnswerErrors['correctAnswer'] && classes.graphError}
            axesSettings={{ includeArrows: arrows }}
            backgroundMarks={[]}
            coordinatesOnHover={coordinatesOnHover}
            disabledLabels={true}
            disabledTitle={true}
            domain={domain}
            draggableTools={true}
            labels={labels}
            marks={answers && answers.correctAnswer && answers.correctAnswer.marks ? answers.correctAnswer.marks : []}
            onChangeMarks={(newMarks) => this.changeMarks(newMarks)}
            onCustomReset={this.onResetClick}
            range={range}
            showLabels={labelsEnabled}
            showTitle={titleEnabled}
            size={{ width: graph.width, height: graph.height }}
            title={title}
            gssLineData={gssLineData}
            onChangeGssLineData={this.onChangeGssLineData}
            onSolutionSetSelected={this.onSolutionSetSelected}
            toolbarTools={['line', 'polygon']}
            mathMlOptions={mathMlOptions}
          />
          {correctAnswerErrors['correctAnswer'] && (
            <div className={classes.errorMessage}>{correctAnswerErrors['correctAnswer']}</div>
          )}
        </React.Fragment>
        <AlertDialog
          open={dialog.open}
          title={dialog.title}
          text={dialog.text}
          onClose={dialog.onClose}
          onConfirm={dialog.onConfirm}
          onConfirmText={dialog.onConfirmText ? dialog.onConfirmText : 'OK'}
        />
      </div>
    );
  }
}

export default withStyles(styles)(CorrectResponse);
