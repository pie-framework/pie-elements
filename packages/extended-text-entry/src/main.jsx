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
import AnnotationEditor from './annotation/annotation-editor';

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
    onValueChange: PropTypes.func.isRequired,
    onAnnotationsChange: PropTypes.func.isRequired,
    onCommentChange: PropTypes.func.isRequired,
    model: PropTypes.object,
    classes: PropTypes.object.isRequired,
    session: PropTypes.shape({
      value: PropTypes.string,
      annotations: PropTypes.array,
      comment: PropTypes.string
    }).isRequired
  };

  componentDidUpdate() {
    if (this.containerRef) {
      renderMath(this.containerRef);
    }
  }

  changeSessionValue = debounce(this.props.onValueChange, 1500);

  changeSessionComment = debounce(this.props.onCommentChange, 1500);

  render() {
    const { model, classes, session, onAnnotationsChange } = this.props;
    const {
      animationsDisabled,
      annotatorMode,
      customKeys,
      dimensions,
      disabled,
      disabledAnnotator,
      equationEditor,
      feedback,
      mathInput,
      predefinedAnnotations,
      prompt,
      teacherInstructions
    } = model;
    const { annotations, comment, value } = session;
    const { width, height } = dimensions || {};
    const maxHeight = '40vh';
    log('[render] disabled? ', disabled);

    const teacherInstructionsDiv = <div
      className="teacher-instructions"
      dangerouslySetInnerHTML={{ __html: teacherInstructions }}
    />;

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
                  labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
                  className={classes.collapsible}
                >
                  {teacherInstructionsDiv}
                </Collapsible>
              ) : teacherInstructionsDiv }
              <br/>
            </div>
          )
        }
        {prompt && (
          <Typography
            className={classNames(classes.prompt, 'prompt')}
            dangerouslySetInnerHTML={{ __html: prompt }}
          />
        )}
        {annotatorMode ? (
          <AnnotationEditor
            text={value || ''}
            annotations={annotations || []}
            comment={comment || ''}
            predefinedAnnotations={predefinedAnnotations || []}
            onChange={onAnnotationsChange}
            onCommentChange={this.changeSessionComment}
            width={width}
            height={height}
            maxHeight={maxHeight}
            disabled={disabledAnnotator}
            disabledMath={!mathInput}
            customKeys={customKeys}
            keypadMode={equationEditor}
          />
        ) : (
          <EditableHTML
            onChange={this.changeSessionValue}
            markup={value || ''}
            width={width && width.toString()}
            minHeight={height && height.toString()}
            maxHeight={maxHeight}
            disabled={disabled}
            highlightShape={true}
            pluginProps={{
              math: {
                disabled: !mathInput,
                customKeys: customKeys,
                keypadMode: equationEditor,
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
        )}
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
