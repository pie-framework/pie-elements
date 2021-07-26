import * as React from 'react';
import { NumberTextField } from '@pie-lib/config-ui';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GraphContainer } from '@pie-lib/graphing';
import { TextField } from '@material-ui/core';

import { get, set } from 'lodash';
import Typography from '@material-ui/core/Typography';

export const AuthoringColumn = ({ columnKey, axis, classes, model }) => {
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
                value={get(model, input.key)}
                className={input.className || classes.input}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

AuthoringColumn.propTypes = {
  axis: PropTypes.String,
  classes: PropTypes.object,
  columnKey: PropTypes.String,
  model: PropTypes.object,
};

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
  };

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
    let { graph } = model || {};
    const { arrows, backgroundMarks, coordinatesOnHover, domain, labels, range, title, toolbarTools } = model || {};
    graph = graph || {};

    return (
      <div>
        Define Graph Attributes

        <div className={classes.container}>
          {
            authoringEnabled && (
              <div className={classnames(classes.column, classes.settings)} key="settings">
                <AuthoringColumn columnKey="domain" axis="x" classes={classes} model={model} />
                <AuthoringColumn columnKey="range" axis="y" classes={classes} model={model} />
              </div>
            )
          }

          <div className={classes.column} key="graph">
            <Typography component="div" type="body1">
              <span>Use the tools below to set background shapes</span>
            </Typography>

            <GraphContainer
              axesSettings={{ includeArrows: arrows }}
              backgroundMarks={[]}
              coordinatesOnHover={coordinatesOnHover}
              domain={domain}
              key="graphing-config"
              labels={labels}
              marks={backgroundMarks}
              onChangeMarks={this.changeBackgroundMarks}
              range={range}
              size={{ width: graph.width, height: graph.height }}
              title={title}
              toolbarTools={toolbarTools}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GraphingConfig);
