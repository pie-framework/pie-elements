import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Panel from './panel';
import PartialForCategory from './partial-for-category';
import Grid, { Cell } from './grid';

export class Partial extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    partial: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    categories: PropTypes.array,
    correctResponse: PropTypes.array
  };

  static defaultProps = {};

  toggleEnabled = () => {
    const { partial, onChange } = this.props;
    partial.enabled = !partial.enabled;
    onChange(partial);
  };

  changeInnerPartial = p => {
    const { partial, onChange } = this.props;
    const index = partial.rules.find(r => r.category === p.category);
    if (index !== -1) {
      partial.rules.splice(index, 1, p);
      onChange(partial);
    }
  };
  render() {
    const {
      classes,
      className,
      partial,
      categories,
      correctResponse
    } = this.props;
    return (
      <div className={classNames(classes.partial, className)}>
        <Panel
          title="Partial Scoring"
          enabled={partial.enabled}
          onToggleEnabled={this.toggleEnabled}
        >
          <Grid headings={['Category', 'Scoring']} size={'40% 1fr'}>
            {categories.map((c, index) => (
              <React.Fragment key={index}>
                <Cell html={c.label} />
                <Cell>
                  <PartialForCategory
                    key={index}
                    category={c}
                    correctResponse={correctResponse.find(
                      r => r.category === c.id
                    )}
                    onChange={this.changeInnerPartial}
                    partial={partial.rules.find(r => r.category === c.id)}
                  />
                </Cell>
              </React.Fragment>
            ))}
          </Grid>
        </Panel>
      </div>
    );
  }
}
const styles = theme => ({
  partial: {}
});
export default withStyles(styles)(Partial);
