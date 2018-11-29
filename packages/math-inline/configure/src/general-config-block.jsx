import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MathToolbar, MathPreview } from '@pie-lib/math-toolbar';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
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

  onChange = event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.expression = event.target.value;

    onChange(newModel);
  };

  onDone = event => {
    console.log(event);
  }

  render() {
    const { classes, model } = this.props;

    console.log(model);

    return (
      <div className={classes.container}>
        <div className={classes.input}>
            <MathToolbar
              allowAnswerBlock
              latex={model.expression}
              onChange={this.onChange}
              onDone={this.onDone}
            />
        </div>
        {/*<div className={classes.input}>*/}
            {/*<MathPreview />*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default withStyles(styles)(GeneralConfigBlock);
