import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { color, Purpose } from '@pie-lib/render-ui';
import classNames from 'classnames';

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
  },
  title: {
    textTransform: 'uppercase',
    padding: '6px 24px',
    borderBottom: `2px solid ${color.secondary()}`,
    width: 'fit-content',
    marginBottom: '6px'
  },
  buttonContainer: {
    background: 'white'
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

  parsedText = text => {
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
          {tabs.map(tab =>
            <div key={tab.id} className={`passage-${tab.id}`}>
              <TabContainer multiple >
                <div
                  className={classNames(classes.title, 'title')}
                  dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }}
                />
                <Purpose purpose="passage-text">
                  <div
                    className="text"
                    key={tab.id}
                    dangerouslySetInnerHTML={{ __html: this.parsedText(tab.text) }}
                  />
                </Purpose>
              </TabContainer>
            </div>)}
        </div>
      ) : (
        <div className={classes.root}>
          <Tabs
            classes={{
              root: classes.stickyTabs,
              flexContainer: classes.buttonContainer
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
                      dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }}
                    />
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
                    key={tab.id}
                    dangerouslySetInnerHTML={{ __html: this.parsedText(tab.text) }}
                  />
                </Purpose>
              </TabContainer>

            ) : null
          )}
        </div>
      );

    } else if (tabs && tabs[0]) {
      return (
        <div className="passage" style={{ whiteSpace: 'break-spaces' }} >
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
    }).isRequired
  ).isRequired,
  disabledTabs: PropTypes.bool
};

export default withStyles(styles)(StimulusTabs);
