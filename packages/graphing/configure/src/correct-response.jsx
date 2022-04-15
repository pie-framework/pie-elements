import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

const { allTools } = tools;

import { set } from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

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
      color: 'black'
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
    // color: 'black',
    color: '#ababab',
    '& :hover': {
      cursor: 'pointer',
      // color: '#ababab'
      color: 'black'
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

  changeMarks = (key, marks) => {
    const { model, onChange } = this.props;

    set(model, `answers.${key}.marks`, marks);
    onChange(model);
  };

  changeToolbarTools = toolbarTools => {
    const { model, onChange } = this.props;
    model.toolbarTools = toolbarTools;

    onChange(model);
  };

  toggleToolBarTool = tool => {
    const { toolbarTools } = this.props.model;

    const index = toolbarTools.findIndex(t => tool === t);

    if (index >= 0) {
      const update = [...toolbarTools];
      update.splice(index, 1);
      this.changeToolbarTools(update);
    } else {
      this.changeToolbarTools([...toolbarTools, tool]);
    }
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

  deleteAlternateResponse = (mark) => {
    console.log('mark', mark);
    const { model, onChange } = this.props;
    const { answers } = model || {};
    const { marks, name } = answers[mark] || {};

    console.log('answers[mark]', answers[mark]);
    if ((marks || []).length) {
      this.setState({
        dialog: {
          open: true,
          message: `${name} includes one or more objects. The entire response will be deleted.`,
          onOk: () => {
            this.setState({
              dialog: {
                open: false
              }
            });

            delete answers[mark];
            onChange(model);
          },
          onCancel: () => this.setState({
            dialog: {
              open: false
            }
          })
        }
      });

      return;
    }

    delete answers[mark];
    onChange(model);
  };

  render() {
    const { classes, model } = this.props;
    const { dialog } = this.state;
    const {
      answers,
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

   const answersKeys = Object.keys(answers || {});

    return (
      <div>
        Define Correct Response
        <Tools
          classes={classes}
          toggleToolBarTool={this.toggleToolBarTool}
          toolbarTools={toolbarTools}
        />

        <div className={classes.container}>
          {answersKeys.map(mark => {
            const { marks, name } = answers[mark] || {};

            return (
              <div key={`correct-response-graph-${name}`}>
                <div className={classes.responseTitle}>
                  <p className={classes.name} >{name}</p>
                  {mark !== 'correctAnswer' &&
                    <Delete
                      className={classes.iconButton}
                      onClick={() => this.deleteAlternateResponse(mark)}
                    />}
                </div>

                <Graph
                  axesSettings={{ includeArrows: arrows }}
                  backgroundMarks={backgroundMarks}
                  coordinatesOnHover={coordinatesOnHover}
                  domain={domain}
                  labels={labels}
                  marks={marks}
                  onChangeMarks={newMarks => this.changeMarks(mark, newMarks)}
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

        <InfoDialog
          open={dialog.open}
          title={dialog.message}
          onCancel={dialog.onCancel}
          onOk={dialog.onOk}
        />
      </div>
    );
  }
};

const InfoDialog = ({ open, onCancel, onOk, title }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogActions>
      {onOk && (
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      )}
      {onCancel && (
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

InfoDialog.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  title: PropTypes.string,
};

export default withStyles(styles)(CorrectResponse);
