import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import { stripHtmlTags, decodeHTML } from './markupUtils';

const findSlateNode = (key) => {
  return window.document.querySelector('[data-key="' + key + '"]');
};

export class ECRToolbar extends React.Component {
  static propTypes = {
    correctChoice: PropTypes.object,
    classes: PropTypes.object,
    node: PropTypes.object,
    onDone: PropTypes.func,
    onChangeResponse: PropTypes.func.isRequired,
    onToolbarDone: PropTypes.func.isRequired,
    value: PropTypes.shape({
      change: PropTypes.func.isRequired,
      document: PropTypes.shape({
        getNextText: PropTypes.func.isRequired,
      }),
    }),
    maxLengthPerChoiceEnabled: PropTypes.bool,
    pluginProps: PropTypes.object,
    spellCheck: PropTypes.bool,
  };

    state = {
        markup: '',
        toolbarStyle: {},
    };

  componentDidMount() {
    const { correctChoice, node } = this.props;
    const choice = correctChoice || {};

    const domNode = findSlateNode(node.key);

    if (domNode) {
      //eslint-disable-next-line
      const domNodeRect = domNode.getBoundingClientRect();
      const editor = domNode.closest('[data-slate-editor]');
      const editorRect = editor.getBoundingClientRect();
      const top = domNodeRect.top - editorRect.top;
      const left = domNodeRect.left - editorRect.left;

      this.setState({
        markup: choice.label,
        toolbarStyle: {
          position: 'absolute',
          top: `${top + domNodeRect.height + 17}px`,
          left: `${left + 20}px`,
          width: `${domNodeRect.width - 4}px`,
        },
      });
    }
  }

    onDone = (markup) => {
        const { node, value, onToolbarDone, onChangeResponse } = this.props;
        const sanitizedMarkup = decodeHTML(stripHtmlTags(markup));
        this.setState({ markup: sanitizedMarkup });

        const updatedData = { ...node.data.toJSON(), value: sanitizedMarkup };
        const change = value.change().setNodeByKey(node.key, { data: updatedData });
        const nextText = value.document.getNextText(node.key);

        change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
        onToolbarDone(change, true);
        onChangeResponse(sanitizedMarkup);
    };

    onRespAreaChange = (respAreaMarkup) => {
        this.setState({ respAreaMarkup });
    };

    onKeyDown = (event) => {
        if (event.key === 'Enter') {
            return false;
        }
    };

    onBlur = () => {
        if (this.clickedInside) {
            this.clickedInside = false;
        }
    };

    render() {
        const { classes, maxLengthPerChoiceEnabled, pluginProps, spellCheck } = this.props;
        const { markup, toolbarStyle } = this.state;
        const inputProps = maxLengthPerChoiceEnabled ? {} : { maxLength: 25 };

        return (
            <div style={toolbarStyle}>
                <EditableHtml
                    autoFocus={true}
                    className={classes.markup}
                    disableUnderline
                    onChange={(respAreaMarkup) => {
                        if (this.preventDone) {
                            return;
                        }
                        this.onRespAreaChange(respAreaMarkup);
                    }}
                    onDone={(val) => {
                        if (this.preventDone) {
                            return;
                        }
                        this.onDone(val);
                    }}
                    onBlur={(e) => {
                        this.preventDone = e.relatedTarget && e.relatedTarget.closest('.insert-character-dialog');
                        this.onBlur(e);
                    }}
                    onKeyDown={this.onKeyDown}
                    markup={markup || ''}
                    activePlugins={['languageCharacters']}
                    pluginProps={pluginProps}
                    languageCharactersProps={[{ language: 'spanish' }]}
                    minHeight={'15px'}
                    maxHeight={'15px'}
                    spellCheck={spellCheck}
                    autoWidthToolbar
                    toolbarOpts={{
                        minWidth: 'auto',
                        isHidden: !!pluginProps?.characters?.disabled
                }}
                    {...inputProps}
                />
            </div>
        );
    }
}

const StyledECRToolbar = withStyles((theme) => ({
    markup: {
        backgroundColor: theme.palette.common.white,
        outline: 'none',
        lineHeight: '15px'
    },
}))(ECRToolbar);

export default StyledECRToolbar;
