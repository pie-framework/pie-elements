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
import AnnotationEditor from './annotation-editor';

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
    const { model, classes, session, onAnnotationsChange, onCommentChange } = this.props;
    const {
      annotatorEnabled,
      dimensions,
      disabled,
      disabledAnnotator,
      feedback,
      teacherInstructions,
      mathInput,
      animationsDisabled,
      predefinedAnnotations
    } = model;
    const { annotations, comment, value } = session;
    const { width, height } = dimensions || {};
    const maxHeight = '40vh';
    log('[render] disabled? ', disabled);

    const teacherInstructionsDiv = <div
      className="teacher-instructions"
      dangerouslySetInnerHTML={{ __html: teacherInstructions }}
    />;

    const testValue = '<div><p>Ana <b>are mere</b>. Alex nu <b>are</b> mere.<br/></p><div><p><em>Alex</em> doreste mere.</p></div><p>Alex merge la magazin, <div> <div></div><u>dar cumpara</u> bere. </p><p>new line 1</p><p>new line 2</p><p>new line 3</p><p>new line 4</p><p>new line 5</p><p>new line 6</p><p>new line 7</p><p>new line 8 </p><p>new line 9 </p><p>new line 10</p><p>new line 11</p><p>new line 12</p><p>new line 13</p><p>new line 14</p><p>new line 15</p><p>new line 16</p></div>'
    const testAnnotations = [
      {
        "id": "a28f92db-0361-4ee0-8648-16a593b3b423",
        "label": "punctuation",
        "type": "positive",
        "text": "are mer",
        "start": 4,
        "end": 11
      },
      {
        "id": "0dbabc16-f726-48ce-bd39-c55def7b4093",
        "label": "01234567890123456789",
        "type": "negative",
        "text": "magazin",
        "start": 63,
        "end": 70
      },
      {
        "id": "3f3a3cad-247e-4c1e-bb90-670ba2113852",
        "label": "punctuation",
        "type": "positive",
        "text": "ex dor",
        "start": 33,
        "end": 39
      }
    ];

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
                  {teacherInstructionsDiv}
                </Collapsible>
              ) : teacherInstructionsDiv }
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
        {annotatorEnabled ? (
          <AnnotationEditor
            text={value || ''}
            annotations={annotations || testAnnotations}
            comment={comment || ''}
            predefinedAnnotations={predefinedAnnotations}
            onChange={onAnnotationsChange}
            onCommentChange={onCommentChange}
            width={width}
            height={height}
            maxHeight={maxHeight}
            disabled={disabledAnnotator}
          />
        ) : (
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
