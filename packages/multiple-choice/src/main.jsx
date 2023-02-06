import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import classNames from 'classnames';
import { PreviewLayout } from '@pie-lib/render-ui';
import MultipleChoice from './multiple-choice';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onChoiceChanged: PropTypes.func,
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    model: {},
    session: {},
  };
  constructor(props) {
    super(props);
    this.childRef = React.createRef();
  }

  componentDidMount() {
    const { model } = this.props;
    const ariaLabel = model.choiceMode == 'radio' ? 'Multiple Choice Question' : 'Multiple Correct Answer Question';

    const parentNode = this.childRef.current?.parentNode?.parentNode;
    parentNode.setAttribute('aria-label', ariaLabel);
    parentNode.setAttribute('role', 'region');
  }

  componentDidUpdate(prevProps) {
    const { model } = this.props;
    if (prevProps.model.choiceMode !== model.choiceMode) {
      const ariaLabel = model.choiceMode == 'radio' ? 'Multiple Choice Question' : 'Multiple Correct Answer Question';
      const parentNode = this.childRef.current.parentNode;
      parentNode.setAttribute('aria-label', ariaLabel);
    }
  }

  render() {
    const { model, onChoiceChanged, session, classes } = this.props;

    // model.partLabel is a property used for ebsr
    return (
      <PreviewLayout>
        {model.partLabel && <p>{model.partLabel}</p>}
        <div ref={this.childRef} className={classNames(classes.root, classes[model.className])}>
          <MultipleChoice {...model} session={session} onChoiceChanged={onChoiceChanged} />
        </div>
      </PreviewLayout>
    );
  }
}

const Styled = withStyles({}, { name: 'Main' })(Main);

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const Root = (props) => (
  <MuiThemeProvider theme={theme}>
    <Styled {...props} />
  </MuiThemeProvider>
);

export default Root;
