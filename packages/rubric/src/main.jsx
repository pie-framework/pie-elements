import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import { color, UiLayout } from '@pie-lib/pie-toolbox/render-ui';
import PropTypes from 'prop-types';

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
    classes: PropTypes.object.isRequired,
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
    const { model, value, classes } = this.props;
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
                  <ListItem key={`P${index}`} className={classes.listColumn}>
                    <h3 className={classes.titleText}>
                      {pointsLabel === 1 ? `${pointsLabel} PT` : `${pointsLabel} PTS`}
                    </h3>
                    <div className={classes.text} dangerouslySetInnerHTML={{ __html: desc }} />
                  </ListItem>

                  {sampleAnswers && sampleAnswers[index] && (
                    <ListItem key={`S${index}`} className={classes.listColumn}>
                      <h4 className={classes.titleText} style={{ fontWeight: 'normal' }}>
                        Sample Answer
                      </h4>
                      <div className={classes.text} dangerouslySetInnerHTML={{ __html: sampleAnswers[index] }} />
                    </ListItem>
                  )}
                </React.Fragment>
              );
            })}
        </List>
      );

      return (
        <UiLayout extraCSSRules={extraCSSRules} className={classes.root}>
          {/* screen reader only heading for navigation as per PD-5057 */}
          <h2 className={classes.hiddenScreenReader}>Rubric</h2>
          {!animationsDisabled ? (
            <React.Fragment>
              <h2
                id={'rubric-toggle'}
                className={classes.rubricToggle}
                tabIndex={0}
                role="button"
                aria-expanded={this.state.rubricOpen}
                onClick={this.toggleRubric}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') this.toggleRubric();
                }}
              >
                {this.state.linkPrefix} Rubric
                <span className={classes.chevronStyle} aria-hidden="true">
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
                </span>
              </h2>
              <Collapse in={this.state.rubricOpen} timeout="auto">
                {rubricList}
              </Collapse>
            </React.Fragment>
          ) : (
            rubricList
          )}
        </UiLayout>
      );
    } else {
      return null;
    }
  }
}

const styles = (theme) => ({
  root: {
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
  },
  listColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '12px 0px',
  },
  listColumnItem: {
    padding: 0,
  },
  text: {
    color: color.text(),
  },
  titleText: {
    color: color.text(),
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    paddingBottom: '6px',
  },
  rubricToggle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: theme.typography.fontSize,
    fontWeight: '500',
    color: color.tertiary(),
    margin: 0,
  },
  chevronStyle: {
    display: 'inline-flex',
    transition: 'transform 0.2s',
    marginLeft: 2,
    alignSelf: 'center',
  },
  hiddenScreenReader: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0,
    whiteSpace: 'nowrap',
  },
});

export default withStyles(styles)(Rubric);
