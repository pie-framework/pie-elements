import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';

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

export class CorrectResponse extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const allTools = props.tools;

    if (allTools) {
      allTools.forEach(t => (t.toolbar = true));
      this.changeToolbarTools(allTools.reduce((a, b) => [...a, b.type], []));
    }

    this.state = { allTools };
  }

  changeMarks = (key, marks) => {
    const { model, onChange } = this.props;

    set(model, `answers.${key}.marks`, marks);
    onChange(model);
  };

  changeToolbarTools = (toolbarTools) => {
    const { model, onChange } = this.props;
    model.toolbarTools = toolbarTools;

    onChange(model);
  };

  toggleToolBarTool = tool => {
    const { toolbarTools } = this.props.model;

    const inToolbarTools = toolbarTools.findIndex(t => tool.type === t);
    let newToolbarTools = [];

    if (inToolbarTools >= 0) {
      newToolbarTools = [
        ...toolbarTools.slice(0, inToolbarTools),
        ...toolbarTools.slice(inToolbarTools + 1)
      ];
    } else {
      newToolbarTools = [ ...toolbarTools, tool.type ]
    }

    this.changeToolbarTools(newToolbarTools);
  };

  render() {
    const { classes, model, onChange } = this.props;
    const { allTools } = this.state;
    const { toolbarTools } = model;

    const tools = allTools.map(tool => {
      if (toolbarTools.find(t => t === tool.type)) {
        tool.toolbar = true;
      } else {
        tool.toolbar = false;
      }

      return tool;
    });

    return (
      <div>
        Define Correct Response

        <div className={classes.graphingTools}>
          GRAPHING TOOLS

          <div className={classes.availableTools}>
            {tools.map(tool => {
              const selected = toolbarTools.find(t => t === tool.type);

              return (
                <div
                  key={tool.type}
                  className={classnames(classes.availableTool, selected && classes.selectedTool)}
                  onClick={() => this.toggleToolBarTool(tool)}
                >
                  {tool.type.toUpperCase()}
                </div>
              )
            })}
          </div>
        </div>

        <div className={classes.container}>
          {Object.keys(model.answers).map(mark => (
            <div key={`correct-response-graph-${model.answers[mark].name}`}>
              <p>{model.answers[mark].name}</p>

              <Graph
                size={{
                  width: model.graph && model.graph.width,
                  height: model.graph && model.graph.height
                }}
                domain={model.domain}
                range={model.range}
                title={model.title}
                labels={model.labels}
                marks={model.answers[mark].marks}
                backgroundMarks={model.backgroundMarks}
                onChangeMarks={marks => this.changeMarks(mark, marks)}
                tools={tools}
                currentTool={tools.length && tools[0].Component.type}
                defaultTool={tools.length && tools[0].type}
              />
            </div>
          ))}

          <div
            className={classes.button}
            onClick={() => {
              set(model, `answers.${`alternate${Object.keys(model.answers).length}`}`, {
                  name: `Alternate ${Object.keys(model.answers).length}`,
                  marks: []
                }
              );
              onChange(model);
            }}
          >
            ADD ALTERNATE
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CorrectResponse);
