import { CommandLoader } from '../src/Commands'
import { FooCommand } from './sample/FooCommand'

describe('CommandLoader', () => {
	//
	test('It can load commands dynamicly from a folder', async () => {
		const loader = new CommandLoader()

		expect(await loader.load(__dirname + '/sample')).toEqual({
			foo: new FooCommand(),
		})
	})
})
