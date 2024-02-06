/**
 *  disable text selection
 */
export const noSelect = () => ({
  cursor: 'default',
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none',
});
