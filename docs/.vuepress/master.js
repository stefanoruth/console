function prefix(prefix, children) {
	return children.map(child => `${prefix}/${child}`)
}

module.exports = [
	{
		title: 'Getting Started',
		collapsable: false,
		children: ['introduction'],
	},
	{
		title: 'Commands',
		collapsable: false,
		children: prefix('commands', ['signature']),
	},
	{
		title: 'Output',
		collapsable: false,
		children: prefix('output', ['text', 'table', 'progressbar', 'question']),
	},
]
