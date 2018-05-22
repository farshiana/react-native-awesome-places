module.exports = {
	parser: 'babel-eslint',
	extends: ['prettier', 'airbnb'],
	env: {
		browser: true,
		jest: true,
	},
	globals: {
		__DEV__: true,
	},
	rules: {
		indent: [2, 'tab', { SwitchCase: 1 }],
		'no-tabs': 0,
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-indent-props': [2, 'tab'],
		'react/jsx-filename-extension': 'off',
		'no-console': 'off',
		'linebreak-style': 'off',
		'consistent-return': 'off',
		'react/require-default-props': 'off',
	},
};
