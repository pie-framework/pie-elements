import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Collapsible, hasText } from '@pie-lib/render-ui';
import Container from './container';
import { withStyles } from '@material-ui/core/styles';

class HotspotComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCorrect: false
    };
  }

  onToggle = () => {
    const { showCorrect } = this.state;
    this.setState({ showCorrect: !showCorrect });
  };

  render() {
    const {
      session,
      model: {
        disabled,
        imageUrl,
        prompt,
        mode,
        multipleCorrect,
        shapes,
        outlineColor,
        hotspotColor,
        dimensions,
        rationale,
        teacherInstructions,
        strokeWidth
      },
      onSelectChoice,
      classes
    } = this.props;

    const isEvaluateMode = mode === 'evaluate';

    return (
      <div>
        {
          teacherInstructions && hasText(teacherInstructions) && (
            <Collapsible
              labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
              className={classes.collapsible}
            >
              <div dangerouslySetInnerHTML={{ __html: teacherInstructions }}/>
            </Collapsible>
          )
        }

        <Typography className={classes.prompt}>
          <span dangerouslySetInnerHTML={{ __html: prompt }} />
        </Typography>

        {imageUrl ? (
          <Container
            isEvaluateMode={isEvaluateMode}
            session={session}
            dimensions={dimensions}
            imageUrl={imageUrl}
            hotspotColor={hotspotColor}
            multipleCorrect={multipleCorrect}
            outlineColor={outlineColor}
            onSelectChoice={onSelectChoice}
            shapes={shapes}
            disabled={disabled}
            strokeWidth={strokeWidth}
          />
        ) : null}

        {
          rationale && hasText(rationale) && (
            <Collapsible
              labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}
              className={classes.collapsible}
            >
              <div dangerouslySetInnerHTML={{ __html: rationale }} />
            </Collapsible>
          )
        }

      </div>
    );
  }
}

HotspotComponent.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object.isRequired,
  onSelectChoice: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired
};

HotspotComponent.defaultProps = {
  classes: {}
};

const styles = theme => ({
  collapsible: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  prompt: {
    fontSize: 'inherit'
  }
});

export default withStyles(styles)(HotspotComponent);
