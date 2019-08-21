module.exports = {
	title: 'Valon CLI',
    description: 'Just playing around',
    base: '/valon-cli/',

	themeConfig: {
		displayAllHeaders: true,
		sidebarDepth: 1,
		search: true,
		serviceWorker: true,
		repo: 'stefanoruth/valon-cli',

		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Changelog', link: 'https://github.com/stefanoruth/valon-cli/releases' },
		],

		sidebar: {
			'/master/': require('./master'),
		},
	},
}
