module.exports = {
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'installedESLint': true,
    'plugins': [
        'react', 'async-await', 'class-property'
    ],
    'rules': {
        //react plugins
        'react/wrap-multilines': 'off',
        'react/jsx-no-bind': 'off',
        'react/jsx-first-prop-new-line': ['error', 'never'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/prop-types': ['error', ],
        'object-shorthand': 'off',
        'prefer-template': 'off',
        'no-unused-vars': ['error', { 'varsIgnorePattern': 'React' }],
        'no-underscore-dangle': 'off',
        'import/no-unresolved': 'off',
        'max-len': 'off',
        'no-trailing-spaces': ['error'],
        'eol-last': 'off',
        'object-curly-spacing': 'off',
        'no-param-reassign': 'off',
        'no-confusing-arrow': 'off',
        'space-before-function-paren': ["error", "never"],
        'async-await/space-after-async': 1,
        'async-await/space-after-await': 1,
        'indent': ['error', 4],
        'comma-dangle': ['error', 'never'],
        'no-return-assign': 'off',
        'prefer-arrow-callback': 'off',
        'new-cap': [
            'error', {
                'capIsNew': false
            }
        ],

        'no-restricted-syntax': [
            'error',
            'DebuggerStatement',
            'LabeledStatement',
            'WithStatement',
        ],

        'no-console': ['error', {'allow': ['warn', 'error']}],
        'keyword-spacing': [
            'error', {
                'before': false,
                'after': false,
                'overrides': {
                    'case': {
                        'after': true
                    },
                    'catch': {
                        'before': true
                    },
                    'this': {
                        'before': true
                    },
                    'try': {
                        'after': true
                    },
                    'import': {
                        'before': true,
                        'after': true
                    },
                    'else': {
                        'before': true,
                        'after': true
                    },
                    'return': {
                        'before': true,
                        'after': true
                    },
                    'from': {
                        'before': true,
                        'after': true
                    }
                }
            }
        ]
    }
};
