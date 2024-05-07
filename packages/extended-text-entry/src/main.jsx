import React from 'react';
import {EditableHtml} from '@pie-lib/pie-toolbox/editable-html';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import debounce from 'lodash/debounce';
import { color, Feedback, Collapsible, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import classnames from 'classnames';
import AnnotationEditor from './annotation/annotation-editor';

const log = debug('@pie-ui:extended-text-entry');

const style = (theme) => ({
  main: {
    backgroundColor: color.background(),
    color: color.text(),
  },
  prompt: {
    width: '100%',
    color: color.text(),
    marginBottom: theme.spacing.unit * 2,
    fontSize: 'inherit',
  },
  teacherInstructions: {
    marginBottom: theme.spacing.unit * 2,
  },
  editor: {
    marginBottom: theme.spacing.unit * 2,
    borderRadius: '4px',
  },
  srOnly: {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
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
      playersToolbarPosition,
      predefinedAnnotations,
      prompt,
      spanishInput,
      specialInput,
      spellCheckEnabled,
      teacherInstructions,
    } = model;
    const { annotations, comment, value } = session;
    const { width, height } = dimensions || {};
    const maxHeight = '40vh';
    const toolbarOpts = { position: playersToolbarPosition === 'top' ? 'top' : 'bottom' };

    log('[render] disabled? ', disabled);

    const teacherInstructionsDiv = (
      <PreviewPrompt defaultClassName="teacher-instructions" prompt={teacherInstructions} />
    );

    const languageCharactersProps = [];

    if (spanishInput) {
      languageCharactersProps.push({ language: 'spanish' });
    }

    if (specialInput) {
      languageCharactersProps.push({ language: 'special' });
    }

    return (
      <div
        className={classes.main}
        ref={(ref) => {
          this.containerRef = ref;
        }}
      >
        <h2 className={classes.srOnly}>Constructed Response Question</h2>

        {teacherInstructions && (
          <div className={classes.teacherInstructions}>
            {!animationsDisabled ? (
              <Collapsible
                labels={{ hidden: 'Show Teacher Instructions', visible: 'Hide Teacher Instructions' }}
                className={classes.collapsible}
              >
                {teacherInstructionsDiv}
              </Collapsible>
            ) : (
              teacherInstructionsDiv
            )}
          </div>
        )}

        {prompt && (
          <Typography component={'span'} className={classes.prompt}>
            <PreviewPrompt defaultClassName="prompt" prompt={model.prompt} />
          </Typography>
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
        <EditableHtml
          className={classnames(classes.editor, 'response-area-editor')}
          onChange={this.changeSessionValue}
          markup={value || ''}
          width={width && width.toString()}
          minHeight={height && height.toString()}
          maxHeight={maxHeight}
          disabled={disabled}
          highlightShape={true}
          toolbarOpts={toolbarOpts}
          spellCheck={spellCheckEnabled}
          pluginProps={{
            math: {
              disabled: !mathInput,
              customKeys: this.props.model.customKeys,
              keypadMode: this.props.model.equationEditor,
              controlledKeypadMode: false,
            },
            video: {
              disabled: true,
            },
            audio: {
              disabled: true,
            },
          }}
          languageCharactersProps={languageCharactersProps}
        />
        )}

        {feedback && <Feedback correctness="correct" feedback={feedback} />}
      </div>
    );
  }
}

export default withStyles(style)(Main);
