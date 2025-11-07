import React from 'react';
import Select from '@mui/material/Select';

/**
 * Custom transition component that works with Web Components
 * Bypasses MUI's Grow component useTimeout hook which causes crashes in Web Components
 * Uses CSS transitions instead of JS-based animation hooks
 * See: https://github.com/mui/material-ui/issues/47205
 */
export const WebComponentSafeTransition = React.forwardRef(({ children, in: inProp }, ref) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (inProp) {
      // Use RAF to ensure the element is mounted before applying the visible class
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMounted(true);
        });
      });
    } else {
      setMounted(false);
    }
  }, [inProp]);

  if (!inProp && !mounted) {
    return null;
  }

  const style = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'scale(1)' : 'scale(0.9)',
    transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'top center',
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
});

/**
 * Web Component-safe Select wrapper
 *
 * Fixes MUI Select crash when used inside custom HTMLElements with createRoot(this)
 *
 * Required fixes:
 * - disablePortal: true - Keeps menu in Web Component's React tree
 * - TransitionComponent: NoTransition - Bypasses Grow transition's useTimeout
 *
 * Trade-offs:
 * - Smooth fade + scale animation (200ms)
 * - Menu may be clipped by parent overflow: hidden
 * - Menu won't break out of scrolling containers
 *
 * @param {object} props - All standard MUI Select props
 */
export const WebComponentSafeSelect = ({ MenuProps = {}, ...props }) => {
  return (
    <Select
      {...props}
      MenuProps={{
        ...MenuProps,
        disablePortal: true,
        TransitionComponent: WebComponentSafeTransition,
      }}
    />
  );
};

export default WebComponentSafeSelect;
