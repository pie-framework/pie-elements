import { getPluginProps } from '../utils';
import React from 'react';
import withStyles from '@mui/styles/withStyles';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/render-ui';

const styles = (theme) => ({
  rowLabel: {
    gridColumn: '1/3',
  },
  rowLabelHolder: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
  },
});

export const RowLabel = withStyles(styles)(
  ({
    categoriesPerRow,
    classes,
    configuration,
    disabled,
    markup,
    imageSupport,
    onChange,
    toolbarOpts,
    spellCheck,
    maxImageWidth,
    maxImageHeight,
    uploadSoundSupport,
    mathMlOptions = {},
  }) => {
    const { rowLabels, baseInputConfiguration } = configuration;

    return (
      <div
        style={{
          gridColumn: `1/${categoriesPerRow + 1}`,
          width: '100%',
        }}
      >
        <InputContainer label="Row Label" className={classes.rowLabelHolder}>
          <EditableHtml
            disabled={disabled}
            markup={markup}
            onChange={onChange}
            imageSupport={imageSupport}
            nonEmpty={false}
            toolbarOpts={toolbarOpts}
            pluginProps={getPluginProps(rowLabels?.inputConfiguration, baseInputConfiguration)}
            spellCheck={spellCheck}
            maxImageWidth={maxImageWidth}
            maxImageHeight={maxImageHeight}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
          />
        </InputContainer>
      </div>
    );
  },
);
