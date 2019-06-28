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

    const allTools = [
      { name: 'point', Component: tools.point(), display: true },
      { name: 'circle', Component: tools.circle(), display: true },
      { name: 'polygon', Component: tools.polygon(), display: true },
      { name: 'segment', Component: tools.segment(), display: true },
      { name: 'vector', Component: tools.vector(), display: true },
      { name: 'ray', Component: tools.ray(), display: true },
      { name: 'line', Component: tools.line(), display: true },
      { name: 'sine', Component: tools.sine(), display: true },
      { name: 'parabola', Component: tools.parabola(), display: true },
    ];

    this.state = { allTools };
  }

  componentDidMount() {
    this.changeDisplayedTools(this.state.allTools);
  }

  changeMarks = (key, marks) => {
    const { model, onChange } = this.props;

    set(model, `answers.${key}.marks`, marks);
    onChange(model);
  };

  changeDisplayedTools = (tools) => {
    const { model, onChange } = this.props;
    model.tools = tools;

    onChange(model);
  };

  render() {
    const { classes, model, onChange } = this.props;
    const { allTools } = this.state;

    return (
      <div>
        Define Correct Response

        <div className={classes.graphingTools}>
          GRAPHING TOOLS

          <div className={classes.availableTools}>
            {allTools.map(tool => {
              return (
                <div
                  key={tool.name}
                  className={classnames(classes.availableTool, tool.display && classes.selectedTool)}
                  onClick={() => {
                    const newTools = allTools.map(t => {
                      if (t.name === tool.name) {
                        t.display = !t.display;
                      }
                      return t;
                    });
                    this.setState({ allTools: newTools});
                    this.changeDisplayedTools(newTools);
                  }}
                >
                  {tool.name}
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
                tools={allTools}
                currentTool={allTools[0].Component}
                defaultTool={allTools && allTools[0].type}
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
