import * as React from 'react';
import { InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
  },
  input: {
    flex: 1
  },
  inputContainer: {
    width: '90%'
  }
});

class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onResponseTypeChange: PropTypes.func.isRequired,
    onLayoutChange: PropTypes.func.isRequired
  };

  onChange = (name) => event => {
    const { model, onLayoutChange, onResponseTypeChange } = this.props;
    const newModel = { ...model };

    newModel[name] = event.target.value;

    if (name === 'layout') {
      onLayoutChange(newModel[name]);
    } else {
      onResponseTypeChange(newModel[name]);
    }
  };

  render() {
    const { classes, model } = this.props;
    const {
      configure: {
        layout,
        responseType
      }
    } = model;

    return (
      <div className={classes.container}>
        <div className={classes.input}>
          {layout.settings &&
            <InputContainer
              label={layout.label}
              className={classes.inputContainer}
            >
              <Select
                className={classes.select}
                onChange={this.onChange('layout')}
                value={model.layout}
              >
                <MenuItem value={3}>3 Columns</MenuItem>
                <MenuItem value={4}>4 Columns</MenuItem>
                <MenuItem value={5}>5 Columns</MenuItem>
              </Select>
            </InputContainer>
          }
        </div>
        <div className={classes.input}>
          {
            responseType.settings &&
            <InputContainer label={responseType.label} className={classes.inputContainer}>
              <Select
                className={classes.select}
                onChange={this.onChange('responseType')}
                value={model.responseType}
              >
                <MenuItem value="radio">Radio - One Answer</MenuItem>
                <MenuItem value="checkbox">Checkbox - Multiple Answers</MenuItem>
              </Select>
            </InputContainer>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
