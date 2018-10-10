/* Babel config for the main process */
module.exports = (api) => {
  api.cache(true);
  return ({
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            electron: '3.0.2',
          },
          modules: 'commonjs',
          useBuiltIns: 'usage',
          // debug: true,
        },
      ],
    ],
    plugins: [
      'babel-plugin-redux-saga',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-do-expressions',
      [
        // used only for babel helpers
        '@babel/plugin-transform-runtime',
        {
          // regenerator runtime should be used from global polyfill
          regenerator: false,
        },
      ],
      [
        // uset for
        'module-resolver',
        {
          alias: {
            shared: './app/shared',
            config: './app/config',
          },
        },
      ],
    ],
  });
};
