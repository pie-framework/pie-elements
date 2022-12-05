import React from 'react';
import { Authoring } from '@pie-lib/rubric';
import { withStyles } from '@material-ui/core/styles';
import { layout, settings } from '@pie-lib/config-ui';

const { Panel, toggle } = settings;

const styles = {
  design: {
    fontFamily: 'Cerebri Sans',
    fontSize: '14px',
  },
};

class Main extends React.Component {
  render() {
    const { model, classes, configuration, onConfigurationChanged, onModelChanged } = this.props || {};
    const { settingsPanelDisabled, showExcludeZero, showMaxPoint } = configuration || {};
    return (
      <div className={classes.design}>
        {settingsPanelDisabled ? (
          <Authoring value={model} onChange={onModelChanged} />
        ) : (
          <layout.ConfigLayout
            settings={
              <Panel
                model={model}
                onChangeModel={onModelChanged}
                configuration={configuration}
                onChangeConfiguration={onConfigurationChanged}
                groups={{
                  Properties: {
                    excludeZeroEnabled: showExcludeZero.settings && toggle(showExcludeZero.label),
                    maxPointsEnabled: showMaxPoint.settings && toggle(showMaxPoint.label),
                  },
                }}
              />
            }
          >
            <Authoring value={model} onChange={onModelChanged} />
          </layout.ConfigLayout>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Main);
