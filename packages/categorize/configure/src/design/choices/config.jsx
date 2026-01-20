import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const ConfigContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const StyledTextField = styled(TextField)({
  width: '100%',
});

export class Config extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    onModelChanged: PropTypes.func,
    spellCheck: PropTypes.bool,
  };

  static defaultProps = {};

  changeLabel = ({ target }) => {
    this.props.onModelChanged({ choicesLabel: target.value });
  };

  render() {
    const { config, spellCheck } = this.props;

    return (
      <ConfigContainer>
        <StyledTextField
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          label="Label"
          value={config.choicesLabel}
          onChange={this.changeLabel}
          spellCheck={spellCheck}
        />
      </ConfigContainer>
    );
  }
}

export default Config;
