import { DEFAULT_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';

export const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
  (p) => p !== 'table' && p !== 'bulleted-list' && p !== 'numbered-list',
);
