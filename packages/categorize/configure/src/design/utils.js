export const getPluginProps = (props = {}, baseInputConfiguration = {}) => ({
  ...baseInputConfiguration,
  ...props,
});
