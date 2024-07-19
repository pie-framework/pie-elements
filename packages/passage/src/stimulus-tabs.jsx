import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { color, Purpose } from '@pie-lib/render-ui';
import classNames from 'classnames';

const styles = (theme) => ({
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
    paddingBottom: theme.spacing.unit * 2.5,
    position: 'sticky',
    top: 0,
  },
  title: {
    textTransform: 'uppercase',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
    borderBottom: `2px solid ${color.secondary()}`,
    width: 'fit-content',
    marginBottom: theme.spacing.unit,
  },
  buttonContainer: {
    background: theme.palette.common.white,
  },
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

  handleKeyDown = (event, currentTabId) => {
    const { key } = event;
    const { tabs } = this.props;

    let newTabIndex = -1;
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);

    switch (key) {
      case 'ArrowRight':
        // Move to the next tab
        newTabIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        // Move to the previous tab
        newTabIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      // Commented out ArrowDown and ArrowUp for future vertical tab navigation
      // case 'ArrowDown':
      //   // Move to the next tab (for vertical alignment)
      //   newTabIndex = (currentIndex + 1) % tabs.length;
      //   break;
      // case 'ArrowUp':
      //   // Move to the previous tab (for vertical alignment)
      //   newTabIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      //   break;
      case 'Home':
        // Move to the first tab
        newTabIndex = 0;
        break;
      case 'End':
        // Move to the last tab
        newTabIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        // Activate the current tab
        newTabIndex = currentIndex;
        break;
      default:
        break;
    }

    if (newTabIndex !== -1) {
      event.preventDefault();
      this.handleChange(event, tabs[newTabIndex].id);
      document.getElementById(`tab-${tabs[newTabIndex].id}`).focus();
    }
  };

  parsedText = (text) => {
    // fix imported audio content for Safari PD-1391
    const div = document.createElement('div');
    div.innerHTML = text.replace(/(<br\/>\n)/g, '<br/>');

    const audio = div.querySelector('audio');
    if (audio) {
      const source = document.createElement('source');

      source.setAttribute('type', 'audio/mp3');
      source.setAttribute('src', audio.getAttribute('src'));

      audio.removeAttribute('src');
      audio.appendChild(source);
    }

    return div.innerHTML;
  };

  render() {
    const { classes, tabs, disabledTabs } = this.props;
    const { activeTab } = this.state;

    if (tabs && tabs.length > 1) {
      return disabledTabs ? (
        <div className="passages">
          {tabs.map((tab) => (
            <div key={tab.id} className={`passage-${tab.id}`}>
              <TabContainer multiple>
                <div
                  className={classNames(classes.title, 'title')}
                  dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }}
                />
                <Purpose purpose="passage-text">
                  <div className="text" key={tab.id} dangerouslySetInnerHTML={{ __html: this.parsedText(tab.text) }} />
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
            {tabs.map((tab) => (
              <Tab
                className={classes.tab}
                key={tab.id}
                id={`tab-${tab.id}`}
                label={
                  <Purpose purpose="passage-title">
                    <span dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }} />
                  </Purpose>
                }
                value={tab.id}
                tabIndex={activeTab === tab.id ? 0 : -1}
                aria-selected={activeTab === tab.id}
                onFocus={() => this.handleChange(null, tab.id)}
                onKeyDown={(event) => this.handleKeyDown(event, tab.id)}
              />
            ))}
          </Tabs>

          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <TabContainer multiple key={tab.id}>
                <Purpose purpose="passage-text">
                  <div key={tab.id} dangerouslySetInnerHTML={{ __html: this.parsedText(tab.text) }} />
                </Purpose>
              </TabContainer>
            ) : null,
          )}
        </div>
      );
    } else if (tabs && tabs[0]) {
      return (
        <div className="passage" style={{ whiteSpace: 'break-spaces' }}>
          <TabContainer>
            <div className="text" dangerouslySetInnerHTML={{ __html: this.parsedText(tabs[0].text) }} />
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
    }).isRequired,
  ).isRequired,
  disabledTabs: PropTypes.bool,
};

export default withStyles(styles)(StimulusTabs);
