import React from 'react';
import PropTypes from 'prop-types';
import { color, Collapsible, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';

import Container from './container';

const StyledUiLayout = styled(UiLayout)({
  color: color.text(),
  backgroundColor: color.background(),
});

const StyledCollapsible = styled(Collapsible)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ErrorDiv = styled('div')({
  color: color.text(),
  backgroundColor: color.background(),
});

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
        extraCSSRules,
        disabled,
        imageDimensions,
        imageUrl,
        prompt,
        mode,
        teacherInstructions,
        backgroundImageEnabled,
        language,
      },
      session,
      onSessionChange,
    } = this.props;
    const { hasError, errorMessage } = this.state;
    const isEvaluateMode = mode === 'evaluate';

    return hasError ? (
      <ErrorDiv>An error occured: {errorMessage}</ErrorDiv>
    ) : (
      <StyledUiLayout extraCSSRules={extraCSSRules}>
        {teacherInstructions && (
          <StyledCollapsible
            labels={{
              hidden: 'Show Teacher Instructions',
              visible: 'Hide Teacher Instructions',
            }}
          >
            <PreviewPrompt prompt={teacherInstructions} />
          </StyledCollapsible>
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
      </StyledUiLayout>
    );
  }
}

DrawingResponseComponent.propTypes = {
  model: PropTypes.object.isRequired,
  onSessionChange: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
};

export default DrawingResponseComponent;
