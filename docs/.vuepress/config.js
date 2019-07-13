module.exports = {
	title: 'Console',
	description: 'Just playing around',
	themeConfig: {
		search: false,
		repo: 'stefanoruth/console',
		editLinks: true,
		lastUpdated: 'Last Updated',
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Guide', link: '/guide/' },
			{ text: 'Changelog', link: 'https://github.com/stefanoruth/console/releases' },
		],
		sidebar: {
			'/guide/': [
				{
					title: 'Guide',
					collapsable: false,
					children: ['', 'getting-started', 'table'],
				},
			],
		},
	},
}
