/* eslint-disable no-process-exit */
'use strict';

const {spawn} = require('child_process');

const arrayDiffer = require('array-differ');
const log = require('logalot');
const stringifyObject = require('stringify-object');
const unconfiguredESLintRules = require('unconfigured-eslint-rules');

const configId = require.resolve('.');

spawn('node', ['node_modules/eslint/bin/eslint.js', '--config', configId, '.'], {stdio: 'inherit'})
.on('exit', code => {
  if (code !== 0) {
    process.exit(code);
  }

  const explicitlyUnconfigured = [
    // Possible Errors: http://eslint.org/docs/rules/#possible-errors
    'no-console',
    'no-continue',
    'valid-jsdoc',

    // Best Practices: http://eslint.org/docs/rules/#best-practices
    'default-case',
    'no-empty-function',
    // because 'no-labels' is already enabled
    'no-extra-label',
    'no-invalid-this',
    'no-magic-numbers',
    'no-new',
    'no-param-reassign',
    'no-process-env',
    'no-sequences',
    'vars-on-top',
    // because 'no-labels' is already enabled
    'no-unused-labels',

    // Strict Mode: http://eslint.org/docs/rules/#strict-mode
    'strict',

    // Variables: http://eslint.org/docs/rules/#variables
    'no-undefined',
    'init-declarations',

    // Node.js and CommonJS: http://eslint.org/docs/rules/#nodejs-and-commonjs
    'callback-return',
    'global-require',
    'no-restricted-imports',
    'no-restricted-modules',
    'no-sync',

    // Stylistic Issues: http://eslint.org/docs/rules/#stylistic-issues
    'capitalized-comments',
    'consistent-this',
    'func-name-matching',
    'func-names',
    'func-style',
    'id-length',
    'id-match',
    'jsx-quotes',
    'lines-around-comment',
    'max-depth',
    'max-len',
    'max-statements',
    'multiline-ternary',
    'newline-after-var',
    'newline-before-return',
    'no-bitwise',
    'no-inline-comments',
    'no-mixed-operators',
    'no-negated-condition',
    'no-plusplus',
    'no-tabs',
    'no-ternary',
    'object-curly-newline',
    // because 'one-var' is already disallowed
    'one-var-declaration-per-line',
    'require-jsdoc',
    'sort-keys',
    'sort-vars',
    'sort-imports',
    'wrap-regex',

    // ECMAScript 6: http://eslint.org/docs/rules/#ecmascript-6
    'arrow-body-style',
    'no-confusing-arrow',
    'no-var',
    'no-useless-constructor',
    'object-shorthand',
    'prefer-arrow-callback',
    'prefer-const',
    'prefer-spread',
    'prefer-reflect',
    'prefer-template',

    // Deprecated http://eslint.org/docs/rules/#deprecated
    'no-native-reassign',
    'no-negated-in-lhs',
    'no-spaced-func'
  ];
  const actuallyUnconfigured = unconfiguredESLintRules({configFile: configId});
  const unexpected = {
    unconfigured: arrayDiffer(actuallyUnconfigured, explicitlyUnconfigured),
    configured: arrayDiffer(explicitlyUnconfigured, actuallyUnconfigured)
  };

  Object.keys(unexpected).forEach(key => {
    if (unexpected[key].length === 0) {
      return;
    }

    log.error(`These rules are unexpectedly ${key}:\n${stringifyObject(unexpected[key], {indent: '  '})}`);
    process.exit(1);
  });

  log.success('Rules are configured as you expected.');
});
