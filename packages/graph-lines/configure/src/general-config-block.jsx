import * as React from 'react';
import { InputContainer, InputCheckbox } from '@pie-lib/config-ui';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  inputItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  exhibitOnly: {
    flex: 'initial',
    width: '50%'
  },
  input: {
    width: '90%'
  },
  equationLabel: {
    marginRight: theme.spacing.unit
  },
  optionsCheckbox: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
});

class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  onChange = (name, isBoolean) => event => {
    const { config, onChange } = this.props;
    const newConfig = { ...config };

    newConfig[name] = isBoolean ? event.target.checked : event.target.value;

    onChange(newConfig, name);
  }

  render() {
    const { classes, config } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.inputContainer}>
          {!config.exhibitOnly &&<div className={classes.inputItem}>
            <Typography type="body1">
              <span className={classes.equationLabel}>y = </span>
            </Typography>
            <InputContainer label="Correct Line">
            <Input
              type="text"
              className={classes.input}
              onChange={this.onChange('correctLine')}
              value={config.correctLine}
              placeholder="Enter Value"
            />
            </InputContainer>
          </div>}

          <div className={classnames(classes.inputItem, { [classes.exhibitOnly]: config.exhibitOnly })}>
            <Typography type="body1">
              <span className={classes.equationLabel}>y = </span>
            </Typography>
            <InputContainer label="Initial View">
              <Input
                type="text"
                className={classes.input}
                onChange={this.onChange('initialView')}
                value={config.initialView}
                placeholder="Enter Value"
              />
            </InputContainer>
          </div>
        </div>
        <div className={classes.optionsCheckbox}>
          <InputCheckbox
            label="Make this graph an exhibit only"
            checked={config.exhibitOnly}
            onChange={this.onChange('exhibitOnly', true)}/>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
