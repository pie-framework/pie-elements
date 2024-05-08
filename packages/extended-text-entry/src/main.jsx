import React from 'react';
import {EditableHtml} from '@pie-lib/pie-toolbox/editable-html';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import debounce from 'lodash/debounce';
import { color, Feedback, Collapsible, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import classnames from 'classnames';

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
    onChange: PropTypes.func.isRequired,
    model: PropTypes.object,
    classes: PropTypes.object.isRequired,
    session: PropTypes.shape({
      value: PropTypes.string,
    }).isRequired,
  };

  changeSession = debounce(this.props.onChange, 1500);

  render() {
    const { model, classes, session } = this.props;

    const {
      dimensions,
      disabled,
      feedback,
      teacherInstructions,
      mathInput,
      spanishInput,
      specialInput,
      animationsDisabled,
      playersToolbarPosition,
      spellCheckEnabled,
    } = model;
    const { value } = session;
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

        {model.prompt && (
          <Typography component={'span'} className={classes.prompt}>
            <PreviewPrompt defaultClassName="prompt" prompt={model.prompt} />
          </Typography>
        )}

        <EditableHtml
          className={classnames(classes.editor, 'response-area-editor')}
          onChange={this.changeSession}
          markup={value || ''}
          width={width && width.toString()}
          minHeight={height && height.toString()}
          maxHeight={maxHeight}
          disabled={disabled}
          highlightShape={true}
          toolbarOpts={toolbarOpts}
          spellCheck={spellCheckEnabled}
          charactersLimit={50000}
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

        {feedback && <Feedback correctness="correct" feedback={feedback} />}
      </div>
    );
  }
}

export default withStyles(style)(Main);
