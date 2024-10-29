import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';
import { ConstructedResponse } from '@pie-lib/pie-toolbox/mask-markup';
import { color, Collapsible, hasText, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Translator from '@pie-lib/pie-toolbox/translator';

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
    responseAreaInputConfiguration: PropTypes.object
  };

  static defaultProps = {
    value: {},
  };

  state = {
    showCorrectAnswer: this.props.alwaysShowCorrect || false,
    value: this.props.value,
  };

  // if for all responses max length is 1, call onChange for each keystroke
  getChangeSession = (maxLengthPerChoice) =>
    maxLengthPerChoice && maxLengthPerChoice.every((val, i, arr) => val === arr[0] && val === 1)
      ? this.props.onChange
      : debounce(this.props.onChange, 1500, { maxWait: 1500 });

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
    this.setState({ value });

    this.changeSession(value);
  };

  render() {
    const { showCorrectAnswer, value } = this.state;
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
    } = this.props;

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

    return (
      <div className={mainClasses} style={{ display: `${displayType}` }}>
        {mode === 'gather' && <h2 className={classes.srOnly}>Fill in the Blank Question</h2>}

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
