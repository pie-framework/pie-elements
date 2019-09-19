import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import AlternateSection from './alternateSection';

export class AlternateResponses extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  state = {};

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateChoicesIfNeeded(nextProps);
  }

  componentDidMount() {
    this.updateChoicesIfNeeded(this.props);
  }

  updateChoicesIfNeeded = props => {
    if (!this.state.choices
      || !isEqual(this.state.choices, props.model.choices)
      || !isEqual(props.model.choices, this.props.model.choices)
    ) {
      const { choices } = props.model;

      const selectedValues = reduce(choices, (obj, c, key) => {
        if (c.length > 1) {
          obj[key] = c[0];
        }

        return obj;
      }, {});

      this.setState({
        choices: props.model.choices,
        values: selectedValues
      });
    }
  };

  getRemainingChoices = valueKey => {
    const { choices } = this.state;
    const result = reduce(choices, (arr, c, key) => {
      if (c.length === 1 && !valueKey) {
        arr.push({
          label: c[0].label,
          value: key
        });
      }

      return arr;
    }, []);

    console.log(result);

    return result;
  };

  onChoiceChanged = (choice, key) => {
    const { onChange } = this.props;
    const { choices } = this.state;
    const sectionChoices = (choices[key] || []);

    const isNew = !sectionChoices.find(c => c.value === choice.value);

    const newChoices = sectionChoices.reduce((arr, c) => {
      const newVal = c.value === choice.value ? choice : c;

      arr.push(newVal);

      return arr;
    }, []);

    if (isNew) {
      newChoices.push(choice);
    }

    onChange({
      ...choices,
      [key]: newChoices
    });
  };

  onChoiceRemoved = (value, section) => {
    const { onChange } = this.props;
    const { choices } = this.state;
    const sectionChoices = (choices[section] || []);

    const newChoices = sectionChoices.reduce((arr, c) => {
      if (c.value === value) {
        return arr;
      }

      arr.push(c);

      return arr;
    }, []);

    onChange({
      ...choices,
      [section]: newChoices
    });
  };

  onSectionSelect = (choice, key) => {
    const { onChange } = this.props;
    const { choices, values } = this.state;

    if (choices[key] && choices[key].length > 1) {
      if (!choice) {
        onChange({
          ...choices,
          [key]: [choices[key][0]]
        });
      }
    } else {
      this.setState({
        choices: {
          ...choices,
          [key]: [
            ...choices[key],
            {
              label: '',
              value: '1'
            }
          ]
        },
        values: {
          ...values,
          [key]: choices[key][0]
        }
      });
    }
  };

  render() {
    const { choices } = this.state;

    return (
      <div>
        {map(choices, (c, key) => {
          if (c.length > 1) {
            const selected = this.state.values[key];

            return (
              <AlternateSection
                key={key}
                value={selected && selected.value}
                onSelect={choice => this.onSectionSelect(choice, key)}
                choiceChanged={choice => this.onChoiceChanged(choice, key)}
                choiceRemoved={value => this.onChoiceRemoved(value, key)}
                selectChoices={[selected]}
                choices={c}
              />
            );
          }
        })}
        {
          choices &&
          Object.keys(this.state.values).length !== Object.keys(choices).length &&
          <AlternateSection
            value=""
            onSelect={choice => this.onSectionSelect(choice, choice.value)}
            choiceChanged={choice => this.onChoiceChanged(choice)}
            choiceRemoved={value => this.onChoiceRemoved(value)}
            selectChoices={this.getRemainingChoices()}
          />
        }
      </div>
    );
  }
}

export default AlternateResponses;
