import React from 'react';
import EditableHTML from '@pie-lib/editable-html';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import debounce from 'lodash/debounce';
import { color, Feedback, Collapsible } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import classNames from 'classnames';

const log = debug('@pie-ui:extended-text-entry');

const style = theme => ({
  main: {
    backgroundColor: color.background(),
    color: color.text()
  },
  prompt: {
    width: '100%',
    color: color.text(),
    marginBottom: theme.spacing.unit * 2,
    fontSize: 'inherit'
  }
});

export class Main extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    model: PropTypes.object,
    classes: PropTypes.object.isRequired,
    session: PropTypes.shape({
      value: PropTypes.string
    }).isRequired
  };

  componentDidUpdate() {
    if (this.containerRef) {
      renderMath(this.containerRef);
    }
  }

  changeSession = debounce(this.props.onChange, 1500);

  render() {
    const { model, classes, session } = this.props;
    const { dimensions, disabled, feedback, teacherInstructions, mathInput, animationsDisabled } = model;
    const { value } = session;
    const { width, height } = dimensions || {};
    const maxHeight = '40vh';
    log('[render] disabled? ', disabled);

    return (
      <div
        className={classes.main}
        ref={ref => {
          this.containerRef = ref;
        }}
      >
        {
          teacherInstructions && (
            <div>
              {!animationsDisabled ? (
                <Collapsible
                  labels={{hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions'}}
                  className={classes.collapsible}
                >
                  <div dangerouslySetInnerHTML={{ __html: teacherInstructions }}/>
                </Collapsible>
              ) : <div className="teacher-instructions" dangerouslySetInnerHTML={{ __html: teacherInstructions }}/> }
              <br/>
            </div>
          )
        }
        {model.prompt && (
          <Typography
            className={classNames(classes.prompt, 'prompt')}
            dangerouslySetInnerHTML={{ __html: model.prompt }}
          />
        )}
        <EditableHTML
          onChange={this.changeSession}
          markup={value || ''}
          width={width && width.toString()}
          minHeight={height && height.toString()}
          maxHeight={maxHeight}
          disabled={disabled}
          highlightShape={true}
          pluginProps={{
            math: {
              disabled: !mathInput,
              customKeys: this.props.model.customKeys,
              keypadMode: this.props.model.equationEditor,
              controlledKeypadMode: false
            },
            video: {
              disabled: true
            },
             audio: {
              disabled: true
            }
          }}
        />
        {feedback && (
          <div>
            <br />
            <Feedback correctness="correct" feedback={feedback}/>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(style)(Main);
