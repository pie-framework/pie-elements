import * as React from 'react';
import { InputContainer, NumberTextField } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import { generateValidationMessage } from '../utils';

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
  },
  input: {
    flex: 1,
  },
  numberTextField: {
    flexDirection: 'unset',
  },
  inputContainer: {
    width: '65%',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  titleText: {
    fontSize: theme.typography.fontSize + 2,
    marginRight: theme.spacing.unit,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
});

class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onResponseTypeChange: PropTypes.func.isRequired,
    onLayoutChange: PropTypes.func.isRequired,
  };

  onChangeResponseType = (name) => (event) => {
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
    const { layout = {}, choiceMode = {}, maxAnswers } = configuration || {};

    const validationMessage = generateValidationMessage(model, configuration);

    return (
      <React.Fragment>
        <div className={classes.flexContainer}>
          <Typography className={classes.titleText}>Define questions</Typography>
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} />
          </Tooltip>
        </div>

        <div className={classes.container}>
          <div className={classes.input}>
            {layout.settings && (
              <InputContainer label={layout.label} className={classes.inputContainer}>
                <NumberTextField
                  type="number"
                  min={3}
                  max={maxAnswers || 10}
                  value={model.layout}
                  onChange={(e, v) => this.onChangeColumns('layout', v)}
                  suffix={'Columns'}
                  className={classes.numberTextField}
                />
              </InputContainer>
            )}
          </div>

          <div className={classes.input}>
            {choiceMode.settings && (
              <InputContainer label={choiceMode.label} className={classes.inputContainer}>
                <Select onChange={this.onChangeResponseType('choiceMode')} value={model.choiceMode}>
                  <MenuItem value="radio">Radio - One Answer</MenuItem>
                  <MenuItem value="checkbox">Checkbox - Multiple Answers</MenuItem>
                </Select>
              </InputContainer>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
