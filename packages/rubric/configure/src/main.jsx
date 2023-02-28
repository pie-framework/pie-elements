import React from 'react';
import { Authoring } from '@pie-lib/rubric';
import { withStyles } from '@material-ui/core/styles';
import { layout, settings } from '@pie-lib/config-ui';

const { Panel, toggle } = settings;

const styles = (theme) => ({
  design: {
    fontFamily: 'Cerebri Sans',
    fontSize: theme.typography.fontSize,
  },
});

class Main extends React.Component {
  render() {
    const { model, classes, configuration, onConfigurationChanged, onModelChanged } = this.props || {};
    const { settingsPanelDisabled, showExcludeZero = {}, showMaxPoint = {}, width } = configuration || {};

    const panelProperties = {
      excludeZeroEnabled: showExcludeZero.settings && toggle(showExcludeZero.label),
      maxPointsEnabled: showMaxPoint.settings && toggle(showMaxPoint.label),
    };

    return (
      <layout.ConfigLayout
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
          <Authoring value={model} onChange={onModelChanged} />
        </div>
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Main);
