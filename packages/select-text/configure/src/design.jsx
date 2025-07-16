import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { Tokenizer, Controls } from '@pie-lib/pie-toolbox/text-select';
import { InputContainer, NumberTextField, FeedbackConfig, settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import Chip from '@material-ui/core/Chip';
import Info from '@material-ui/icons/Info';
import debug from 'debug';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import Tooltip from '@material-ui/core/Tooltip';
import { clearSelection, generateValidationMessage } from './utils';
// import {
//   clearSelection,
//   getDOMNodes,
//   getLabelElement,
//   getRangeDetails,
//   isSideLabel,
//   wrapRange,
// } from '@pie-element/extended-text-entry/src/annotation/annotation-utils';
import classNames from 'classnames';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const { Panel, toggle, radio, dropdown } = settings;

const log = debug('@pie-element:select-text:configure');

export class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.object,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    const { model } = this.props;

    this.state = {
      correctMode: false,
      selectMode: false,
      text: (model && model.text) || '',
      tokenizedText: (model && model.token) || '',
    };
  }

  UNSAFE_componentWillReceiveProps(nProps) {
    const { model } = nProps;

    if (model && model.text) {
      this.setState({
        text: model.text,
        tokenizedText: model.text,
      });

      // model.tokens.forEach((annotation) => {
      //   console.log('annotation', annotation);
      //   const [domStart, domEnd] = getDOMNodes(annotation.start, annotation.end, this.textRef);
      //   console.log('domStart, domEnd', domStart, domEnd);
      //
      //   if (domStart && domEnd) {
      //     const range = document.createRange();
      //
      //     range.setStart(domStart.node, domStart.offset);
      //     range.setEnd(domEnd.node, domEnd.offset);
      //
      //     const spans = wrapRange(range);
      //
      //     this.createDOMAnnotation(spans, annotation);
      //   }
      // });
    }
  }

  updateText = debounce((val) => {
    this.apply((u) => {
      u.text = val;
      u.tokens = [];
    });
  }, 200);

  changeText = (text) => {
    this.updateText(text);
    this.clearTokens();
  };

  changeTextEvent = (event) => this.updateText(event.target.value);

  changeTokens = (tokens, mode) => {
    this.apply((u) => {
      u.tokens = tokens;
      u.mode = mode;

      const correctTokenCount = tokens.filter((t) => t.correct).length;
      const max = isFinite(u.maxSelections) ? u.maxSelections : 0;

      u.maxSelections = Math.max(max, correctTokenCount);
    });
  };

  changeMaxSelections = (event, max) => {
    this.apply((u) => (u.maxSelections = max));
  };

  apply = (fn) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    fn(update);
    onModelChanged(update);
  };

  changeFeedback = (feedback) => {
    this.apply((u) => (u.feedback = feedback));
  };

  changePartialScoring = (partialScoring) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);
    update.partialScoring = partialScoring;

    onModelChanged(update);
  };

  onPromptChanged = (prompt) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    update.prompt = prompt;
    onModelChanged(update);
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    update.teacherInstructions = teacherInstructions;
    onModelChanged(update);
  };

  onRationaleChanged = (rationale) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, rationale });
  };

  // Highlight functionalities based on extended-text-entry

  createDOMAnnotation = (elems, annotation) => {
    const { classes } = this.props;
    const { id } = annotation;

    (elems || []).forEach((elem) => {
      elem.dataset.id = id;
      elem.className = classNames(classes.token);
      // elem.onclick = !disabled && this.handleClick;
      // elem.onmouseover = this.handleHover;
      // elem.onmouseout = this.handleCancelHover;
    });
  };

  createNewAnnotation = (selectedElems, selectionDetails) => {
    const annotation = {
      id: [selectionDetails.start, selectionDetails.end, new Date().getTime()].join('-'),
      ...selectionDetails,
    };

    this.createDOMAnnotation(selectedElems, annotation);

    return annotation;
  };

  // addAnnotation = (type) => {
  //   const { annotations, onChange } = this.props;
  //   const annotation = this.createNewAnnotation('', type);
  //   const labelElem = getLabelElement(annotation.id);
  //
  //   annotations.push(annotation);
  //
  //   this.setState({
  //     openedMenu: false,
  //     openedEditor: true,
  //     annotationIndex: annotations.length - 1,
  //     annotation,
  //     labelElem,
  //   });
  //
  //   onChange(annotations);
  // };

  // new functionalities

  wrapWordsInSpans(html, onClick) {
    const { classes } = this.props;
    const container = document.createElement('div');
    container.innerHTML = html;

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+|\b)/); // split by word boundaries + spaces
        const fragment = document.createDocumentFragment();

        for (const word of words) {
          if (word.trim()) {
            const span = document.createElement('span');

            span.className = classNames(classes.token);
            span.addEventListener('click', (e) => onClick(e));
            span.textContent = word;
            fragment.appendChild(span);
          } else {
            fragment.appendChild(document.createTextNode(word));
          }
        }

        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(processNode);
      }
    };

    Array.from(container.childNodes).forEach(processNode);

    return container.innerHTML;
  }

  wrapSentencesInSpans = (html, onClickHandler = null) => {
    const { classes } = this.props;
    const container = document.createElement('div');
    container.innerHTML = html;

    const splitSentences = (text) => {
      // Match sentences ending with punctuation:
      // "." or "!" or "?"
      const pattern = /([^.!?]+[.!?]+[\s"]*)|([^.!?]+$)/g;
      const matches = text.match(pattern);
      return matches || [];
    };

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const sentences = splitSentences(node.textContent);
        const fragment = document.createDocumentFragment();

        for (const sentence of sentences) {
          if (sentence.trim()) {
            const span = document.createElement('span');
            span.textContent = sentence;
            span.className = classNames(classes.token);

            if (onClickHandler) {
              span.addEventListener('click', (e) => {
                onClickHandler(e, sentence);
              });
            }

            fragment.appendChild(span);
          } else {
            fragment.appendChild(document.createTextNode(sentence));
          }
        }

        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(processNode);
      }
    };

    Array.from(container.childNodes).forEach(processNode);

    return container;
  };

  wrapParagraphContentInSpan(html) {
    const { classes } = this.props;
    const container = document.createElement('div');
    container.innerHTML = html;

    container.querySelectorAll('p').forEach((p) => {
      const span = document.createElement('span');
      span.className = classNames(classes.token);
      span.addEventListener('click', this.handleTokenClick);

      // Move all children of <p> into the span
      while (p.firstChild) {
        span.appendChild(p.firstChild);
      }

      p.appendChild(span);
    });

    return container;
  }

  wrapSelectionInSpan(selection) {
    const { classes } = this.props;
    const range = selection.getRangeAt(0);

    if (range.collapsed) {
      console.log('Selection is collapsed (no text selected).');
      return;
    }

    // Extract the contents of the selection
    const contents = range.extractContents();

    // Create the span wrapper
    const span = document.createElement('span');
    span.className = classNames(classes.token);
    span.addEventListener('click', this.handleTokenClick);
    span.appendChild(contents);

    // Insert back into the DOM
    range.insertNode(span);

    // Collapse the selection
    selection.removeAllRanges();
  }

  handleSelection = (event) => {
    const selection = window.getSelection();

    // prevent unwanted selections
    if (event.detail > 2) {
      clearSelection();
      return;
    }

    if (selection && selection.rangeCount > 0) {
      this.wrapSelectionInSpan(selection);
      clearSelection();
    }
  };

  handleTokenClick = (event) => {
    const { correctMode } = this.state;

    if (!correctMode) {
      return;
    }

    event.target.classList.toggle('correct');
  };

  clearTokens = () => {
    const { model } = this.props;

    const container = document.createElement('div');
    container.innerHTML = model.text;

    // Remove all children and add new content
    this.textRef.innerHTML = '';
    this.textRef.appendChild(container);

    this.setState({ tokenizedText: model.text });
  };

  selectWords = () => {
    const { text } = this.state;
    this.clearTokens();
    const tokenized = this.wrapWordsInSpans(text, (e) => this.handleTokenClick(e));

    console.log('words:', tokenized);

    this.setState({ tokenizedText: tokenized });
  };

  selectSentences = () => {
    const { text } = this.state;
    this.clearTokens();
    const container = this.wrapSentencesInSpans(text);

    // Remove all children and add new content
    this.textRef.innerHTML = '';
    this.textRef.appendChild(container);

    const tokenized = container.innerHTML;
    console.log('sentences:', tokenized);
    // this.setState({ tokenizedText: tokenized });
  };

  selectParagraphs = () => {
    const { text } = this.state;
    this.clearTokens();
    const container = this.wrapParagraphContentInSpan(text);

    // Remove all children and add new content
    this.textRef.innerHTML = '';
    this.textRef.appendChild(container);

    const tokenized = container.innerHTML;
    console.log('paragraphs:', tokenized);
    // this.setState({ tokenizedText: tokenized });
  };

  render() {
    const { text: textValue, correctMode, selectMode, tokenizedText } = this.state;
    const { classes, configuration, imageSupport, model, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;
    const {
      baseInputConfiguration = {},
      correctAnswer = {},
      contentDimensions = {},
      feedback = {},
      highlightChoices = {},
      mode = {},
      partialScoring = {},
      prompt = {},
      rationale = {},
      selectionCount = {},
      selections = {},
      settingsPanelDisabled,
      scoringType = {},
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      text = {},
      tokens = {},
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
    } = configuration || {};
    const {
      errors,
      extraCSSRules,
      feedbackEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};

    const {
      prompt: promptError,
      rationale: rationaleError,
      selectionsError,
      teacherInstructions: teacherInstructionsError,
      tokensError,
    } = errors || {};
    const validationMessage = generateValidationMessage(configuration);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    let { tokens: tokensModel } = model;
    tokensModel = tokensModel || [];

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    log('[render] maxSelections:', model.maxSelections);

    const panelSettings = {
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      highlightChoices: highlightChoices.settings && toggle(highlightChoices.label),
      feedbackEnabled: feedback.settings && toggle(feedback.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    return (
      <layout.ConfigLayout
        extraCSSRules={extraCSSRules}
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => onModelChanged(model)}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(configuration?.teacherInstructions?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label || ''} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChanged}
              imageSupport={imageSupport}
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(configuration?.prompt?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        {/*{text.settings && (*/}
        {/*  <InputContainer label={text.label || ''} className={classes.promptHolder}>*/}
        {/*    <TextField*/}
        {/*      className={classes.input}*/}
        {/*      multiline*/}
        {/*      defaultValue={textValue}*/}
        {/*      onChange={this.changeTextEvent}*/}
        {/*      spellCheck={spellCheckEnabled}*/}
        {/*    />*/}
        {/*  </InputContainer>*/}
        {/*)}*/}

        {/*{tokens.settings && (*/}
        {/*  <InputContainer label={tokens.label || ''} className={classes.tokenizerContainer}>*/}
        {/*    <Tooltip*/}
        {/*      classes={{ tooltip: classes.tooltip }}*/}
        {/*      disableFocusListener*/}
        {/*      disableTouchListener*/}
        {/*      placement={'right'}*/}
        {/*      title={validationMessage}*/}
        {/*    >*/}
        {/*      <Info fontSize={'small'} color={'primary'} style={{ position: 'absolute', left: '48px', top: '-3px' }} />*/}
        {/*    </Tooltip>*/}

        {/*    <Tokenizer*/}
        {/*      className={classes.tokenizer}*/}
        {/*      text={model.text}*/}
        {/*      tokens={tokensModel}*/}
        {/*      onChange={this.changeTokens}*/}
        {/*    />*/}
        {/*  </InputContainer>*/}
        {/*)}*/}
        {/*{tokensError && <div className={classes.errorText}>{tokensError}</div>}*/}
        {/*{selectionsError && <div className={classes.errorText}>{selectionsError}</div>}*/}

        {/*<div className={classes.tokensDetails}>*/}
        {/*  {mode.settings && (*/}
        {/*    <Chip label={`${mode.label}: ${model.mode ? model.mode : 'None'}`} className={classes.chip} />*/}
        {/*  )}*/}

        {/*  {selections.settings && (*/}
        {/*    <Chip label={`${selections.label}: ${tokensModel.length}`} className={classes.chip} />*/}
        {/*  )}*/}

        {/*  {correctAnswer.settings && (*/}
        {/*    <Chip*/}
        {/*      label={`${correctAnswer.label}: ${tokensModel.filter((t) => t.correct).length}`}*/}
        {/*      className={classes.chip}*/}
        {/*    />*/}
        {/*  )}*/}

        {/*  {selectionCount.settings && (*/}
        {/*    <NumberTextField*/}
        {/*      min={tokensModel.filter((t) => t.correct).length || 0}*/}
        {/*      label={`${selectionCount.label} (0:any)`}*/}
        {/*      max={tokensModel.length}*/}
        {/*      value={model.maxSelections}*/}
        {/*      onChange={this.changeMaxSelections}*/}
        {/*      className={classes.numberField}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</div>*/}

        <div className={classes.subheader}>
          NEW functionality
          <FormControlLabel
            control={<Switch checked={selectMode} onChange={() => this.setState({ selectMode: !selectMode })} />}
            label="Select tokens"
          />
        </div>

        {selectMode && (
          <Controls
            onClear={this.clearTokens}
            onWords={this.selectWords}
            onSentences={this.selectSentences}
            onParagraphs={this.selectParagraphs}
            setCorrectMode={correctMode}
            onToggleCorrectMode={() => this.setState({ correctMode: !correctMode })}
          />
        )}

        {text.settings && (
          <InputContainer label={text.label || ''} className={classes.promptHolder}>
            {selectMode ? (
              <div
                className={classes.textContainer}
                ref={(r) => (this.textRef = r)}
                onMouseDown={selectMode && !correctMode ? clearSelection : () => {}}
                onMouseUp={selectMode && !correctMode ? this.handleSelection : () => {}}
                dangerouslySetInnerHTML={{ __html: tokenizedText }}
              />
            ) : (
              <EditableHtml
                className={classes.prompt}
                markup={textValue}
                onChange={this.changeText}
                nonEmpty={false}
                disableUnderline
                toolbarOpts={toolbarOpts}
                pluginProps={getPluginProps(text?.inputConfiguration)}
                spellCheck={spellCheckEnabled}
                imageSupport={imageSupport}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                mathMlOptions={mathMlOptions}
              />
            )}
          </InputContainer>
        )}

        {rationaleEnabled && (
          <InputContainer label={rationale.label || ''} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={this.onRationaleChanged}
              imageSupport={imageSupport}
              error={rationaleError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(configuration?.rationale?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {rationaleError && <div className={classes.errorText}>{rationaleError}</div>}
          </InputContainer>
        )}

        {feedbackEnabled && (
          <FeedbackConfig feedback={model.feedback} onChange={this.changeFeedback} toolbarOpts={toolbarOpts} />
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles((theme) => ({
  tokenizerContainer: {
    paddingRight: 0,
    marginRight: 0,
    '&:after': {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '1px',
      content: '""',
      backgroundColor: theme.palette.primary.main,
    },
    marginBottom: theme.spacing.unit,
  },
  chip: {
    marginTop: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit * 2,
  },
  input: {
    width: '100%',
  },
  tokenizer: {
    marginTop: theme.spacing.unit * 2,
  },
  mainOpts: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'baseline',
  },
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  tokensDetails: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit * 2.5,
  },
  numberField: {
    width: '180px',
    margin: `${theme.spacing.unit / 2}px auto 0`,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },

  subheader: {
    paddingBottom: '8px',
    borderBottom: '1px solid grey',
    marginBottom: '16px',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    padding: '15px 21px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflowY: 'scroll',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    '& p': {
      margin: 0,
    },
    '& span[data-latex]': {
      userSelect: 'none',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
    },
  },
  token: {
    position: 'relative',
    cursor: 'pointer',
    backgroundColor: '#fff9c4',

    '&:hover': {
      backgroundColor: '#E5E0B0',
    },

    '&.correct': {
      backgroundColor: '#4caf50',
    },
  },
}))(Design);
