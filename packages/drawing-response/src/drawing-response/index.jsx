import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {Collapsible, PreviewPrompt} from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';

import Container from './container';

class DrawingResponseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCorrect: false,
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    const {
      model: {
        disabled,
        imageDimensions,
        imageUrl,
        prompt,
        mode,
        teacherInstructions,
        backgroundImageEnabled = true
      },
      session,
      onSessionChange,
      classes
    } = this.props;
    const { hasError, errorMessage } = this.state;
    const isEvaluateMode = mode === 'evaluate';

    return hasError ? (
      <div>An error occured: {errorMessage}</div>
    ) : (
      <div>
        {teacherInstructions && (
          <React.Fragment>
            <Collapsible
              labels={{
                hidden: 'Show Teacher Instructions',
                visible: 'Hide Teacher Instructions'
              }}
            >
              <PreviewPrompt prompt={teacherInstructions} />
            </Collapsible>
            <br />
          </React.Fragment>
        )}

        <Typography className={classes.prompt}>
          <PreviewPrompt tagName="span" prompt={prompt} />
        </Typography>

        <Container
          session={session}
          onSessionChange={onSessionChange}
          isEvaluateMode={isEvaluateMode}
          imageDimensions={imageDimensions}
          imageUrl={imageUrl}
          backgroundImageEnabled={backgroundImageEnabled}
          disabled={disabled}
        />
      </div>
    );
  }
}

DrawingResponseComponent.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object.isRequired,
  onSessionChange: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired
};

const styles = () => ({
  prompt: {
    fontSize: 'inherit'
  }
});

export default withStyles(styles)(DrawingResponseComponent);
