import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EditableHtml from '@pie-lib/editable-html';

const styles = (theme) => ({
    rowLabel: {
        gridColumn: '1/3',
    },
    rowLabelHolder: {
        width: '100%',
    },
});

export const RowLabel = withStyles(styles)(
    ({
         categoriesPerRow,
         classes,
         disabled,
         markup,
         imageSupport,
         onChange,
         toolbarOpts,
         spellCheck,
         maxImageWidth,
         maxImageHeight,
         uploadSoundSupport,
     }) => {

        return (
            <div
                style={{
                    gridColumn: `1/${categoriesPerRow + 1}`,
                    width: '100%',
                }}
            >
                <Typography className={classes.text}>Row Label</Typography>
                <EditableHtml
                    className={classes.rowLabelHolder}
                    disabled={disabled}
                    markup={markup}
                    onChange={onChange}
                    imageSupport={imageSupport}
                    nonEmpty={false}
                    toolbarOpts={toolbarOpts}
                    spellCheck={spellCheck}
                    maxImageWidth={maxImageWidth}
                    maxImageHeight={maxImageHeight}
                    uploadSoundSupport={uploadSoundSupport}
                    languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                />
            </div>
        );
    },
);
