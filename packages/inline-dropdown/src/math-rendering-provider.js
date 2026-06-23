/**
 * Math-rendering provider (player).
 *
 * The hotfix bundle externalizes `@pie-lib/math-rendering`, expecting the host
 * player to expose it on `window['@pie-lib/math-rendering']`. Older players
 * (e.g. pie-player-components@3.8.3) do not provide it, so `renderMath` ends up
 * undefined at runtime.
 *
 * To stay self-contained we bundle the renamed copy
 * (`@pie-lib/render-math-bundled`) and publish it onto the expected global so
 * any externalized `@pie-lib/math-rendering` consumers resolve to it. This must
 * be imported before any module that uses the externalized math-rendering.
 */
import * as renderMathBundled from '@pie-lib/render-math-bundled';

if (typeof window !== 'undefined') {
  const existing = window['@pie-lib/math-rendering'];

  if (!existing || typeof existing.renderMath !== 'function') {
    window['@pie-lib/math-rendering'] = { ...renderMathBundled };
  }
}
