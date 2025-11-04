import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import cloneDeep from 'lodash/cloneDeep';
import { InputContainer, settings, layout } from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';

const { Panel, toggle } = settings;

const StyledInputContainer = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.object,
  };

  static defaultProps = {};

  onPromptChanged = (prompt) => {
    const { onModelChanged, model } = this.props;
    const update = cloneDeep(model);

    update.prompt = prompt;
    onModelChanged(update);
  };

  render() {
    const { configuration, imageSupport, model, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;
    const { contentDimensions = {}, prompt = {}, settingsPanelDisabled } = configuration || {};
    const { extraCSSRules, promptEnabled } = model || {};

    const panelSettings = {};

    const panelProperties = {
      promptEnabled: prompt.settings && toggle(prompt.label),
    };

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
        {promptEnabled && (
          <StyledInputContainer label={prompt.label || ''}>
            <EditableHtml
              markup={model.prompt}
              onChange={this.onPromptChanged}
              imageSupport={imageSupport}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
          </StyledInputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}

export default Design;
