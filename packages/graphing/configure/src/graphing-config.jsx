import * as React from 'react';
import { NumberTextField } from '@pie-lib/config-ui';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer as Graph } from '@pie-lib/graphing';
import { TextField } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';

import { get, set } from 'lodash';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    display: 'flex',
    flex: 1,
  },
  column: {
    flex: 1
  },
  row: {
    marginTop: theme.spacing.unit * 2,
    flex: 1
  },
  settings: {
    display: 'flex',
    flexDirection: 'row'
  },
  input: {
    width: 'calc(100% -  32px)'
  },
  smallInput: {
    width: 'calc(50% -  32px)'
  }
});

export class GraphingConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    authoringEnabled: PropTypes.bool,
    tools: PropTypes.array
  };

  constructor(props) {
    super(props);
    const toolsArr = cloneDeep(props.tools);
    toolsArr.forEach(t => (t.toolbar = true));

    this.state = {
      currentTool: toolsArr.length && toolsArr[0].type,
      tools: toolsArr
    };
  }

  onChangeInputValue = (key, value) => {
    const { model } = this.props;

    set(model, key, value);
    this.props.onChange(model);
  };

  renderInput = (key, label, className) => {
    const { classes, model } = this.props;

    return (
      <NumberTextField
        key={key}
        label={label.toUpperCase()}
        onChange={(event, value) => this.onChangeInputValue(key, value)}
        value={get(model, key)}
        className={className || classes.input}
      />
    )
  };

  renderRow = (key, content) => {
    const { classes } = this.props;

    return (
      <div className={classes.row} key={key}>
        {content}
      </div>
    );
  };

  changeBackgroundMarks = backgroundMarks => {
    const model = { ...this.props.model, backgroundMarks };
    this.props.onChange(model);
  };

  render() {
    const { classes, model, authoringEnabled } = this.props;
    const { tools, currentTool }  = this.state;

    const Column = ({ columnKey, axis }) => {
      const rows = [{
        key: '${columnKey}-min-max',
        inputs: [
          {
            key: `${columnKey}.min`,
            label: 'Min value',
            className: classes.smallInput
          },
          {
            key: `${columnKey}.max`,
            label: 'Max value',
            className: classes.smallInput
          }
        ]
      }, {
        key: `${columnKey}-tick-frequency`,
        inputs: [
          {
            key: `${columnKey}.step`,
            label: 'Tick frequency'
          }
        ]
      },
        {
          key: `${columnKey}-tick-label-frequency`,
          inputs: [
            {
              key: `${columnKey}.labelStep`,
              label: 'Tick label frequency'
            }
          ]
        },
        {
          key: `${columnKey}-axis-label`,
          inputs: [
            {
              type: 'text',
              key: `${axis}-axis-label-input`,
              label: `${axis} Axis Label`
            }
          ]
        }
      ];

      return (
        <div className={classes.column} key={columnKey}>
          {`${columnKey.toUpperCase()} (${axis.toUpperCase()})`}

          {rows.map(row => (
            <div className={classes.row} key={row.key}>
              {row.inputs.map(input => {
                if (input.type === 'text') {
                  return (
                    <TextField
                      className={classes.input}
                      label={input.label.toUpperCase()}
                      value={model[`${axis}AxisLabel`]}
                      onChange={({ target }) => this.onChangeInputValue(`${axis}AxisLabel`, target.value)}
                    />
                  );
                }

                return (
                  <TextField
                    type="number"
                    key={input.key}
                    label={input.label.toUpperCase()}
                    onChange={(event, value) => this.onChangeInputValue(input.key, value)}
                    value={get(this.props.model, input.key)}
                    className={input.className || classes.input}
                  />
                );
              })}
            </div>
            ))}
        </div>
      );
    };

    return (
      <div>
        Define Graph Attributes

        <div className={classes.container}>
          {
            authoringEnabled && (
              <div className={classnames(classes.column, classes.settings)} key="settings">
                <Column columnKey="domain" axis="x"/>
                <Column columnKey="range" axis="y"/>
              </div>
            )
          }

          <div className={classes.column} key="graph">
            <Typography component="div" type="body1">
              <span>Use the tools below to set background shapes</span>
            </Typography>

            <Graph
              key="graphing-config"
              size={{
                width: model.graph && model.graph.width,
                height: model.graph && model.graph.height
              }}
              domain={model.domain}
              range={model.range}
              title={model.title}
              labels={model.labels}
              marks={model.backgroundMarks}
              backgroundMarks={[]}
              onChangeMarks={this.changeBackgroundMarks}
              tools={tools}
              currentTool={currentTool}
              defaultTool={tools.length && tools[0].type}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GraphingConfig);
