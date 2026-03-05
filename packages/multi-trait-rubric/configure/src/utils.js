import { DEFAULT_PLUGINS } from '@pie-lib/editable-html-tip-tap';
import { excludeZeroTypes } from './modals';

export const filteredDefaultPlugins = (DEFAULT_PLUGINS || []).filter(
  (p) => p !== 'table' && p !== 'bulleted-list' && p !== 'numbered-list',
);

export const addOrRemoveScaleColumn = (scales, excludeZeroType) => {
  if (!scales || !scales.length) {
    return [];
  }

  return scales.reduce((acc, scale) => {
    let { scorePointsLabels, traits } = scale || {};

    if (scorePointsLabels.length < 1) {
      return acc;
    }

    switch (excludeZeroType) {
      case excludeZeroTypes.remove0: {
        // removes column 0
        scorePointsLabels = scorePointsLabels.slice(1);
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: scorePointsDescriptors.slice(1),
        }));

        break;
      }

      case excludeZeroTypes.add0: {
        // adds empty column at start
        scorePointsLabels = ['', ...scorePointsLabels];
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: ['', ...scorePointsDescriptors],
        }));

        break;
      }

      case excludeZeroTypes.shiftLeft: {
        // removes last column
        scorePointsLabels = scorePointsLabels.slice(0, -1);
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: scorePointsDescriptors.slice(0, -1),
        }));

        break;
      }

      case excludeZeroTypes.shiftRight: {
        // adds empty column at end
        scorePointsLabels = [...scorePointsLabels, ''];
        traits = traits.map(({ scorePointsDescriptors, ...trait }) => ({
          ...trait,
          scorePointsDescriptors: [...scorePointsDescriptors, ''],
        }));

        break;
      }

      default:
        break;
    }

    acc.push({ ...scale, scorePointsLabels, traits });

    return acc;
  }, []);
};
