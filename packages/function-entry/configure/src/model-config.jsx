import React from 'react';
import { Typography } from 'material-ui';
import { InputCheckbox } from '@pie-lib/config-ui';
import { withStyles } from 'material-ui/styles';
import Box from './box';

class RawModelConfig extends React.Component {

  onChange = (key) => (event) => {
    this.props.config[key] = event.target.checked;
    this.props.onChange(this.props.config);
  }

  render() {
    const { config, classes } = this.props;

    const { ignoreSpacing, showFormattingHelp } = config;

    return (
      <Box>
        <Typography>Options</Typography>
        <br />
        <div className={classes.numberOpts}>
          <InputCheckbox label="Ignore Spacing"
            checked={ignoreSpacing}
            onChange={this.onChange('ignoreSpacing')} />
          <InputCheckbox label="Show Formatting Help"
            checked={showFormattingHelp}
            onChange={this.onChange('showFormattingHelp')} />
        </div>
      </Box>
    )
  }
}

const ModelConfig = withStyles(theme => ({
  numberOpts: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
}))(RawModelConfig);

export default ModelConfig;
