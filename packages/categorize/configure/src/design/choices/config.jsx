import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import { InputCheckbox, NumberTextField, TwoChoice } from '@pie-lib/config-ui';
import { Divider } from '../buttons';

const withDefaults = o => ({
  label: '',
  columns: 2,
  position: 'above',
  shuffle: false,
  ...o
});
export class Config extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    categoryCountIsOne: PropTypes.bool,
    onToggleCategoryCount: PropTypes.func
  };

  static defaultProps = {};

  changeColumns = (event, columns) => {
    this.apply(config => (config.columns = columns));
  };

  apply = fn => {
    const { onChange } = this.props;
    const config = withDefaults(this.props.config);
    fn(config);
    onChange(config);
  };

  changeLabel = event => {
    this.apply(config => (config.label = event.target.value));
  };

  toggleShuffle = () => {
    this.apply(config => (config.shuffle = !config.shuffle));
  };

  changePosition = position => {
    this.apply(config => (config.position = position));
  };

  render() {
    const {
      classes,
      className,
      categoryCountIsOne,
      onToggleCategoryCount
    } = this.props;

    const config = withDefaults(this.props.config);

    return (
      <div className={classNames(classes.config, className)}>
        <div className={classes.row}>
          <NumberTextField
            className={classes.numberTextField}
            label={'Choices per row'}
            min={1}
            max={4}
            value={config.columns}
            onChange={this.changeColumns}
          />
          <InputCheckbox
            label={'Remove all tiles after placing'}
            checked={categoryCountIsOne}
            onChange={onToggleCategoryCount}
          />
          <InputCheckbox
            label={'Shuffle'}
            value={config.shuffle}
            onChange={this.toggleShuffle}
          />
        </div>
        <Divider />

        <div className={classes.header}>
          <TextField
            className={classes.label}
            InputLabelProps={{
              shrink: true
            }}
            label="Label"
            value={config.label}
            onChange={this.changeLabel}
          />
          <TwoChoice
            header={'Position'}
            value={config.position}
            onChange={this.changePosition}
            one={{ label: 'Above', value: 'above' }}
            two={{ label: 'Below', value: 'below' }}
          />
        </div>
      </div>
    );
  }
}
const styles = theme => ({
  config: {}
});
export default withStyles(styles)(Config);
