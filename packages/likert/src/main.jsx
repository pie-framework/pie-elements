import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { PreviewLayout } from '@pie-lib/render-ui';
import Likert from './likert';

class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    session: PropTypes.object,
    onSessionChange: PropTypes.func,
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    model: {},
    session: {},
  };

  render() {
    const { model, onSessionChange, session } = this.props;
    const { extraCSSRules } = model;

    return (
      <PreviewLayout extraCSSRules={extraCSSRules}>
        <Likert {...model} session={session} onSessionChange={onSessionChange} />
      </PreviewLayout>
    );
  }
}

const Styled = withStyles({}, { name: 'Main' })(Main);

const Root = (props) => (
    <Styled {...props} />
);

export default Root;
