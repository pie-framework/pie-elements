import * as React from 'react';
import { InputContainer, NumberTextField } from '@pie-lib/config-ui';
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
    configuration: PropTypes.object.isRequired,
    onResponseTypeChange: PropTypes.func.isRequired,
    onLayoutChange: PropTypes.func.isRequired
  };

  onChangeResponseType = (name) => event => {
    const { model, onResponseTypeChange } = this.props;
    const newModel = { ...model };

    newModel[name] = event.target.value;

    onResponseTypeChange(newModel[name]);
  };

  onChangeColumns = (name, value) => {
    const { model, onLayoutChange } = this.props;
    const newModel = { ...model };

    newModel[name] = value;

    onLayoutChange(newModel[name]);
  };

  render() {
    const { classes, model, configuration } = this.props;
    const {
      layout = {},
      choiceMode = {}
    } = configuration || {};

    return (
      <div className={classes.container}>
        <div className={classes.input}>
          {layout.settings &&
            <InputContainer
              label={layout.label}
              className={classes.inputContainer}
            >
              <NumberTextField
                type="number"
                min={3}
                max={10}
                value={model.layout}
                onChange={(e, v) => this.onChangeColumns('layout', v)}
                suffix={'Columns'}
              />
            </InputContainer>
          }
        </div>
        <div className={classes.input}>
          {
            choiceMode.settings &&
            <InputContainer label={choiceMode.label} className={classes.inputContainer}>
              <Select
                className={classes.select}
                onChange={this.onChangeResponseType('choiceMode')}
                value={model.choiceMode}
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
