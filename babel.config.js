module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
        alias: {
          '@routing': './src/routing',
          '@screens': './src/screens',
          '@components': './src/components',
          '@storage': './src/storage',
        },
      },
    ],
  ],
};
