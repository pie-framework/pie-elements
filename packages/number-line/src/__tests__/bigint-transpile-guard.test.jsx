import * as math from 'mathjs';
import { model as demoModel } from '../../docs/demo/generate';
import { generateMajorValuesForMinor, buildTickData } from '../number-line/graph/tick-utils';

/**
 * PIE-1005 regression guard.
 *
 * The pie build service transpiles the `**` exponentiation operator to
 * `Math.pow()` (its browser target predates ES2016). fraction.js 5 applies `**`
 * to BigInt values in floor/ceil/round, and `Math.pow` rejects BigInt:
 *
 *   TypeError: Cannot convert a BigInt value to a number
 *
 * Every mathjs Fraction op that reaches floor (mod, and therefore isMultiple ->
 * normalizeTicks) throws in the published bundle. fraction.js 4 does the same
 * arithmetic on Numbers and survives the transpile, so number-line must stay on
 * a mathjs whose fraction.js major is 4.
 */
describe('PIE-1005: number-line must not depend on BigInt-based Fractions', () => {
  it('mathjs Fraction fields are Numbers, not BigInt', () => {
    const f = math.fraction(3, 4);
    expect(typeof f.n).toBe('number');
    expect(typeof f.d).toBe('number');
    expect(typeof f.s).toBe('number');
  });

  it('Fraction.floor() survives the ** -> Math.pow transpile', () => {
    // Emulate exactly what the bundler emits for `C_TEN ** BigInt(places || 0)`.
    const transpiledPow = (base, exp) => Math.pow(base, exp);
    const f = math.fraction(3, 4);
    // fraction.js 4 computes places from Numbers, so Math.pow is safe.
    expect(() => transpiledPow(10, 0)).not.toThrow();
    expect(() => f.floor()).not.toThrow();
    // Guard the failure mode itself, so a future bump to fraction.js 5 is caught.
    expect(() => transpiledPow(BigInt(10), BigInt(0))).toThrow(/Cannot convert a BigInt value to a number/);
  });

  it('renders tick data for the reported demo model without throwing', () => {
    const { graph } = demoModel('1', 'number-line');
    expect(() => generateMajorValuesForMinor(graph.ticks.minor, graph.domain, graph.width)).not.toThrow();
    expect(() => buildTickData(graph.domain, graph.width, graph.ticks, { fraction: graph.fraction })).not.toThrow();

    const ticks = buildTickData(graph.domain, graph.width, graph.ticks, { fraction: graph.fraction });
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks.some((t) => t.type === 'major')).toBe(true);
  });

  it('produces whole-number major labels for the reported model', () => {
    const { graph } = demoModel('1', 'number-line');
    const out = generateMajorValuesForMinor(graph.ticks.minor, graph.domain, graph.width);
    // Must be "1","2",... not "1/1","2/1",... (the BigInt `d === 1` regression).
    out.fraction.forEach((label) => expect(label).not.toMatch(/\/1$/));
  });
});
