import React from 'react';
import PropTypes from 'prop-types';
import { FormSection, layout, AlertDialog } from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html-tip-tap';
import { FractionModelChart } from '@pie-element/fraction-model';
import Tooltip from '@mui/material/Tooltip';
import Info from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

import CardBar from './card-bar';
import ModelOptions from './model-options';

const StyledFormSection = styled(FormSection)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}));

const ErrorMessage = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

const ModelErrorContainer = styled('div')(({ theme, hasError }) => ({
  ...(hasError && {
    border: `2px solid ${theme.palette.error.main}`,
  }),
}));

const Label = styled('label')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    uploadSoundSupport: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      correctAnswerChangeDialog: {
        open: false,
        text: '',
      },
    };
  }

  /*
   * Method to handle correct answer change
   * @param {array} correctResponse - correct response
   * */
  onCorrectAnswerChange = (correctResponse) => {
    const { model, onChange } = this.props;
    model.correctResponse = correctResponse;
    onChange({ ...model });
  };

  /*
   * Method to handle model options change
   * @param {object} oldModel - old model
   * @param {object} newModel - new model
   * @param {boolean} showDiag - show dialog or not
   * */
  onModelOptionsChange = (oldModel, newModel, showDiag) => {
    const { onChange } = this.props;
    if (showDiag && oldModel.correctResponse.length > 0) {
      this.setState({
        correctAnswerChangeDialog: {
          open: true,
          oldModel: oldModel,
          newModel: newModel,
          text: 'Changing either the Number of Models or Parts per Model will remove added correct answer. Are you sure you want to continue?',
        },
      });
    } else {
      onChange({ ...newModel });
    }
  };

  /*
   * Method to generate random key
   * */
  generateRandomKey = () => {
    return Math.floor(Math.random() * 10000);
  };

  render() {
    const { model, onChange, configuration, imageSupport, uploadSoundSupport } = this.props;
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      title = {},
      prompt = {},
      modelOptions = {},
      mathMlOptions = {},
    } = configuration || {};

    const { errors = {}, extraCSSRules, spellCheckEnabled, toolbarEditorPosition } = model || {};

    const { correctAnswerChangeDialog } = this.state;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    const fractionModelChartKey = this.generateRandomKey();

    return (
      <layout.ConfigLayout extraCSSRules={extraCSSRules} dimensions={contentDimensions} hideSettings={true}>
        <CardBar header="Set Up"></CardBar>

        <StyledFormSection label={title?.label || 'Title'}>
          <EditableHtml
            markup={model.title || ''}
            onChange={(title) => onChange({ title })}
            toolbarOpts={toolbarOpts}
            activePlugins={[
              'bold',
              'html',
              'italic',
              'underline',
              'strikethrough',
              'image',
              'math',
              'languageCharacters',
              'responseArea',
            ]}
            pluginProps={getPluginProps(title?.inputConfiguration)}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
          />
        </StyledFormSection>

        <StyledFormSection label={prompt?.label || 'Question'}>
          <EditableHtml
            markup={model.prompt || ''}
            minHeight={60}
            onChange={(prompt) => onChange({ prompt })}
            toolbarOpts={toolbarOpts}
            pluginProps={getPluginProps(prompt?.inputConfiguration)}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
            imageSupport={imageSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
          />
        </StyledFormSection>

        <FormSection>
          <ModelOptions model={model} onChange={this.onModelOptionsChange} modelOptions={modelOptions} />
        </FormSection>

        <FormSection>            <CardBar
            header="Correct Answer"
            info={
              <StyledTooltip
                disableFocusListener
                disableTouchListener
                placement={'right'}
                title={'The correct answer should include no more than one partially-filled model'}
              >
                <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '8px' }} />
              </StyledTooltip>
            }
          ></CardBar>

          <br />
          <Label>
            Click/touch the number of parts to represent the correct fraction model
          </Label>
          <br />

          <ModelErrorContainer hasError={!!errors.correctResponse}>
            <FractionModelChart
              key={fractionModelChartKey}
              value={model.correctResponse}
              modelType={model.modelTypeSelected}
              noOfModels={model.maxModelSelected}
              partsPerModel={model.partsPerModel}
              showLabel={model.showGraphLabels}
              onChange={this.onCorrectAnswerChange}
            ></FractionModelChart>
          </ModelErrorContainer>

          {errors.correctResponse && <ErrorMessage>{errors.correctResponse}</ErrorMessage>}
        </FormSection>

        <AlertDialog
          open={correctAnswerChangeDialog.open}
          title="Warning"
          text={correctAnswerChangeDialog.text}
          onConfirm={() => {
            let newModel = this.state.correctAnswerChangeDialog.newModel;
            newModel.correctResponse = [];
            onChange({ ...newModel });
            this.setState({
              correctAnswerChangeDialog: { open: false },
            });
          }}
          onClose={() => {
            const oldModel = this.state.correctAnswerChangeDialog.oldModel;
            onChange({ ...oldModel });
            this.setState({ correctAnswerChangeDialog: { open: false } });
          }}
          onConfirmText={'OK'}
          onCloseText={'Cancel'}
        />
      </layout.ConfigLayout>
    );
  }
}

export default Main;
