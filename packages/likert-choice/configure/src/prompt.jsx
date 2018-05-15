import React, {Component} from 'react';
import EditableHtml from '@pie-lib/editable-html';
import {InputContainer} from '@pie-lib/config-ui';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  }
});

class Prompt extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    prompt: PropTypes.string.isRequired,
    onPromptChanged: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {

    const {classes, prompt, onPromptChanged} = this.props;

    return (<div>
      <InputContainer label="Prompt" className={classes.promptHolder}>
        <EditableHtml
          className={classes.prompt}
          markup={prompt}
          onChange={onPromptChanged}
        />
      </InputContainer>
    </div>)
  }
}

export default withStyles(styles)(Prompt);