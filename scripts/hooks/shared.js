const { execSync } = require('child_process');

const {
  readdirSync,
  readJsonSync,
  writeJsonSync,
  readFileSync,
  pathExistsSync
} = require('fs-extra');
const _ = require('lodash');
const debug = require('debug');
const chalk = require('chalk');
const minimist = require('minimist');
const semver = require('semver');
const log = debug('scripts:hooks:shared');
const pacote = require('pacote');
const { resolve, join, dirname, basename } = require('path');
const lockfile = require('@yarnpkg/lockfile');

exports.getLockFile = () => {
  const f = readFileSync(resolve(__dirname, '..', '..', 'yarn.lock'), 'utf8');
  return lockfile.parse(f);
};

exports.getCurrentBranch = () =>
  execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();

const pkgInfo = dir => {
  if (pathExistsSync(dir)) {
    const path = join(dir, 'package.json');
    const pkg = readJsonSync(path);
    return { path, pkg };
  }
};

exports.getPackageFiles = () => {
  const root = resolve(__dirname, '..', '..', 'packages');
  const dirs = readdirSync(root);
  return _(
    dirs.map(d => {
      const out = [];
      out.push(pkgInfo(join(root, d)));
      out.push(pkgInfo(join(root, d, 'controller')));
      out.push(pkgInfo(join(root, d, 'configure')));
      return out;
    })
  )
    .flatten()
    .compact()
    .value();
};

const getSatisfyingVersions = async (name, range) => {
  const p = await pacote.packument(`${name}@latest`);

  const satisfying = Object.keys(p.versions).filter(v =>
    semver.satisfies(v, range)
  );
  log(name, range, 'satisfying:', satisfying);
  return satisfying;
};

const getLatestSatisfying = async (name, nextResolved) => {
  const baseVersion = semver.coerce(nextResolved);
  const range = new semver.Range(`^${baseVersion.toString()}`);
  const satisfying = await getSatisfyingVersions(name, range.raw);

  if (satisfying.length === 0) {
    return undefined;
  }
  satisfying.sort((a, b) => (semver.gt(a, b) ? 1 : semver.eq(a, b) ? 0 : -1));

  const latest = satisfying[satisfying.length - 1];
  log('[getLatestSatisfyingVersion] ', name, nextResolved, latest);
  return latest;
};

exports.checkDependencies = async (lock, i) => {
  const pkg = i.pkg;

  const keys = Object.keys(pkg.dependencies || {});

  const results = await Promise.all(
    keys.map(async k => {
      if (!k.startsWith('@pie-ui')) {
        return;
      }

      const target = pkg.dependencies[k];
      if (target === 'next') {
        const resolvedVersion = lock.object[`${k}@next`].version;
        const bestVersion = await getLatestSatisfying(k, resolvedVersion);

        if (bestVersion) {
          return { name: k, version: bestVersion };
        } else {
          return {
            name: k,
            resolvedVersion,
            warning: `Cant find latest for ${k}`
          };
        }
      }
    })
  );

  const groups = _.groupBy(_.compact(results), r =>
    r.version ? 'fixable' : 'notFixable'
  );

  groups.fixable = groups.fixable
    ? groups.fixable.reduce((acc, d) => {
        acc[d.name] = d.version;
        return acc;
      }, {})
    : undefined;

  groups.notFixable = groups.notFixable
    ? groups.notFixable.reduce((acc, d) => {
        acc[d.name] = d.resolvedVersion;
        return acc;
      }, {})
    : undefined;
  return { ...i, ...groups };
};
