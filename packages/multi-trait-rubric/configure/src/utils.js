import {DEFAULT_PLUGINS} from '@pie-lib/editable-html';

export const filteredDefaultPlugins = DEFAULT_PLUGINS.filter(p => p !== 'table' && p !== 'bulleted-list' && p !== 'numbered-list');

export const labelPlugins = {
  image: { disabled: true },
  math: { disabled: true },
  audio: { disabled: true },
  video: { disabled: true }
};
