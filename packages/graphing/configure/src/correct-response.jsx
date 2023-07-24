import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph } from '@pie-lib/graphing';
import { AlertDialog } from '@pie-lib/config-ui';
import Delete from '@material-ui/icons/Delete';
import { set, isEqual } from 'lodash';
import { MenuItem, Select, Tooltip, Typography } from '@material-ui/core';
import Info from '@material-ui/icons/Info';

const styles = (theme) => ({
  column: {
    flex: 1,
  },
  graphingTools: {
    color: theme.palette.grey['A200'],
  },
  availableTools: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexWrap: 'wrap',
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
});

export const Tools = ({
  classes,
  availableTools,
  defaultTool,
  hasErrors,
  toolbarTools,
  toggleToolBarTool,
  onDefaultToolChange,
}) => {
  let allTools = availableTools || [];
  const isLabelAvailable = allTools.includes('label');
  const toolbarToolsNoLabel = (toolbarTools || []).filter((tool) => tool !== 'label');

  if (isLabelAvailable) {
    // label has to be placed at the end of the list
    const allToolsNoLabel = allTools.filter((tool) => tool !== 'label');
    allTools = [...allToolsNoLabel, 'label'];
  }

  return (
    <div className={classes.graphingTools}>
      <div className={classes.toolsHeader}>
        <span>GRAPHING TOOLS</span>
        {toolbarToolsNoLabel.length > 0 && (
          <div className={classes.defaultTool}>
            <span>Default graphing tool:</span>
            <Select
              className={classes.defaultToolSelect}
              onChange={onDefaultToolChange}
              value={defaultTool}
              disableUnderline
            >
              {toolbarToolsNoLabel.map((tool, index) => (
                <MenuItem key={index} className={classes.menuItem} value={tool}>
                  {tool}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
      </div>
      <div className={classes.availableTools}>
        {allTools.map((tool) => {
          const selected = toolbarTools.find((t) => t === tool);

          return (
            <div
              key={tool}
              className={classnames(
                classes.availableTool,
                selected && classes.selectedTool,
                hasErrors && tool !== 'label' && classes.error,
              )}
              onClick={() => toggleToolBarTool(tool)}
            >
              {tool.toUpperCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Tools.propTypes = {
  classes: PropTypes.object.isRequired,
  toolbarTools: PropTypes.arrayOf(PropTypes.string),
  toggleToolBarTool: PropTypes.func,
  availableTools: PropTypes.array,
  defaultTool: PropTypes.string,
  hasErrors: PropTypes.number,
  onDefaultToolChange: PropTypes.func,
};

export class CorrectResponse extends React.Component {
  static propTypes = {
    availableTools: PropTypes.array,
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    toolbarTools: PropTypes.arrayOf(PropTypes.String),
  };

  state = {
    dialog: {
      open: false,
    },
  };

  handleAlertDialog = (open, callback) =>
    this.setState(
      {
        dialog: { open },
      },
      callback,
    );

  changeMarks = (key, marks) => {
    const { model, onChange } = this.props;

    set(model, `answers.${key}.marks`, marks);
    onChange(model);
  };

  filterMarks = (tool) => {
    const {
      model: { answers },
    } = this.props;

    return Object.entries(answers || {}).reduce((object, [key, answer]) => {
      object[key] = {
        ...answer,
        marks: (answer.marks || []).filter((mark) => mark.type !== tool),
      };

      return object;
    }, {});
  };

  changeToolbarTools = (toolbarTools) => {
    const { model, onChange } = this.props;
    model.toolbarTools = toolbarTools;

    onChange(model);
  };

  updateModel = (props) => {
    const { model, onChange } = this.props;

    onChange({
      ...model,
      ...props,
    });
  };

  toggleToolBarTool = (tool) => {
    const {
      model: { defaultTool, toolbarTools, answers = {} },
    } = this.props;
    const updatedToolbarTools = [...toolbarTools];
    let newDefaultTool = defaultTool;

    const index = toolbarTools.findIndex((t) => tool === t);

    if (index >= 0) {
      const updatedAnswers = this.filterMarks(tool);
      updatedToolbarTools.splice(index, 1);

      if (tool === defaultTool) {
        const toolbarToolsNoLabel = (updatedToolbarTools || []).filter((tool) => tool !== 'label');
        newDefaultTool = (toolbarToolsNoLabel.length && toolbarToolsNoLabel[0]) || '';
      }

      if (!isEqual(answers, updatedAnswers)) {
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Correct answer includes one or more ${tool} objects and all of them will be deleted.`,
            onConfirm: () =>
              this.handleAlertDialog(
                false,
                this.updateModel({
                  toolbarTools: updatedToolbarTools,
                  answers: updatedAnswers,
                  defaultTool: newDefaultTool,
                }),
              ),
            onClose: () => this.handleAlertDialog(false),
          },
        });

        return;
      }
    } else {
      updatedToolbarTools.push(tool);

      if (defaultTool === '' && tool !== 'label') {
        newDefaultTool = tool;
      }
    }

    this.updateModel({
      toolbarTools: updatedToolbarTools,
      defaultTool: newDefaultTool,
    });
  };

  onDefaultToolChange = (event) => {
    const { value } = event.target;

    this.updateModel({ defaultTool: value });
  };

  addAlternateResponse = () => {
    const { model, onChange } = this.props;
    const { answers } = model || {};
    const answersKeys = Object.keys(answers || {});

    set(model, `answers.${`alternate${answersKeys.length}`}`, {
      name: `Alternate ${answersKeys.length}`,
      marks: [],
    });
    onChange(model);
  };

  deleteAlternateResponse = (answerKey, answer) => {
    const { model, onChange } = this.props;
    const { answers } = model || {};
    const { marks = [], name } = answer || {};

    const deleteAnswer = () => {
      delete answers[answerKey];
      // rebuild answers based on new alternate positions after deletion
      const newAnswers = Object.entries(answers).reduce((acc, currentValue, index) => {
        const [key, value] = currentValue;
        const newAnswer =
          key === 'correctAnswer'
            ? { ...acc, [key]: value }
            : { ...acc, ['alternate' + index]: { ...value, name: `Alternate ${index}` } };
        return newAnswer;
      }, {});

      onChange({ ...model, answers: newAnswers });
    };

    if (marks.length) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `${name} includes one or more shapes and the entire response will be deleted.`,
          onConfirm: () => this.handleAlertDialog(false, deleteAnswer),
          onClose: () => this.handleAlertDialog(false),
        },
      });

      return;
    }

    deleteAnswer();
  };

  render() {
    const { availableTools, classes, errors, model, mathMlOptions = {} } = this.props;
    const { dialog } = this.state;
    const {
      answers = {},
      arrows,
      backgroundMarks,
      coordinatesOnHover,
      defaultTool,
      domain,
      graph = {},
      labels,
      labelsEnabled,
      range,
      title,
      titleEnabled,
      toolbarTools,
    } = model || {};
    const { correctAnswerErrors = {}, toolbarToolsError } = errors || {};

    return (
      <div>
        <Typography component="div" variant="subheading">
          Define Tool Set and Correct Response
        </Typography>

        <Typography component="div" variant="body1" className={classes.subtitleText}>
          Use this interface to choose which graphing tools students will be able to use, and to define the correct
          answer
        </Typography>

        <Tools
          classes={classes}
          availableTools={availableTools}
          defaultTool={defaultTool}
          hasErrors={!!toolbarToolsError}
          onDefaultToolChange={this.onDefaultToolChange}
          toggleToolBarTool={this.toggleToolBarTool}
          toolbarTools={toolbarTools}
        />

        {toolbarToolsError && <div className={classes.errorMessage}>{toolbarToolsError}</div>}

        {Object.entries(answers || {}).map(([key, answer]) => {
          const { marks = [], name } = answer || {};

          return (
            <React.Fragment key={`correct-response-graph-${name}`}>
              <div className={classes.responseTitle}>
                <div className={classes.name}>{name}</div>
                {key === 'correctAnswer' && (
                  <Tooltip
                    classes={{ tooltip: classes.tooltip }}
                    disableFocusListener
                    disableTouchListener
                    placement={'right'}
                    title={'At least 1 graph object should be defined.'}
                  >
                    <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '8px', marginBottom: 'auto' }} />
                  </Tooltip>
                )}
                {key !== 'correctAnswer' && (
                  <Delete className={classes.iconButton} onClick={() => this.deleteAlternateResponse(key, answer)} />
                )}
              </div>

              <Graph
                className={correctAnswerErrors[key] && classes.graphError}
                axesSettings={{ includeArrows: arrows }}
                backgroundMarks={backgroundMarks}
                coordinatesOnHover={coordinatesOnHover}
                disabledLabels={true}
                disabledTitle={true}
                domain={domain}
                draggableTools={key === 'correctAnswer'}
                labels={labels}
                marks={marks}
                onChangeMarks={(newMarks) => this.changeMarks(key, newMarks)}
                range={range}
                showLabels={labelsEnabled}
                showTitle={titleEnabled}
                size={{ width: graph.width, height: graph.height }}
                title={title}
                toolbarTools={toolbarTools}
                onChangeTools={(toolbarTools) => this.updateModel({ toolbarTools })}
                mathMlOptions={mathMlOptions}
              />

              {correctAnswerErrors[key] && <div className={classes.errorMessage}>{correctAnswerErrors[key]}</div>}
            </React.Fragment>
          );
        })}

        <div className={classes.button} onClick={this.addAlternateResponse}>
          ADD ALTERNATE
        </div>

        <AlertDialog
          open={dialog.open}
          title={dialog.title}
          text={dialog.text}
          onClose={dialog.onClose}
          onConfirm={dialog.onConfirm}
        />
      </div>
    );
  }
}

export default withStyles(styles)(CorrectResponse);
