module.exports = {
  // presets: [
  //   [
  //     'module:metro-react-native-babel-preset',
  //     { unstable_transformProfile: 'hermes-stable' },
  //   ],
  // ],
  "presets": [
    [
      "@babel/preset-env",
      { "bugfixes": true },
    ],
    ["@babel/preset-typescript"],
    [
      'module:metro-react-native-babel-preset',
      { unstable_transformProfile: 'hermes-stable' },
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ],
    [
      "@babel/plugin-proposal-private-methods",
      {
        "loose": true
      }
    ],
    [
      "@babel/plugin-proposal-private-property-in-object",
      {
        "loose": true
      }
    ]
  ]
};
