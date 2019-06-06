import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';

import { get, set } from 'lodash';

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
      { name: 'point', component: tools.point(), selected: true },
      { name: 'circle', component: tools.circle(), selected: true },
      { name: 'polygon', component: tools.polygon(), selected: true },
      { name: 'segment', component: tools.segment(), selected: true },
      { name: 'vector', component: tools.vector(), selected: true },
      { name: 'ray', component: tools.ray(), selected: true },
      { name: 'line', component: tools.line(), selected: true },
      { name: 'sine', component: tools.sine(), selected: true },
      { name: 'parabola', component: tools.parabola(), selected: true },
      { name: 'label', component: tools.label(), selected: true }
    ];

    const selectedTools = allTools.filter(t => t.selected);
    this.state = {
      allTools,
      currentTool: selectedTools && selectedTools[0],
      settings: {
        includeArrows: true,
        labels: true,
        graphTitle: false,
        coordinatesOnHover: false,
        size: {
          width: 600,
          height: 300
        }
      },
    };
  }

  changeMarks = (key, marks) => {
    const { model } = this.props;

    set(model, `answers.${key}.marks`, marks);
    this.props.onChange(model);
  };

  render() {
    const { classes, model } = this.props;
    const { allTools, currentTool, settings } = this.state;
    const selectedTools = allTools.filter(t => t.selected).map(t => t.component);
    console.log('model=', model);

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
                  className={classnames(classes.availableTool, tool.selected && classes.selectedTool)}
                  onClick={() => {
                    const nextAllTools = allTools.map(t => {
                      if (tool.name === t.name) {
                        t.selected = !tool.selected
                      }

                      return t;
                    });

                    this.setState({
                      allTools: nextAllTools,
                      currentTool: (currentTool.name === tool.name && tool.selected) ? nextAllTools[0] : currentTool
                    });
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
                size={settings.size}
                domain={model.domain}
                range={model.range}
                title={model.title}
                axesSettings={{
                  includeArrows: settings.includeArrows
                }}
                labels={settings.labels && model.labels}
                marks={model.answers[mark].marks}
                backgroundMarks={model.backgroundMarks}
                onChangeMarks={marks => this.changeMarks(mark, marks)}
                tools={selectedTools}
                currentTool={currentTool && currentTool.component}
                defaultTool={selectedTools && selectedTools[0] && selectedTools[0].type}
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
              this.props.onChange(model);
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
