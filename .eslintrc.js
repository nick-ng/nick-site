module.exports = {
    "extends": "airbnb",
    "env": {
        "browser": true
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        // only .jsx files may have JSX
        "react/jsx-filename-extension": "off",
        // windows Git can be configured to automatically replace CRLF with LF
        "linebreak-style": "off",
    }
};