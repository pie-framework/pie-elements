import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';

export class Config extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    config: PropTypes.object,
    onModelChanged: PropTypes.func,
  };

  static defaultProps = {};

  changeLabel = ({ target }) => {
    this.props.onModelChanged({ choicesLabel: target.value });
  };

  render() {
    const { classes, className, config, spellCheck } = this.props;

    return (
      <div className={classNames(classes.config, className)}>
        <TextField
          className={classes.label}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          label="Label"
          value={config.choicesLabel}
          onChange={this.changeLabel}
          spellCheck={spellCheck}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  config: {
    paddingTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  label: {
    width: '100%',
  },
});

export default withStyles(styles)(Config);
