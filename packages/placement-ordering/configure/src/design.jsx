import {
  FeedbackConfig,
  FormSection,
  InputCheckbox,
  InputContainer,
  TwoChoice
} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';

import { get, set } from 'nested-property';

import ChoiceEditor from './choice-editor';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';
import cloneDeep from 'lodash/cloneDeep';
import debug from 'debug';
import { withStyles } from 'material-ui/styles';

const log = debug('@pie-element:placement-ordering:design');

class Design extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allMoveOnDrag: false
    };

    this.applyUpdate = modelFn => {
      const { model, onModelChange } = this.props;
      const update = modelFn(cloneDeep(model));
      onModelChange(update);
    };

    this.changeHandler = (modelPath, valuePath) => {
      return value => {
        log('[changeHandler] value: ', value);
        const v = valuePath ? get(value, valuePath) : value;
        this.applyUpdate(model => {
          set(model, modelPath, v);
          return model;
        });
      };
    };

    this.onLayoutChange = layout => {
      this.applyUpdate(model => {
        model.choiceAreaLayout = layout;
        return model;
      });
    };

    this.onPlacementTypeChange = event => {
      const includePlacment = event.currentTarget.checked;
      this.applyUpdate(model => {
        model.placementType = includePlacment ? 'placement' : 'none';
        return model;
      });
    };

    this.onDefaultLangChange = defaultLang => {
      this.applyUpdate(model => {
        model.defaultLang = defaultLang;
        return model;
      });
    };

    this.onPromptChange = this.changeHandler('prompt');
    this.onChoiceAreaLabelChange = this.changeHandler(
      'choiceAreaLabel',
      'target.value'
    );
    this.onAnswerAreaLabelChange = this.changeHandler(
      'answerAreaLabel',
      'target.value'
    );
    this.onFeedbackChange = this.changeHandler('feedback');
    this.onShuffleChange = this.changeHandler('shuffle', 'target.checked');
    this.onShowOrderingChange = this.changeHandler(
      'showOrdering',
      'target.checked'
    );

    this.onChoiceEditorChange = (choices, correctResponse) => {
      const { model, onModelChange } = this.props;
      const update = cloneDeep(model);
      update.choices = choices;
      update.correctResponse = correctResponse;
      onModelChange(update);
    };
  }

  render() {
    const { model, classes, imageSupport } = this.props;
    const { allMoveOnDrag } = this.state;
    return (
      <div className={classes.design}>
        <div className={classes.row}>
          <TwoChoice
            className={classes.orientation}
            header={'Orientation'}
            value={model.choiceAreaLayout}
            onChange={this.onLayoutChange}
            one={{ label: 'vertical', value: 'vertical' }}
            two={{ label: 'horizontal', value: 'horizontal' }}
          />
        </div>
        <div className={classes.row}>
          <InputCheckbox
            label="Shuffle"
            checked={model.shuffle}
            onChange={this.onShuffleChange}
            aria-label="shuffle"
          />
          <InputCheckbox
            label="Include placement area"
            checked={model.placementType === 'placement'}
            onChange={this.onPlacementTypeChange}
            aria-label="include-placment"
          />
          <InputCheckbox
            disabled={model.placementType !== 'placement'}
            label="Numbered guides"
            checked={model.showOrdering}
            onChange={this.onShowOrderingChange}
            aria-label="shuffle"
          />
        </div>
        <InputContainer label="Prompt" className={classes.promptHolder}>
          <EditableHtml
            className={classes.prompt}
            markup={model.prompt}
            onChange={this.onPromptChange}
            imageSupport={imageSupport}
          />
        </InputContainer>

        <div className={classes.row}>
          <TextField
            className={classes.choiceLabel}
            label="Choice label"
            value={model.choiceAreaLabel}
            onChange={this.onChoiceAreaLabelChange}
            fullWidth
          />
          {model.placementType === 'placement' && (
            <TextField
              label="Answer label"
              value={model.answerAreaLabel}
              onChange={this.onAnswerAreaLabelChange}
              fullWidth
            />
          )}
        </div>
        <FormSection label="Choices">
          <ChoiceEditor
            correctResponse={model.correctResponse}
            choices={model.choices}
            onChange={this.onChoiceEditorChange}
            imageSupport={imageSupport}
          />
        </FormSection>
        <FeedbackConfig
          feedback={model.feedback}
          onChange={this.onFeedbackChange}
          imageSupport={imageSupport}
        />
      </div>
    );
  }
}

Design.propTypes = {
  model: PropTypes.object.isRequired,
  onModelChange: PropTypes.func.isRequired
};

export default withStyles(theme => ({
  promptHolder: {
    width: '100%'
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit
  },
  row: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
    gridGap: '8px'
  },
  design: {
    paddingTop: '10px'
  },
  langControls: {
    marginTop: '0px',
    marginBottom: '0px'
  },
  choices: {
    marginTop: '20px',
    marginBottom: '20px'
  },
  orientation: {
    marginTop: '0px',
    marginBottom: '0px'
  }
}))(Design);
