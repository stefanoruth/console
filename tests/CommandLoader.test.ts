import { CommandLoader } from '../src/Commands'

describe('CommandLoader', () => {
	//
	test('It can load commands dynamicly from a folder', async () => {
		const loader = new CommandLoader()

		await loader.load(__dirname + '/sample')

		expect(loader.getNames()).toEqual(['foo', 'bar', 'baz'])
	})
})
