module.exports = {
	title: 'Valon CLI',
	description: 'Just playing around',

	themeConfig: {
		displayAllHeaders: true,
		sidebarDepth: 1,
		search: true,
		serviceWorker: true,
		repo: 'stefanoruth/valon-cli',
		editLinks: true,
		lastUpdated: 'Last Updated',

		nav: [
			{ text: 'Home', link: '/master/' },
			{ text: 'Changelog', link: 'https://github.com/stefanoruth/valon-cli/releases' },
		],

		sidebar: {
			'/master/': require('./master'),
		},
	},
}
