import React from 'react';
import Typography from '@material-ui/core/Typography';
import { NChoice, InputCheckbox } from '@pie-lib/config-ui';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import range from 'lodash/range';
import Box from './box';
import PropTypes from 'prop-types';

class RawModelConfig extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object
  };

  onChange = key => event => {
    this.props.config[key] = event.target.checked;
    this.props.onChange(this.props.config);
  };

  onPromptChange = event => {
    this.props.config.prompt = event.target.value;
    this.props.onChange(this.props.config);
  };

  onAlignmentChange = alignment => {
    this.props.config.answerAlignment = alignment;
    this.props.onChange(this.props.config);
  };

  onAnswerSizeChange = size => {
    this.props.config.answerBlankSize = size;
    this.props.onChange(this.props.config);
  };

  render() {
    const { config, classes } = this.props;

    const { allowIntegersOnly } = config;

    const sizeOpts = range(2, 14, 2).map(v => ({
      label: v.toString(),
      value: v.toString()
    }));

    return (
      <Box>
        <Typography>Options</Typography>
        <br />
        <TextField
          classes={{
            root: classes.promptInput
          }}
          label="Prompt"
          multiline
          onChange={this.onPromptChange}
          value={config.prompt || ''}
          placeholder="Enter Value"
        />
        <br />
        <div className={classes.numberOpts}>
          <InputCheckbox
            label="Numbers only"
            checked={allowIntegersOnly}
            onChange={this.onChange('allowIntegersOnly')}
          />

          {allowIntegersOnly && (
            <InputCheckbox
              label="Decimals"
              checked={config.allowDecimal}
              onChange={this.onChange('allowDecimal')}
            />
          )}
          {allowIntegersOnly && (
            <InputCheckbox
              label="Thousands separator"
              checked={config.allowThousandsSeparator}
              onChange={this.onChange('allowThousandsSeparator')}
            />
          )}
          {allowIntegersOnly && (
            <InputCheckbox
              label="Negative"
              checked={config.allowNegative}
              onChange={this.onChange('allowNegative')}
            />
          )}
        </div>
        <NChoice
          header={'Answer Size'}
          value={config.answerBlankSize}
          opts={sizeOpts}
          onChange={this.onAnswerSizeChange}
        />
        <NChoice
          header={'Answer Alignment'}
          value={config.answerAlignment}
          opts={[
            { label: 'left', value: 'left' },
            { label: 'center', value: 'center' },
            { label: 'right', value: 'right' }
          ]}
          onChange={this.onAlignmentChange}
        />
      </Box>
    );
  }
}

const ModelConfig = withStyles(() => ({
  numberOpts: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  promptInput: {
    width: '100%',
    marginBottom: '10px'
  }
}))(RawModelConfig);

export default ModelConfig;
