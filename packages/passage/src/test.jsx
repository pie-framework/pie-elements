import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { color, Purpose } from '@pie-lib/render-ui';
import classNames from 'classnames';

const styles = (theme) => ({
  // ... (same as before)
});

function TabContainer(props) {
  // ... (same as before)
}

TabContainer.propTypes = {
  // ... (same as before)
};

class StimulusTabs extends React.Component {
  // ... (same as before)

  handleChange = (event, activeTab) => {
    // ... (same as before)
  };

  handleKeyDown = (event, currentTabIndex) => {
    // ... (same as before)
  };

  parsedText = (text) => {
    // ... (same as before)
  };

  render() {
    const { classes, tabs, disabledTabs } = this.props;
    const { activeTab } = this.state;

    if (tabs && tabs.length > 1) {
      return disabledTabs ? (
        <div className="passages" role="tabpanel">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`passage-${index}`}
              id={`tabpanel-${index}`}
              aria-labelledby={`tab-${index}`}
              tabIndex="0"
            >
              <TabContainer multiple>
                <div
                  className={classNames(classes.title, 'title')}
                  dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }}
                />
                <Purpose purpose="passage-text">
                  <div className="text" key={index} dangerouslySetInnerHTML={{ __html: this.parsedText(tab.text) }} />
                </Purpose>
              </TabContainer>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.root}>
          <Tabs
            classes={{
              root: classes.stickyTabs,
              flexContainer: classes.buttonContainer,
            }}
            value={activeTab}
            onChange={this.handleChange}
          >
            {tabs.map((tab, index) => (
              <Tab
                className={classes.tab}
                key={index}
                label={
                  <Purpose purpose="passage-title">
                    <span dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }} />
                  </Purpose>
                }
                value={index}
                tabIndex={activeTab === index ? 0 : -1}
                aria-selected={activeTab === index}
                onFocus={() => this.handleChange(null, index)}
                onKeyDown={(event) => this.handleKeyDown(event, index)}
              />
            ))}
          </Tabs>

          {tabs.map((tab, index) =>
            activeTab === index ? (
              <div
                key={index}
                id={`tabpanel-${index}`}
                role="tabpanel"
                aria-labelledby={`tab-${index}`}
                tabIndex="0"
              >
                <TabContainer multiple>
                  <Purpose purpose="passage-text">
                    <div key={index} dangerouslySetInnerHTML={{ __html: this.parsedText(tab.text) }} />
                  </Purpose>
                </TabContainer>
              </div>
            ) : null,
          )}
        </div>
      );
    } else if (tabs && tabs[0]) {
       return (
        <div
          className="passage"
          role="tabpanel"
          aria-labelledby={`tab-${0}`}
          tabIndex="0"
          style={{ whiteSpace: 'break-spaces' }}
        >
          <TabContainer>
            <div className="text" dangerouslySetInnerHTML={{ __html: this.parsedText(tabs[0].text) }} />
          </TabContainer>
        </div>
      );
    }

    return null;
  }
}

StimulusTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  disabledTabs: PropTypes.bool,
};

export default withStyles(styles)(StimulusTabs);
