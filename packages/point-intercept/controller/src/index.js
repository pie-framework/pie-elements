export const model = (question, session, env) => {
  const { model: { config } } = question;
  return Promise.resolve({
    width: config.graphWidth,
    height: config.graphHeight,
    disabled: env.mode !== 'gather',
    pointLabels: ['A', 'B', 'C', 'D'],
    domain: {
      min: config.domainMin,
      max: config.domainMax,
      padding: config.domainGraphPadding,
      step: config.domainStepValue,
      snap: config.domainSnapValue
    },
    range: {
      min: config.rangeMin,
      max: config.rangeMax,
      padding: config.rangeGraphPadding,
      step: config.rangeStepValue,
      snap: config.rangeSnapValue
    }
  });
};
