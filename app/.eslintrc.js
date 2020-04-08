module.exports = {
    "env": {
        "es6": true,
        "jest/globals": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb-typescript",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
        "project": "tsconfig.json",
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "import",
        "jest",
    ],
    "settings": {
        "import/resolver": {
            "typescript": {
                "extensions": [".ts", ".tsx"],
            },
        },
    },
    "rules": {
        "prefer-const": ["error", { "destructuring": "all" }],
        "arrow-body-style": "off", // always require braces in arrow functions
        "max-len": ["error", 120],
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-param-reassign": "off",
        "no-underscore-dangle": "off",
        "spaced-comment": "off",
        "quote-props": ["error", "consistent"],
        "object-curly-newline": ["error", { "minProperties": 7, "consistent": true }],
        "no-unused-expressions": "off",
        "import/extensions": ["error", "ignorePackages", { "ts": "never", "tsx": "never" }], // allow importing ts files
        "import/prefer-default-export": "off", // don't require default exports
        "jsx-a11y/iframe-has-title": "off", // don't require iframe tags to have a title attribute
        "jsx-a11y/interactive-supports-focus": "off",
        "react/destructuring-assignment": "off",
        "react/prop-types": "off",
        "react/jsx-filename-extension": ["error", { "extensions": [".tsx", ".jsx"] }], // alow TSX to contain JSX
        "react/jsx-indent": ["error", 4, { checkAttributes: true, indentLogicalExpressions: true }],
        "react/jsx-one-expression-per-line": "off", // allow nested tags inline
        "react/jsx-indent-props": ["error", "first"], // control line breaks for JSX tags
        "react/no-unescaped-entities": "off", // allow literal quotes and brackets inside JSX tags
        "react/jsx-curly-spacing": ["error", { "when": "always" }], // always pad with a space inside JSX brackets
        "react/jsx-no-bind": "off", // allow binding to functions passed in props
        "react/jsx-props-no-spreading": "off", // allow spread props
        "@typescript-eslint/brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/no-empty-interface": "off",
    },
};
