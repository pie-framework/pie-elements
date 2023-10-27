import React from 'react';
import PropTypes from 'prop-types';
import { color, Collapsible, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { withStyles } from '@material-ui/core/styles';

import Container from './container';

class DrawingResponseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCorrect: false,
      hasError: false,
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
        backgroundImageEnabled,
        language
      },
      session,
      onSessionChange,
      classes,
    } = this.props;
    const { hasError, errorMessage } = this.state;
    const isEvaluateMode = mode === 'evaluate';

    return hasError ? (
      <div className={classes.main}>An error occured: {errorMessage}</div>
    ) : (
      <div className={classes.main}>
        {teacherInstructions && (
          <Collapsible
            className={classes.collapsible}
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </Collapsible>
        )}

        {prompt && <PreviewPrompt tagName="span" prompt={prompt} />}

        <Container
          session={session}
          onSessionChange={onSessionChange}
          isEvaluateMode={isEvaluateMode}
          imageDimensions={imageDimensions}
          imageUrl={imageUrl}
          backgroundImageEnabled={backgroundImageEnabled}
          disabled={disabled}
          language={language}
        />
      </div>
    );
  }
}

DrawingResponseComponent.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object.isRequired,
  onSessionChange: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  main: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(DrawingResponseComponent);
