import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Collapsible } from '@pie-lib/render-ui';
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
        teacherInstructions
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
          <div style={{ margin: '16px 0' }}>
            <Collapsible
              labels={{
                hidden: 'Show Teacher Instructions',
                visible: 'Hide Teacher Instructions'
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: teacherInstructions }} />
            </Collapsible>
          </div>
        )}
        <br />

        <Typography className={classes.prompt}>
          <span dangerouslySetInnerHTML={{ __html: prompt }} />
        </Typography>

        <Container
          session={session}
          onSessionChange={onSessionChange}
          isEvaluateMode={isEvaluateMode}
          imageDimensions={imageDimensions}
          imageUrl={imageUrl}
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
