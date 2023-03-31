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
  const { ariaLabelledby, id } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      aria-labelledby= {ariaLabelledby}
      id={id}
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
  
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(key)) {
      event.preventDefault();
      const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
  
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        newTabIndex = (currentIndex + 1) % tabs.length;
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        newTabIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      }
    } else if (key === 'Home') {
      event.preventDefault();
      newTabIndex = 0;
    } else if (key === 'End') {
      event.preventDefault();
      newTabIndex = tabs.length - 1;
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      newTabIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    }
  
    if (newTabIndex !== -1) {
      this.handleChange(event, tabs[newTabIndex].id);
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
        <div className="passages" role="tabpanel">
          {tabs.map((tab) => (
            <div key={tab.id}
            className={`passage-${tab.id}`}
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            aria-controls={`button-${tab.id}`}
            tabIndex="0">
              <TabContainer multiple id={`tabpanel-${tab.id}`} role="tabpanel" ariaLabelledby={`button-${tab.id}`}>
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
                id={`button-${tab.id}`}
                label={
                  <Purpose purpose="passage-title">
                    <span dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }} />
                  </Purpose>
                }
                value={tab.id}
                tabIndex={activeTab === tab.id ? 0 : -1}
                aria-controls={`tabpanel-${tab.id}`}
                aria-selected={activeTab === tab.id}
                onFocus={() => this.handleChange(null, tab.id)}
                onKeyDown={(event) => this.handleKeyDown(event, tab.id)}
              />
            ))}
          </Tabs>

          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <TabContainer multiple key={tab.id} id={`tabpanel-${tab.id}`} role="tabpanel" ariaLabelledby={`button-${tab.id}`}>
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
