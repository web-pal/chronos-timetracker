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
    "rules": {
      "jsx-a11y/img-uses-alt": "off",
      "jsx-a11y/redundant-alt": "off",
      "jsx-a11y/valid-aria-role": "off",
      "new-cap": "off"
    },
    "globals": {
      "Immutable": true
    }
};
