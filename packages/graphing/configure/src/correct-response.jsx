import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';
import { AlertDialog } from '@pie-lib/config-ui';
import Delete from '@material-ui/icons/Delete';
import { set, isEqual } from 'lodash';

const { allTools } = tools;

const styles = theme => ({
  column: {
    flex: 1
  },
  graphingTools: {
    margin: `${theme.spacing.unit * 3}px 0`,
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
    marginTop: theme.spacing.unit * 3,
    cursor: 'pointer',
    background: '#eee',
    padding: theme.spacing.unit * 2,
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
  }
});

export const Tools = ({ classes, toolbarTools, toggleToolBarTool }) => {
  // label has to be placed at the end of the list
  const allToolsNoLabel = (allTools || []).filter(tool => tool !== 'label');

  return (
    <div className={classes.graphingTools}>
      GRAPHING TOOLS
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
    const filteredAnswers = {};

    Object.entries(answers || {}).forEach(([key, answer]) => {
      const filteredMarks = (answer.marks || []).filter(mark => mark.type !== tool);

      filteredAnswers[key] = {
        ...answer,
        marks: filteredMarks
      };
    });

    return filteredAnswers;
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
    const { model: { toolbarTools, answers = {}}} = this.props;
    const updatedToolbarTools = [ ...toolbarTools ];

    const index = toolbarTools.findIndex(t => tool === t);

    if (index >= 0) {
      const updatedAnswers = this.filterMarks(tool);
      updatedToolbarTools.splice(index, 1);

      if (!isEqual(answers, updatedAnswers)) {
        this.setState({
          dialog: {
            open: true,
            title: 'Warning',
            text: `Correct answer includes one or more ${tool} objects and all of them will be deleted.`,
            onConfirm: () => this.handleAlertDialog(
              false, this.updateModel({
                toolbarTools: updatedToolbarTools,
                answers: updatedAnswers
              })),
            onClose: () => this.handleAlertDialog(false)
          }
        });

        return;
      }
    } else {
      updatedToolbarTools.push(tool);
    }

    this.updateModel({ toolbarTools: updatedToolbarTools });
  };

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
      domain,
      graph = {},
      labels,
      range,
      title,
      toolbarTools
    } = model || {};

    return (
      <div>
        Define Correct Response
        <Tools
          classes={classes}
          toggleToolBarTool={this.toggleToolBarTool}
          toolbarTools={toolbarTools}
        />

        <div className={classes.container}>
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
                  size={{ width: graph.width, height: graph.height }}
                  title={title}
                  toolbarTools={toolbarTools}
                />
              </div>
            )
          })}

          <div className={classes.button} onClick={this.addAlternateResponse}>
            ADD ALTERNATE
          </div>
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
