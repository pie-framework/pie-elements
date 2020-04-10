import * as React from 'react';
import { InputRadio, InputCheckbox } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  optionsCheckbox: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  withLabelsContainer: {
    display: 'flex'
  },
  withLabelsRadioControl: {
    display: 'flex'
  },
  displayOptionsContainer: {
    display: 'inline-block',
    marginTop: theme.spacing.unit,
    width: '50%'
  }
});

class GeneralConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    onToggleWithLabels: PropTypes.func.isRequired,
    onModelConfigChange: PropTypes.func.isRequired,
    withLabels: PropTypes.bool,
  };

  render() {
    const { classes, withLabels, config, onToggleWithLabels, onModelConfigChange } = this.props;

    return (
      <div>
        <div className={classes.withLabelsContainer}>
          <InputRadio
            className={classes.withLabelsRadioControl}
            checked={withLabels}
            onChange={onToggleWithLabels(true)}
            label="With Labels"
          />
          <InputRadio
            className={classes.withLabelsRadioControl}
            checked={!withLabels}
            onChange={onToggleWithLabels(false)}
            label="Without Labels"
          />
        </div>
        <div style={{ display: 'flex' }}>
        {withLabels && <div className={classes.displayOptionsContainer}>
          <div className={classes.optionsCheckbox}>
            <InputCheckbox
              label="Points Must Match Labels"
              checked={config.pointsMustMatchLabels}
              onChange={onModelConfigChange('pointsMustMatchLabels')}/>
          </div>
        </div>}
        <div className={classes.displayOptionsContainer}>
          <div className={classes.optionsCheckbox}>
            <InputCheckbox
              label="Allow Partial Scoring"
              checked={config.allowPartialScoring}
              onChange={onModelConfigChange('allowPartialScoring')}/>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
