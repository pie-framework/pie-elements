import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import { Collapsible, color, PreviewPrompt, Purpose, UiLayout } from '@pie-lib/render-ui';

const PassagesContainer = styled('div')({
  flexGrow: 1,
  backgroundColor: color.background(),
  color: color.text(),
  '&:not(.MathJax) table': {
    borderCollapse: 'collapse',
  },
  '&:not(.MathJax) table td, &:not(.MathJax) table th': {
    padding: '.6em 1em',
    textAlign: 'left',
  },
});

const Passage = styled('div')(({ theme }) => ({
  backgroundColor: color.background(),
  color: color.text(),
  padding: theme.spacing(2),
}));

const PassageTitle = styled('div')({
  fontSize: '1.75rem',
});

const PassageSubtitle = styled('div')({
  fontSize: '1.5rem',
});

const PassageAuthor = styled('div')({
  fontSize: '1.25rem',
});

const TabStyled = styled(Tab)(({ theme }) => ({
  background: theme.palette.common.white, // replace with color.background() once PD-2801 is DONE
  fontSize: 'inherit',
  color: theme.palette.common.black, // remove when PD-2801 is DONE
}));

class StimulusTabs extends React.Component {
  state = {
    activeTab: 0,
  };

  handleChange = (event, activeTab) => {
    this.setState(() => ({ activeTab }));

    setTimeout(() => {
      const tabChangeEvent = new CustomEvent('pie-ui-passage-tabChanged', {
        detail: { tab: activeTab },
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
      document.getElementById(`button-${tabs[newTabIndex].id}`).focus();
    }
  };

  parsedText = (text = '') => {
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

  renderInstructions(teacherInstructions, disabledTabs = false) {
    if (!teacherInstructions) {
      return;
    }

    const teacherInstructionsDiv = (
      <PreviewPrompt
        tagName="div"
        className="prompt"
        defaultClassName="teacher-instructions"
        prompt={teacherInstructions}
      />
    );

    if (disabledTabs) {
      return teacherInstructionsDiv;
    }

    return (
      <Collapsible
        labels={{
          hidden: 'Show Teacher Instructions',
          visible: 'Hide Teacher Instructions',
        }}
      >
        {teacherInstructionsDiv}
      </Collapsible>
    );
  }

  renderTab(tab, disabledTabs) {
    return (
      <Passage key={tab.id} id={`tabpanel-${tab.id}`} role="tabpanel" aria-labelledby={`button-${tab.id}`}>
        {this.renderInstructions(tab.teacherInstructions, disabledTabs)}

        {(tab.title || tab.subtitle) && (
          <h2>
            {tab.title && (
              <Purpose purpose="passage-title">
                <PassageTitle dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }}/>
              </Purpose>
            )}
            {tab.subtitle && (
              <Purpose purpose="passage-subtitle">
                <PassageSubtitle dangerouslySetInnerHTML={{ __html: this.parsedText(tab.subtitle) }}
                />
              </Purpose>
            )}
          </h2>
        )}

        {tab.author && (
          <Purpose purpose="passage-author">
            <PassageAuthor className="author" dangerouslySetInnerHTML={{ __html: this.parsedText(tab.author) }}/>
          </Purpose>
        )}

        {tab.text && (
          <Purpose purpose="passage-text">
            <div
              key={tab.id}
              className="text"
              dangerouslySetInnerHTML={{ __html: this.parsedText(tab.text) }}
            />
          </Purpose>
        )}
      </Passage>
    );
  }

  render() {
    const { model, tabs, disabledTabs } = this.props;
    const { activeTab } = this.state;

    if (!tabs?.length) {
      return;
    }

    const { extraCSSRules } = model || {};
    const selectedTab = (tabs || []).find((tab) => tab.id === activeTab);

    return (
      <UiLayout extraCSSRules={extraCSSRules}>
        <PassagesContainer className="passages">
          {disabledTabs || tabs.length === 1 ? (
            tabs.map((tab) => this.renderTab(tab, disabledTabs))
          ) : (
            <>
              <Tabs
                sx={{ position: 'sticky', top: 0, background: color.background(), color: color.text() }}
                value={activeTab}
                onChange={this.handleChange}
              >
                {tabs.map((tab) => (
                  <TabStyled
                    key={tab.id}
                    id={`button-${tab.id}`}
                    label={
                      <Purpose purpose="passage-label">
                        <span dangerouslySetInnerHTML={{ __html: this.parsedText(tab.label) }}/>
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
              {selectedTab ? this.renderTab(selectedTab, disabledTabs) : null}
            </>
          )}
        </PassagesContainer>
      </UiLayout>
    );
  }
}

StimulusTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string.isRequired,
      teacherInstructions: PropTypes.string,
    }).isRequired,
  ).isRequired,
  disabledTabs: PropTypes.bool,
  model: PropTypes.object,
};

export default StimulusTabs;
