import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';

const { allTools } = tools;

import { set } from 'lodash';

const styles = theme => ({
  column: {
    flex: 1
  },
  graphingTools: {
    marginTop: theme.spacing.unit * 3,
    color: '#ababab'
  },
  availableTools: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    display: 'flex'
  },
  availableTool: {
    cursor: 'pointer',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    textTransform: 'capitalize'
  },
  selectedTool: {
    background: '#d8d8d8',
    border: '2px solid #ababab'
  },
  container: {
    border: '2px solid #ababab',
    borderRadius: '4px',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
    background: '#fafafa'
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    cursor: 'pointer',
    background: '#eee',
    padding: theme.spacing.unit * 2,
    width: 'fit-content',
    borderRadius: '4px'
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

  render() {
    const { classes, model } = this.props;
    let { graph } = model || {};
    const { answers, arrows, backgroundMarks, domain, labels, range, title, toolbarTools } = model || {};
    graph = graph || {};

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
                <p>{name}</p>

                <Graph
                  axesSettings={{ includeArrows: arrows }}
                  backgroundMarks={backgroundMarks}
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
      </div>
    );
  }
}

export default withStyles(styles)(CorrectResponse);
