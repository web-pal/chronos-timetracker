module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "settings": {
      "ecmascript": 6,
      "jsx": true
    },
    "plugins": [
      "react",
      "jsx-a11y"
    ],
    "env": {
      "browser": true,
    },
    "rules": {
      "jsx-a11y/img-uses-alt": "off",
      "jsx-a11y/redundant-alt": "off",
      "jsx-a11y/valid-aria-role": "off",
      "new-cap": "off",
      "no-confusing-arrow": 0,
      "react/forbid-prop-types": 0,
    },
    "globals": {
      "Immutable": true,
    }
};
