import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
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
      const { extraCSSRules } = model;
      const { points, sampleAnswers } = value;

      const rubricList = (
        <List component="nav">
          {points
            .slice(0)
            .reverse()
            .map((desc, index) => {
              index = points.length - index - 1;
              const pointsLabel = value.excludeZero ? index + 1: index;

              return (
                  <React.Fragment key={index}>
                    <ListItem key={`P${index}`}>
                      <ListItemText
                          className={classes.rubricCol}
                          primary={<div className={classes.text}>{pointsLabel === 1 ? `${pointsLabel} PT` : `${pointsLabel} PTS`}</div>}
                      />

                      <ListItemText
                          primary={<div className={classes.text} dangerouslySetInnerHTML={{ __html: desc }} />}
                      />
                    </ListItem>

                    {sampleAnswers && sampleAnswers[index] && (
                        <ListItem key={`S${index}`}>
                          <ListItemText
                              className={classes.rubricCol}
                              style={{ marginLeft: '20px' }}
                              primary={<div className={classes.text}>Sample Answer</div>}
                          />

                          <ListItemText
                              primary={
                                <div className={classes.text} dangerouslySetInnerHTML={{ __html: sampleAnswers[index] }} />
                              }
                          />
                        </ListItem>
                    )}
                  </React.Fragment>
              );
            })}
        </List>
      );

      return (
        <UiLayout extraCSSRules={extraCSSRules} className={classes.root}>
          {!animationsDisabled ? (
            <React.Fragment>
              <Link href={this.dudUrl} onClick={this.toggleRubric}>
                {this.state.linkPrefix} Rubric
              </Link>
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

const styles = () => ({
  root: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  rubricCol: {
    flex: '0 1 auto',
    minWidth: 'fit-content',
  },
  text: {
    color: color.text(),
  },
});

export default withStyles(styles)(Rubric);
