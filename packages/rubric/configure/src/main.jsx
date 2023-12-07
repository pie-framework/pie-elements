import React from 'react';
import { Authoring } from '@pie-lib/pie-toolbox/rubric';
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
  render() {
    const { model, configuration, onConfigurationChanged, onModelChanged } = this.props || {};
    const {
      contentDimensions = {},
      settingsPanelDisabled,
      showExcludeZero = {},
      showMaxPoint = {},
      mathMlOptions = {},
      width,
      maxMaxPoints
    } = configuration || {};

    const panelProperties = {
      excludeZeroEnabled: showExcludeZero.settings && toggle(showExcludeZero.label),
      maxPointsEnabled: showMaxPoint.settings && toggle(showMaxPoint.label),
    };

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            onChangeModel={onModelChanged}
            configuration={configuration}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Properties: panelProperties,
            }}
          />
        }
      >
        <div style={{ maxWidth: width }}>
          <Authoring
            value={model}
            onChange={onModelChanged}
            mathMlOptions={mathMlOptions}
            maxMaxPoints={Math.abs(maxMaxPoints)}
          />
        </div>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Main);
