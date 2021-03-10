import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { color, Purpose } from '@pie-lib/render-ui';
import previewLayout from '@pie-lib/render-ui/lib/preview-layout';

const styles = (/*theme*/) => ({
  root: {
    flexGrow: 1,
    backgroundColor: color.background(),
    color: color.text(),
  },
  tab: {
    fontSize: '0.8125em',
  },
  stickyTabs: {
    background: color.background(),
    paddingBottom: '20px',
    position: 'sticky',
    top: 0,
  }
});

function TabContainer(props) {
  const padding = props.multiple ? '0 24px 24px 24px' : '24px';

  return (
    <Typography
      component="div"
      style={{
        padding,
        fontSize: '0.875em',
        backgroundColor: color.background(),
        color: color.text(),
      }}
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  multiple: PropTypes.bool,
};

class StimulusTabs extends React.Component {
  state = {
    activeTab: 0,
  };

  handleChange = (event, activeTab) => {
    this.setState(() => ({ activeTab }));
    setTimeout(() => {
      const tabChangeEvent = new CustomEvent('pie-ui-passage-tabChanged', {
        detail: {
          tab: activeTab,
        },
      });

      window.dispatchEvent(tabChangeEvent);
    });
  };

  parsedText = (text) => text.replace(/(<br\/>\n)/g, '<br/>');

  createMarkup = (tab) => { return { __html: this.parsedText(tab) } };

  render() {
    const { classes, tabs } = this.props;
    const { activeTab } = this.state;

    if (tabs && tabs.length > 1) {
      return (
        <div className={classes.root}>
          <Tabs
            classes={{
              root: classes.stickyTabs,
            }}
            value={activeTab}
            onChange={this.handleChange}
          >
            {tabs.map((tab) => (
              <Tab
                className={classes.tab}
                key={tab.id}
                label={
                  <Purpose purpose="passage-title">
                    <span
                      dangerouslySetInnerHTML={this.createMarkup(tab.title)}
                    ></span>
                  </Purpose>
                }
                value={tab.id}
              />
            ))}
          </Tabs>
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <TabContainer multiple key={tab.id}>
                <Purpose purpose="passage-text">
                  <div
                    style={{ whiteSpace: 'pre-line' }}
                    key={tab.id}
                    dangerouslySetInnerHTML={this.createMarkup(tab.text)}
                  />
                </Purpose>
              </TabContainer>

            ) : null
          )}
        </div>
      );

    } else if (tabs && tabs[0]) {
      return (
        <div style={{ whiteSpace: 'break-spaces' }} >
          <TabContainer>
            <div dangerouslySetInnerHTML={this.createMarkup(tabs[0].text)} />
          </TabContainer>
        </div>
      );
    }
  }
}

StimulusTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default withStyles(styles)(StimulusTabs);
