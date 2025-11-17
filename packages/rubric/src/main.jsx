import React from 'react';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import { color, UiLayout } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';

const StyledUiLayout = styled(UiLayout)(({ theme }) => ({
  color: color.text(),
  backgroundColor: color.background(),
  // apply styles to tables to match the rest of the UI
  '&:not(.MathJax) table': {
    borderCollapse: 'collapse',
  },
  '&:not(.MathJax) table td, &:not(.MathJax) table th': {
    padding: '8px 12px',
    textAlign: 'left',
  },
  // reset paragraph margins and line-height inside lists to override client styles
  '& ul p, & ol p': {
    marginBottom: 0,
    marginTop: 0,
    lineHeight: 'normal',
  },
}));

const StyledListItem = styled(ListItem)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '12px 0px',
});

const Text = styled('div')({
  color: color.text(),
});

const TitleText = styled('h3')({
  color: color.text(),
  fontSize: '16px',
  fontWeight: '700',
  margin: 0,
  paddingBottom: '6px',
});

const SampleTitleText = styled('h4')({
  color: color.text(),
  fontSize: '16px',
  fontWeight: 'normal',
  margin: 0,
  paddingBottom: '6px',
});

const RubricToggle = styled('h2')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  fontSize: theme.typography.fontSize,
  fontWeight: '500',
  color: color.tertiary(),
  margin: 0,
}));

const ChevronStyle = styled('span')({
  display: 'inline-flex',
  transition: 'transform 0.2s',
  marginLeft: 2,
  alignSelf: 'center',
});

const HiddenScreenReader = styled('h2')({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: 0,
  whiteSpace: 'nowrap',
});

export const RubricType = PropTypes.shape({
  excludeZero: PropTypes.bool,
  points: PropTypes.arrayOf(PropTypes.string),
  sampleAnswers: PropTypes.arrayOf(PropTypes.string),
  animationsDisabled: PropTypes.bool,
});

class Rubric extends React.Component {
  dudUrl = 'javascript:;';

  constructor(props) {
    super(props);
    this.state = {
      rubricOpen: false,
      linkPrefix: 'Show',
    };
    this.toggleRubric = this.toggleRubric.bind(this);
  }

  static propTypes = {
    model: PropTypes.object.isRequired,
    animationsDisabled: PropTypes.bool,
    value: RubricType,
  };

  toggleRubric() {
    this.setState({ rubricOpen: !this.state.rubricOpen });
    this.setState({ linkPrefix: this.state.rubricOpen ? 'Show' : 'Hide' });
  }

  shouldRenderPoint = (index, value) => {
    if (!value.excludeZero) {
      return true;
    } else {
      return index !== 0;
    }
  };

  render() {
    const { model, value } = this.props;
    let { animationsDisabled } = this.props;
    animationsDisabled = animationsDisabled || value.animationsDisabled;

    if (value && value.points) {
      const { extraCSSRules } = model || {};
      const { points, sampleAnswers } = value;

      const rubricList = (
        <List component="nav">
          {points
            .slice(0)
            .reverse()
            .map((desc, index) => {
              index = points.length - index - 1;
              const pointsLabel = value.excludeZero ? index + 1 : index;

              return (
                <React.Fragment key={index}>
                  <StyledListItem key={`P${index}`}>
                    <TitleText>
                      {pointsLabel === 1 ? `${pointsLabel} PT` : `${pointsLabel} PTS`}
                    </TitleText>
                    <Text dangerouslySetInnerHTML={{ __html: desc }} />
                  </StyledListItem>

                  {sampleAnswers && sampleAnswers[index] && (
                    <StyledListItem key={`S${index}`}>
                      <SampleTitleText>
                        Sample Answer
                      </SampleTitleText>
                      <Text dangerouslySetInnerHTML={{ __html: sampleAnswers[index] }} />
                    </StyledListItem>
                  )}
                </React.Fragment>
              );
            })}
        </List>
      );

      return (
        <StyledUiLayout extraCSSRules={extraCSSRules}>
          {/* screen reader only heading for navigation as per PD-5057 */}
          <HiddenScreenReader>Rubric</HiddenScreenReader>
          {!animationsDisabled ? (
            <React.Fragment>
              <RubricToggle
                id={'rubric-toggle'}
                tabIndex={0}
                role="button"
                aria-expanded={this.state.rubricOpen}
                onClick={this.toggleRubric}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') this.toggleRubric();
                }}
              >
                {this.state.linkPrefix} Rubric
                <ChevronStyle aria-hidden="true">
                  {this.state.rubricOpen ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </ChevronStyle>
              </RubricToggle>
              <Collapse in={this.state.rubricOpen} timeout={{ enter: 225, exit: 195 }}>
                {rubricList}
              </Collapse>
            </React.Fragment>
          ) : (
            rubricList
          )}
        </StyledUiLayout>
      );
    } else {
      return null;
    }
  }
}

export default Rubric;
