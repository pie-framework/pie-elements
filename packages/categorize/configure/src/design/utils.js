export const getPluginProps = (props = {}, baseInputConfiguration = {}) => {
  return Object.assign(
    {
      ...baseInputConfiguration,
    },
    props || {},
  );
};
