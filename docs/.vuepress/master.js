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
		title: 'Output',
		collapsable: false,
		children: prefix('output', ['progressbar']),
	},
]
