import { getPluginProps } from './utils';
import * as React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import AddRow from './add-row';
import Row from './row';
import debug from 'debug';
import lodash from 'lodash';
import EditableHtml, { DEFAULT_PLUGINS } from '@pie-lib/editable-html-tip-tap';
import { DragProvider } from '@pie-lib/drag';

const log = debug('pie-elements:match:configure');

const Container = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
}));

const RowContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  width: '100%',
  borderBottom: `2px solid ${theme.palette.grey['A100']}`,
  paddingBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const RowItem = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '&> div': {
    width: '120px',
    padding: `0 ${theme.spacing(1)}`,
    textAlign: 'center',
  },
}));

const DeleteIcon = styled('div')(({ theme }) => ({
  flex: 0.5,
  minWidth: '45px',
  padding: `0 ${theme.spacing(1)}`,
}));

const RowTable = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const ColumnErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: `${theme.spacing(1)} !important`,
  width: 'fit-content !important',
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingBottom: theme.spacing(1),
}));

// Global styles for EditableHtml components
const GlobalStyles = styled('div')(({ theme }) => ({
  '& .marginBottom': {
    marginBottom: theme.typography.fontSize - 2 + theme.spacing(1),
  },
  '& .headerInput': {
    '& > div': {
      fontWeight: 'bold',
    },
  },
}));

class AnswerConfigBlock extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onDeleteRow: PropTypes.func.isRequired,
    onAddRow: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    toolbarOpts: PropTypes.object,
    spellCheck: PropTypes.bool,
  };

  moveRow = (event) => {
    const { active, over } = event;

    if (!over || !active) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'row' && overData?.type === 'row') {
      const from = activeData.index;
      const to = overData.index;

      const { model, onChange } = this.props;
      const newModel = { ...model };
      const rows = newModel.rows || [];

      log('[moveRow]: ', from, to);

      const { movedRow, remainingRows } = rows.reduce(
        (acc, item, index) => {
          if (index === from) {
            acc.movedRow = item;
          } else {
            acc.remainingRows.push(item);
          }

          return acc;
        },
        { movedRow: null, remainingRows: [] },
      );

      const update = [...remainingRows.slice(0, to), movedRow, ...remainingRows.slice(to)];

      log('update: ', update);

      newModel.rows = update;

      onChange(newModel);
    }
  };

  onChange =
    (name, isBoolean) =>
      ({ target }) => {
        const { model, onChange } = this.props;
        let value;

        if (isBoolean) {
          value = target.checked;
        } else {
          value = target.value;
        }

        lodash.set(model, name, value);
        onChange(model, name);
      };

  onHeaderChange = (headerIndex) => (value) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    if (headerIndex === 0) {
      newModel.headers[headerIndex] = value;
      onChange(newModel);

      return;
    }

    newModel.headers[headerIndex] = value;
    onChange(newModel);
  };

  render() {
    const { model, onAddRow, imageSupport, configuration, toolbarOpts, spellCheck, uploadSoundSupport } =
      this.props;
    const {
      baseInputConfiguration = {},
      headers = {},
      rows = {},
      maxImageWidth = {},
      maxImageHeight = {},
      mathMlOptions = {},
      minQuestions,
    } = configuration || {};
    const { errors } = model || {};
    const { correctResponseError, rowsErrors, columnsErrors, noOfRowsError, columnsLengthError } = errors || {};

    const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
      (p) => p !== 'table' && p !== 'bulleted-list' && p !== 'numbered-list',
    );

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    return (
      <GlobalStyles>
        <DragProvider onDragEnd={this.moveRow}>
          <Container>
            <Typography type="body1" component="div">
              Click on the labels to edit or remove. Set the correct answers by clicking each correct answer per row.
            </Typography>

            <RowTable
              style={configuration.width ? { width: configuration.width, overflow: 'scroll' } : {}}
            >
              <RowContainer>
                {headers.settings &&
                  (model.headers || []).map((header, idx) => (
                    <RowItem
                      key={idx}
                      className={cx({
                        questionText: idx === 0,
                      })}
                      sx={idx === 0 ? {
                        flex: 2,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginRight: 1,
                        '&> div': {
                          width: '100%',
                          padding: 0,
                          maxWidth: 'unset',
                          textAlign: 'left',
                          minWidth: '200px',
                        },
                      } : {}}
                    >
                      <EditableHtml
                        onChange={this.onHeaderChange(idx)}
                        markup={header}
                        className={columnsErrors && !columnsErrors[idx] ? 'marginBottom' : 'headerInput'}
                        label={'column label'}
                        activePlugins={filteredDefaultPlugins}
                        pluginProps={getPluginProps(headers?.inputConfiguration, baseInputConfiguration)}
                        autoWidthToolbar
                        spellCheck={spellCheck}
                        uploadSoundSupport={uploadSoundSupport}
                        languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                        error={columnsErrors && columnsErrors[idx]}
                      />
                      {columnsErrors && columnsErrors[idx] && (
                        <ColumnErrorText>{columnsErrors[idx]}</ColumnErrorText>
                      )}
                    </RowItem>
                  ))}
                <DeleteIcon />
              </RowContainer>

              {model.rows.map((row, idx) => (
                <Row
                  key={idx}
                  model={model}
                  row={row}
                  idx={idx}
                  onDeleteRow={this.props.onDeleteRow}
                  onChange={this.props.onChange}
                  imageSupport={imageSupport}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheck}
                  error={rowsErrors?.[row.id]}
                  maxImageWidth={(maxImageWidth && maxImageWidth.rowTitles) || defaultImageMaxWidth}
                  maxImageHeight={(maxImageHeight && maxImageHeight.rowTitles) || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  mathMlOptions={mathMlOptions}
                  minQuestions={minQuestions}
                  inputConfiguration={getPluginProps(rows?.inputConfiguration, baseInputConfiguration)}
                />
              ))}

              {correctResponseError && <ErrorText>{correctResponseError}</ErrorText>}
              {noOfRowsError && <ErrorText>{noOfRowsError}</ErrorText>}
              {columnsLengthError && <ErrorText>{columnsLengthError}</ErrorText>}

              <AddRow onAddClick={onAddRow} />
            </RowTable>
          </Container>
        </DragProvider>
      </GlobalStyles>
    );
  }
}

export default AnswerConfigBlock;
