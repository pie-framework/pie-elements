import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible, color, hasText, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onSessionChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  render() {
    const { model, classes } = this.props;
    const {
      prompt,
      rationale,
      teacherInstructions,
      animationsDisabled,
      alwaysShowCorrect
    } = model;


    const teacherInstructionsDiv = (
      <PreviewPrompt defaultClassName="teacher-instructions" prompt={teacherInstructions} />
    );

    const rationaleDiv = <PreviewPrompt prompt={rationale} />;

    const mainClasses = classNames([
      classes.mainContainer,
      {
        [classes.noBorderColor]: alwaysShowCorrect,
      },
    ]);

    return (
      <div className={mainClasses}>
        {teacherInstructions && hasText(teacherInstructions) && (
          <div className={classes.collapsible}>
            {!animationsDisabled ? (
              <Collapsible labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}>
                {teacherInstructionsDiv}
              </Collapsible>
            ) : (
              teacherInstructionsDiv
            )}
          </div>
        )}
        {prompt && <PreviewPrompt prompt={prompt} />}

        {rationale && hasText(rationale) && (
          <div className={classes.collapsible}>
            {!animationsDisabled ? (
              <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>{rationaleDiv}</Collapsible>
            ) : (
              rationaleDiv
            )}
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(Main);

