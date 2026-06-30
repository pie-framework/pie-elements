import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import { Collapsible, color, PreviewPrompt, Purpose, UiLayout, transformDataHeadings } from '@pie-lib/render-ui';

// Must match the breakpoint Quiz Engine passes to the PIE section player for
// switching from the side-by-side passage/question layout to the tabbed layout.
// Below (and at) this width the passage tabs scroll with the passage content
// instead of being locked to the top of the panel, so that they do not lock up
// space needed for the passage text (WCAG 1.4.10 Reflow, 400% zoom / 320px).
const STICKY_TABS_BREAKPOINT = 840;

/**
 * Zoom compensation for the passage selection tabs.
 *
 * The tabs scale naturally with browser zoom up to 200%. Beyond 200%,
 * we shrink their CSS size proportionally so their physical on-screen size
 * freezes at the 200% appearance, leaving more room for passage content
 * in high-zoom / small-window situations.
 * The factor is min(1, 2 / zoom): exactly 1 at zoom <= 200% (component
 * behavior unchanged), shrinking proportionally above that. A lower clamp
 * of 0.4 guards against inflated ratios (docked devtools, browser side
 * panels, window chrome) ever making the tabs unusably small.
 */
const MAX_TABS_ZOOM = 2;
const MIN_ZOOM_COMPENSATION = 0.4;

// Per-tab horizontal-space floor in CSS pixels. When the passage container is
// narrow enough that each tab would have at most this much room
// (containerWidth <= tabs.length * NUMERIC_LABEL_MIN_WIDTH_PER_TAB), tab labels
// fall back to "Passage 1", "Passage 2", ... so navigation stays usable instead
// of being dominated by aggressively truncated titles.
const NUMERIC_LABEL_MIN_WIDTH_PER_TAB = 170;

const computeZoomCompensation = () => {
  if (typeof window === 'undefined') return 1;
  const ratio = window.outerWidth / window.innerWidth;
  const zoom = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  return Math.max(MIN_ZOOM_COMPENSATION, Math.min(1, MAX_TABS_ZOOM / zoom));
};

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
  '& blockquote': {
    background: '#f9f9f9',
    borderLeft: '5px solid #ccc',
    margin: '1.5em 10px',
    padding: '.5em 10px',
  },
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
  fontFamily: 'Roboto, sans-serif',
  color: theme.palette.common.black, // remove when PD-2801 is DONE
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  border: '1px solid #D9DADA',
  borderBottomWidth: 0,
  minHeight: '56px',
  padding: '8px 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: `0 ${theme.spacing(1)}`,
  textTransform: 'none',

  '.passage-label': {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    margin: 'auto 0',
    opacity: 0.7,
  },

  '&.Mui-selected': {
    color: theme.palette.common.black,
    '.passage-label': {
      opacity: 1,
    },
    '.passage-label-underline': {
      backgroundColor: color.tertiary(),
    },
  },

  '&:hover': {
    '.passage-label-underline': {
      backgroundColor: color.tertiaryLight(),
    },
  },

  '& .MuiTouchRipple-root': {
    opacity: 0.7,
  },
}));

const Underline = styled('div')(({ theme }) => ({
  height: '2px',
  width: '100%',
  marginTop: '6px',
  background: theme.palette.common.white, // replace with color.background() once PD-2801 is DONE
}));

class StimulusTabs extends React.Component {
  state = {
    activeTab: 0,
    zoomCompensation: computeZoomCompensation(),
    containerWidth: 0,
  };

  containerRef = React.createRef();

  componentDidMount() {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', this.updateZoomCompensation);

    if (this.containerRef.current && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.updateContainerWidth);
      this.resizeObserver.observe(this.containerRef.current);
    }

    this.updateContainerWidth();
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('resize', this.updateZoomCompensation);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  updateZoomCompensation = () => {
    this.setState({ zoomCompensation: computeZoomCompensation() });
  };

  updateContainerWidth = () => {
    const node = this.containerRef.current;
    if (!node) return;
    const width = node.clientWidth;
    if (width !== this.state.containerWidth) {
      this.setState({ containerWidth: width });
    }
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
      event.stopPropagation();
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
    const { baseHeadingLevel } = this.props;
    const clampedLevel = baseHeadingLevel ? Math.min(6, Math.max(1, baseHeadingLevel)) : undefined;
    const TitleTag = baseHeadingLevel ? `h${clampedLevel}` : 'h2'; // default to h2 if no base level is provided - this was the previous behavior
    const textLevel = baseHeadingLevel ? Math.min(6, Math.max(1, clampedLevel + 1)) : undefined; // promote text headings one level above title

    return (
      <Passage key={tab.id} id={`tabpanel-${tab.id}`} role="tabpanel" aria-labelledby={`button-${tab.id}`}>
        {this.renderInstructions(tab.teacherInstructions, disabledTabs)}

        {tab.title && (
          <Purpose purpose="passage-title">
            <TitleTag>
              <PassageTitle dangerouslySetInnerHTML={{ __html: this.parsedText(tab.title) }} />
            </TitleTag>
          </Purpose>
        )}

        {tab.subtitle && (
          <Purpose purpose="passage-subtitle">
            <PassageSubtitle dangerouslySetInnerHTML={{ __html: this.parsedText(tab.subtitle) }} />
          </Purpose>
        )}

        {tab.author && (
          <Purpose purpose="passage-author">
            <PassageAuthor className="author" dangerouslySetInnerHTML={{ __html: this.parsedText(tab.author) }} />
          </Purpose>
        )}

        {tab.text && (
          <Purpose purpose="passage-text">
            <div key={tab.id} className="text" dangerouslySetInnerHTML={{ __html: baseHeadingLevel ? transformDataHeadings(tab.text, textLevel) : tab.text }} />
          </Purpose>
        )}
      </Passage>
    );
  }

  render() {
    const { model, tabs, disabledTabs } = this.props;
    const { activeTab, zoomCompensation, containerWidth } = this.state;

    if (!tabs?.length) {
      return;
    }

    const { extraCSSRules } = model || {};
    const selectedTab = (tabs || []).find((tab) => tab.id === activeTab);

    // cap each tab at 1/n of the passage container width so a single long
    // title can't push other tabs off-screen. Existing two-line wrap + ellipsis
    // on .passage-label still trims anything that doesn't fit.
    const tabMaxWidth = containerWidth > 0 ? containerWidth / tabs.length : null;
    // When per-tab horizontal space drops to NUMERIC_LABEL_MIN_WIDTH_PER_TAB or
    // less, titles become unreadably truncated; swap to "Passage N" so users
    // can still navigate. Container width is read once layout has settled
    // (>0), so initial render uses real labels.
    const useNumericLabels =
      containerWidth > 0 && containerWidth <= tabs.length * NUMERIC_LABEL_MIN_WIDTH_PER_TAB;

    return (
      <UiLayout extraCSSRules={extraCSSRules}>
        <PassagesContainer className="passages" ref={this.containerRef}>
          {disabledTabs || tabs.length === 1 ? (
            tabs.map((tab) => this.renderTab(tab, disabledTabs))
          ) : (
            <>
              <Tabs
                sx={{
                  // Below the breakpoint (e.g. WCAG 400% zoom, ~320px viewport)
                  // the tabs are in normal flow and scroll with the passage text,
                  // so they don't lock up space needed to display the passage.
                  position: 'static',
                  // Above the breakpoint there is adequate screen space, so the
                  // tabs stay locked to the top of the panel while the passage
                  // text scrolls beneath them.
                  [`@media (min-width: ${STICKY_TABS_BREAKPOINT + 1}px)`]: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  },
                  background: color.background(),
                  color: color.text(),
                  fontFamily: 'Roboto, sans-serif',
                  // Freeze the tabs' physical size at their 200%-zoom appearance
                  // when browser zoom exceeds 200%. The factor is 1 at zoom <= 200%,
                  // so behavior below that threshold is unchanged. Using `zoom`
                  // (rather than transform: scale) shrinks the layout box itself,
                  // so the reclaimed space flows to the passage content below.
                  zoom: zoomCompensation,
                  '& .MuiTabs-list': {
                    backgroundColor: color.white(),
                    borderBottom: '1px solid #D9DADA',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: color.white(),
                    marginBottom: '-1px',
                  },
                }}
                value={activeTab}
                onChange={this.handleChange}
              >
                {tabs.map((tab, index) => (
                  <TabStyled
                    key={tab.id}
                    id={`button-${tab.id}`}
                    sx={tabMaxWidth ? { maxWidth: `${tabMaxWidth}px` } : undefined}
                    label={
                      <>
                        <Purpose purpose="passage-label">
                          {useNumericLabels ? (
                            <span className="passage-label">{`Passage ${index + 1}`}</span>
                          ) : (
                            <span
                              className="passage-label"
                              dangerouslySetInnerHTML={{ __html: this.parsedText(tab.label) }}
                            />
                          )}
                        </Purpose>
                        <Underline className="passage-label-underline" />
                      </>
                    }
                    value={tab.id}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                    aria-controls={`tabpanel-${tab.id}`}
                    aria-selected={activeTab === tab.id}
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
  baseHeadingLevel: PropTypes.number,
};

export default StimulusTabs;
