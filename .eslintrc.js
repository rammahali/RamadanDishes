module.exports = {
    "env": {
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true,
                "mocha": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
