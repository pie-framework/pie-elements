import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';
import { ConstructedResponse } from '@pie-lib/mask-markup';
import { color, Collapsible, hasText, hasMedia, PreviewPrompt, UiLayout } from '@pie-lib/render-ui';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

export class Main extends React.Component {
  static propTypes = {
    alwaysShowCorrect: PropTypes.bool,
    animationsDisabled: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    displayType: PropTypes.string,
    feedback: PropTypes.object,
    language: PropTypes.string,
    markup: PropTypes.string,
    maxLengthPerChoice: PropTypes.array,
    maxLengthPerChoiceEnabled: PropTypes.bool,
    mode: PropTypes.string,
    note: PropTypes.string,
    onChange: PropTypes.func,
    playerSpellCheckEnabled: PropTypes.bool,
    prompt: PropTypes.string,
    rationale: PropTypes.string,
    role: PropTypes.string,
    showNote: PropTypes.bool,
    teacherInstructions: PropTypes.string,
    value: PropTypes.object,
    responseAreaInputConfiguration: PropTypes.object,
    model: PropTypes.object.isRequired,
  };

  static defaultProps = {
    value: {},
  };

  state = {
    showCorrectAnswer: this.props.alwaysShowCorrect || false,
  };

  // if for all responses max length is 1, call onChange for each keystroke
  getChangeSession = (maxLengthPerChoice) =>
    maxLengthPerChoice && maxLengthPerChoice.every((val, i, arr) => val === arr[0] && val === 1)
      ? this.props.onChange
      : debounce(this.props.onChange, 200, { maxWait: 200 });

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { maxLengthPerChoice, language } = this.props;
    let { note } = this.props;

    if (isEmpty(nextProps.feedback)) {
      this.setState({ showCorrectAnswer: false });
    }

    if (nextProps.alwaysShowCorrect) {
      this.setState({ showCorrectAnswer: true });
    }

    if (maxLengthPerChoice && !isEqual(maxLengthPerChoice, nextProps.maxLengthPerChoice)) {
      this.changeSession = this.getChangeSession(nextProps.maxLengthPerChoice);
    }

    // check if the note is the default one for prev language and change to the default one for new language
    // this check is necessary in order to diferanciate between default and authour defined note
    // and only change between languages for default ones
    if (
      note &&
      language &&
      language !== nextProps.language &&
      note === translator.t('common:commonCorrectAnswerWithAlternates', { lng: language })
    ) {
      note = translator.t('common:commonCorrectAnswerWithAlternates', { lng: nextProps.language });
    }
  }

  toggleShowCorrect = () => {
    this.setState({ showCorrectAnswer: !this.state.showCorrectAnswer });
  };

  changeSession = this.getChangeSession(this.props.maxLengthPerChoice);

  onChange = (value) => {
    this.changeSession(value);
  };

  render() {
    const { showCorrectAnswer } = this.state;
    const {
      alwaysShowCorrect,
      animationsDisabled,
      classes,
      mode,
      displayType,
      role,
      language,
      maxLengthPerChoice,
      maxLengthPerChoiceEnabled,
      note,
      playerSpellCheckEnabled,
      prompt,
      rationale,
      showNote,
      teacherInstructions,
      responseAreaInputConfiguration,
      model,
      value,
    } = this.props;

    const { extraCSSRules } = model || {};
    const displayNote = (showCorrectAnswer || (mode === 'view' && role === 'instructor')) && showNote && note;
    const mainClasses = classNames([
      classes.mainContainer,
      {
        [classes.noBorderColor]: alwaysShowCorrect,
      },
    ]);

    const teacherInstructionsDiv = (
      <PreviewPrompt defaultClassName="teacher-instructions" prompt={teacherInstructions} />
    );

    const rationaleDiv = <PreviewPrompt prompt={rationale} />;

    const showRationale = rationale && (hasText(rationale) || hasMedia(rationale));
    const showTeacherInstructions =
      teacherInstructions && (hasText(teacherInstructions) || hasMedia(teacherInstructions));

    return (
      <UiLayout extraCSSRules={extraCSSRules} className={mainClasses} style={{ display: `${displayType}` }}>
        {mode === 'gather' && <h2 className={classes.srOnly}>Fill in the Blank Question</h2>}

        {showTeacherInstructions && (
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

        {!alwaysShowCorrect && (
          <CorrectAnswerToggle
            show={mode === 'evaluate'}
            toggled={showCorrectAnswer}
            onToggle={this.toggleShowCorrect}
            language={language}
          />
        )}

        <ConstructedResponse
          {...this.props}
          onChange={this.onChange}
          showCorrectAnswer={showCorrectAnswer}
          value={value}
          maxLength={maxLengthPerChoice}
          adjustedLimit={maxLengthPerChoiceEnabled}
          spellCheck={playerSpellCheckEnabled}
          pluginProps={responseAreaInputConfiguration}
        />

        {displayNote && <div className={classNames(classes.note, 'note')} dangerouslySetInnerHTML={{ __html: note }} />}

        {showRationale && (
          <div className={classes.collapsible}>
            {!animationsDisabled ? (
              <Collapsible labels={{ hidden: 'Show Rationale', visible: 'Hide Rationale' }}>{rationaleDiv}</Collapsible>
            ) : (
              rationaleDiv
            )}
          </div>
        )}
      </UiLayout>
    );
  }
}

const styles = (theme) => ({
  mainContainer: {
    color: color.text(),
    backgroundColor: color.background(),
  },
  inlineDisplay: {
    display: 'inline-block',
  },
  blockDisplay: {
    display: 'block',
  },
  note: {
    marginBottom: theme.spacing.unit * 2,
  },
  collapsible: {
    marginBottom: theme.spacing.unit * 2,
  },
  noBorderColor: {
    '& *': {
      borderColor: `${color.text()} !important`,
    },
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

export default withStyles(styles)(Main);
