import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';
import { AlertDialog } from '@pie-lib/config-ui';
import Delete from '@material-ui/icons/Delete';
import { set, isEqual } from 'lodash';
import { MenuItem, Select, Typography } from '@material-ui/core';

const { allTools } = tools;

const styles = theme => ({
  column: {
    flex: 1
  },
  graphingTools: {
    color: '#ababab'
  },
  availableTools: {
    marginTop: theme.spacing.unit,
    display: 'flex'
  },
  availableTool: {
    cursor: 'pointer',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    border: '2px solid white',
    textTransform: 'capitalize',
    '&:hover': {
      color: '#4d4d4d'
    }
  },
  selectedTool: {
    background: '#d8d8d8',
    border: '2px solid #ababab'
  },
  container: {
    border: '2px solid #ababab',
    borderRadius: '4px',
    padding: `0 ${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px`,
    background: '#fafafa'
  },
  button: {
    margin: `${theme.spacing.unit * 3}px 0`,
    cursor: 'pointer',
    background: '#eee',
    padding: theme.spacing.unit * 1.5,
    width: 'fit-content',
    borderRadius: '4px',
    '&:hover': {
      background: '#d8d8d8'
    }
  },
  responseTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px'
  },
  iconButton: {
    marginLeft: '6px',
    color: '#6d6d6d',
    '&:hover': {
      cursor: 'pointer',
      color: '#000000'
    }
  },
  name: {
    margin: '5px 0'
  },
  subtitleText: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit
  },
  toolsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  defaultTool: {
    display: 'flex',
    alignItems: 'center',
    width: '300px'
  },
  defaultToolSelect: {
    marginLeft: theme.spacing.unit,
    textTransform: 'uppercase',
    color: '#4d4d4d'
  },
  menuItem: {
    textTransform: 'uppercase',
  },
  noDefaultTool: {
    padding: theme.spacing.unit / 2
  }
});

export const Tools = ({ classes, defaultTool, toolbarTools, toggleToolBarTool, onDefaultToolChange }) => {
  // label has to be placed at the end of the list
  const allToolsNoLabel = (allTools || []).filter(tool => tool !== 'label');
  const toolbarToolsNoLabel = (toolbarTools || []).filter(tool => tool !== 'label');

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
              {toolbarToolsNoLabel.map((tool, index) =>
                <MenuItem key={index} className={classes.menuItem} value={tool}>{tool}</MenuItem>)}
            </Select>
          </div>
        )}
      </div>
      <div className={classes.availableTools}>
        {([...allToolsNoLabel, 'label']).map(tool => {
          const selected = toolbarTools.find(t => t === tool);

          return (
            <div
              key={tool}
              className={classnames(
                classes.availableTool,
                selected && classes.selectedTool
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
  toggleToolBarTool: PropTypes.func
};

export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    toolbarTools: PropTypes.arrayOf(PropTypes.String)
  };

  state = {
    dialog: {
      open: false
    }
  };

  handleAlertDialog = (open, callback) =>
    this.setState({
      dialog: { open }
    }, callback);

  changeMarks = (key, marks) => {
    const { model, onChange } = this.props;

    set(model, `answers.${key}.marks`, marks);
    onChange(model);
  };

  filterMarks = (tool) => {
    const { model: { answers }} = this.props;

    return Object.entries(answers || {}).reduce((object, [key, answer]) => {
      object[key] = {
        ...answer,
        marks: (answer.marks || []).filter(mark => mark.type !== tool)
      };

      return object;
    }, {});
  };

  changeToolbarTools = toolbarTools => {
    const { model, onChange } = this.props;
    model.toolbarTools = toolbarTools;

    onChange(model);
  };

  updateModel = props => {
    const { model, onChange } = this.props;

    onChange({
      ...model,
      ...props
    });
  };

  toggleToolBarTool = tool => {
    const { model: { defaultTool, toolbarTools, answers = {}}} = this.props;
    const updatedToolbarTools = [ ...toolbarTools ];
    let newDefaultTool = defaultTool;

    const index = toolbarTools.findIndex(t => tool === t);

    if (index >= 0) {
      const updatedAnswers = this.filterMarks(tool);
      updatedToolbarTools.splice(index, 1);

      if (tool === defaultTool) {
        const toolbarToolsNoLabel = (updatedToolbarTools || []).filter(tool => tool !== 'label');
        newDefaultTool = toolbarToolsNoLabel.length && toolbarToolsNoLabel[0] || '';
      }

      if (!isEqual(answers, updatedAnswers)) {
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Correct answer includes one or more ${tool} objects and all of them will be deleted.`,
            onConfirm: () => this.handleAlertDialog(
              false, this.updateModel({
                toolbarTools: updatedToolbarTools,
                answers: updatedAnswers,
                defaultTool: newDefaultTool
              })),
            onClose: () => this.handleAlertDialog(false)
          }
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
      defaultTool: newDefaultTool
    });
  };

  onDefaultToolChange = event => {
    const { value } = event.target;

    this.updateModel( { defaultTool: value });
  }

  addAlternateResponse = () => {
    const { model, onChange } = this.props;
    const { answers } = model || {};
    const answersKeys = Object.keys(answers || {});

    set(
      model,
      `answers.${`alternate${answersKeys.length}`}`,
      { name: `Alternate ${answersKeys.length}`, marks: [] }
    );
    onChange(model);
  };

  deleteAlternateResponse = (key, answer) => {
    const { model, onChange } = this.props;
    const { answers } = model || {};
    const { marks = [], name } = answer || {};

    const deleteAnswer = () => {
      delete answers[key];
      onChange(model);
    };

    if (marks.length) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: `${name} includes one or more shapes and the entire response will be deleted.`,
          onConfirm: () => this.handleAlertDialog(false, deleteAnswer),
          onClose: () => this.handleAlertDialog(false)
        }
      });

      return;
    }

    deleteAnswer();
  };

  render() {
    const { classes, model } = this.props;
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
      range,
      title,
      toolbarTools
    } = model || {};

    return (
      <div>
        <Typography component="div" variant="subheading">
          <span>Define Tool Set and Correct Response</span>
        </Typography>

        <Typography component="div" variant="body1" className={classes.subtitleText}>
          <span>Use this interface to choose which graphing tools students will be able to use, and to define the correct answer</span>
        </Typography>

        <Tools
          classes={classes}
          defaultTool={defaultTool}
          onDefaultToolChange={this.onDefaultToolChange}
          toggleToolBarTool={this.toggleToolBarTool}
          toolbarTools={toolbarTools}
        />

        {Object.entries(answers || {}).map(([key, answer]) => {
          const { marks = [], name } = answer || {};

          return (
            <div key={`correct-response-graph-${name}`}>
              <div className={classes.responseTitle}>
                <p className={classes.name}>{name}</p>
                {key !== 'correctAnswer' &&
                  <Delete
                    className={classes.iconButton}
                    onClick={() => this.deleteAlternateResponse(key, answer)}
                  />}
              </div>

              <Graph
                axesSettings={{ includeArrows: arrows }}
                backgroundMarks={backgroundMarks}
                coordinatesOnHover={coordinatesOnHover}
                domain={domain}
                labels={labels}
                marks={marks}
                onChangeMarks={newMarks => this.changeMarks(key, newMarks)}
                range={range}
                size={{width: graph.width, height: graph.height}}
                title={title}
                toolbarTools={toolbarTools}
              />
            </div>
          )
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
};

export default withStyles(styles)(CorrectResponse);
