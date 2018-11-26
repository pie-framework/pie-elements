import * as React from 'react';
import { InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
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
    onChange: PropTypes.func.isRequired
  };

  onChange = name => event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel[name] = event.target.value;

    onChange(newModel);
  };

  render() {
    const { classes, model } = this.props;

    console.log(model);

    return (
      <div className={classes.container}>
        <div className={classes.input}>
          <InputContainer label="Layout" className={classes.inputContainer}>
            {/* math-toolbar here */}
          </InputContainer>
        </div>
        <div className={classes.input}>
          <InputContainer label="Answer" className={classes.inputContainer}>
            {/* math-toolbar here for answer */}
          </InputContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
