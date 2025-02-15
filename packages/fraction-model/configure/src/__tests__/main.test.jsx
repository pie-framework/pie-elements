import { shallow } from 'enzyme';
import React from 'react';
import { Main } from '../main';
import defaultValues from '../defaults';
import ModelOptions from '../model-options';
import CardBar from '../card-bar';
import { FormSection } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  FormSection: (props) => <div {...props} />,
}));

jest.mock('@pie-lib/pie-toolbox/editable-html', () => ({
  EditableHtml: (props) => <div {...props} />,
}));

jest.mock('lodash/debounce', () => (fn) => fn);

jest.spyOn(Math, 'random').mockReturnValue(0);

const defaultProps = {
  model: {
    correctResponse: [],
    title: '',
    prompt: '',
    modelTypeSelected: 'bar',
    maxModelSelected: 1,
    partsPerModel: 5,
    allowedStudentConfig: false,
    showGraphLabels: false,
  },
  configuration: defaultValues.configuration,
};

describe('Main', () => {
  let onChange;
  let onConfigurationChanged;
  let uploadSoundSupport;
  let imageSupport;

  beforeEach(() => {
    onChange = jest.fn();
    onConfigurationChanged = jest.fn();
    uploadSoundSupport = jest.mock();
    imageSupport = jest.mock();
  });

  const wrapper = (props) => {
    return shallow(
      <Main
        classes={{}}
        onChange={onChange}
        onConfigurationChanged={onConfigurationChanged}
        model={defaultProps.model}
        configuration={defaultProps.configuration}
        uploadSoundSupport={uploadSoundSupport}
        imageSupport={imageSupport}
        {...props}
      />,
    );
  };

  it('snapshot renders', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const component = wrapper();
    expect(component.find(CardBar).length).toEqual(2);
    expect(component.find(ModelOptions).length).toEqual(1);
    expect(component.find(FormSection).length).toEqual(4);
    expect(component.find(EditableHtml).length).toEqual(2);
  });
});
