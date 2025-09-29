import React from 'react';
import { Authoring } from './pie-toolbox-rubric/index';
import { withStyles } from '@material-ui/core/styles';
import { layout, settings } from '@pie-lib/pie-toolbox/config-ui';

const { Panel, toggle } = settings;

const styles = (theme) => ({
  design: {
    fontFamily: 'Cerebri Sans',
    fontSize: theme.typography.fontSize,
  },
});

class Main extends React.Component {
  verifyRubriclessModel = (m, config) => {
    const { rubricless = false } = config || {};
    return rubricless ? (({ points, sampleAnswers, ...rest }) => rest)(m) : m;
  };

  render() {
    const { model, configuration, onConfigurationChanged, onModelChanged, imageSupport } = this.props || {};
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      settingsPanelDisabled,
      showExcludeZero = {},
      showMaxPoint = {},
      mathMlOptions = {},
      rubricless = false,
      rubriclessInstruction,
      width,
    } = configuration || {};

    // ensure to eliminate points and sampleAnswers in case of rubricless
    const value = this.verifyRubriclessModel(model, configuration);
    const { extraCSSRules } = model;

    const panelProperties = {
      excludeZeroEnabled: showExcludeZero.settings && toggle(showExcludeZero.label),
      maxPointsEnabled: showMaxPoint.settings && toggle(showMaxPoint.label),
      rubriclessInstructionEnabled: rubricless && rubriclessInstruction.settings && toggle(rubriclessInstruction.label),
    };

    const getPluginProps = (props) => {
      return Object.assign(
        {
          ...baseInputConfiguration,
        },
        props || {},
      );
    };

    return (
      <layout.ConfigLayout
        extraCSSRules={extraCSSRules}
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            onChangeModel={onModelChanged}
            configuration={configuration}
            onChangeConfiguration={onConfigurationChanged}
            pluginOpts={getPluginProps(rubriclessInstruction?.inputConfiguration)}
            groups={{
              Properties: panelProperties,
            }}
            imageSupport={imageSupport}
          />
        }
      >
        <div style={{ maxWidth: width }}>
          <Authoring
            value={value}
            config={configuration}
            onChange={onModelChanged}
            mathMlOptions={mathMlOptions}
            rubricless={rubricless}
            pluginOpts={baseInputConfiguration}
            imageSupport={imageSupport}
          />
        </div>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Main);
