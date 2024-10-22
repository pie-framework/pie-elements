import React from 'react';
import { FormSection, layout, AlertDialog } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardBar from './card-bar';
import ModelOptions from './model-options';
import { FractionModelChart } from '@pie-element/fraction-model';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';

const styles = (theme) => ({
  label: {
    marginBottom: theme.spacing.unit * 4,
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
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorMessage: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    marginTop: theme.spacing.unit,
  },
  modelError: {
    border: `2px solid ${theme.palette.error.main}`,
  },
});

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    const { classes, model, onChange, configuration, imageSupport, uploadSoundSupport } = this.props;
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      title = {},
      prompt = {},
      modelOptions = {},
      mathMlOptions = {},
    } = configuration || {};

    const { errors = {}, spellCheckEnabled, toolbarEditorPosition } = model || {};

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
      <layout.ConfigLayout dimensions={contentDimensions} hideSettings={true}>
        <CardBar header="Set Up"></CardBar>

        <FormSection label={title?.label || 'Title'} className={classes.label}>
          <EditableHtml
            className={classes.title}
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
        </FormSection>

        <FormSection label={prompt?.label || 'Question'} className={classes.label}>
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
        </FormSection>

        <FormSection>
          <ModelOptions model={model} onChange={this.onModelOptionsChange} modelOptions={modelOptions} />
        </FormSection>

        <FormSection>
          <CardBar
            header="Correct Answer"
            info={
              <Tooltip
                classes={{ tooltip: classes.tooltip }}
                disableFocusListener
                disableTouchListener
                placement={'right'}
                title={'The correct answer should include no more than one partially-filled model'}
              >
                <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '8px' }} />
              </Tooltip>
            }
          ></CardBar>

          <br />
          <label className={classes.label}>
            Click/touch the number of parts to represent the correct fraction model
          </label>
          <br />

          <div className={errors.correctResponse && classes.modelError}>
            <FractionModelChart
              key={fractionModelChartKey}
              value={model.correctResponse}
              modelType={model.modelTypeSelected}
              noOfModels={model.maxModelSelected}
              partsPerModel={model.partsPerModel}
              showLabel={model.showGraphLabels}
              onChange={this.onCorrectAnswerChange}
            ></FractionModelChart>
          </div>

          {errors.correctResponse && <div className={classes.errorMessage}>{errors.correctResponse}</div>}
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

export default withStyles(styles, { name: 'Main' })(Main);
