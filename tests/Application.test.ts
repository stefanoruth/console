import { Application, Command, Output, Input } from '../src/index'
import { ListCommand } from '../src/Commands'
import { Mock } from 'ts-mockery'
import { Verbosity } from '../src/Output/Verbosity'

class TestCommand extends Command {
	protected name = ''

	constructor(name: string) {
		super()
		this.name = name
	}

	async handle() {
		//
	}
}

const i = new Input()
const o = new Output()
o.setVerbosity(Verbosity.quiet)

describe('Application', () => {
	test('Bootstrapping', () => {
		let app: Application | undefined

		const appFn = jest.fn(original => {
			app = original
		})

		Application.starting(appFn)

		const application = new Application()

		expect(appFn).toBeCalled()
		expect(application).toBe(app)
	})

	test('Listen for events', () => {
		const fn = jest.fn()

		Application.starting(a => {
			a.listen('*', fn)
		})

		const app = new Application()

		expect(fn.mock.calls[0].length).toBe(1)
	})

	test('Able to register new commands', () => {
		const app = new Application()

		app.register([new TestCommand('a'), new TestCommand('b')])

		expect(app.getCommands().length).toBe(2)
	})

	test('Find a command', () => {
		expect(new Application().find('list')).toBeInstanceOf(ListCommand)
	})

	test('Shows basic information about the App', () => {
		expect(new Application().getHelp()).toBe('Console Tool')
		expect(new Application('foo').getHelp()).toBe('foo')
		expect(new Application('foo', 'bar').getHelp()).toBe('foo bar')
	})

	// test('Application can start', async () => {
	// 	const app = new Application()
	// 	app.setAutoExit(false)

	// 	const code = await app.run(i, o)

	// 	expect(code).toBe(0)
	// })

	// test('It can exit process automaticly', async () => {
	// 	const exit = jest.spyOn(process, 'exit')
	// 	const app = Mock.of<Application>({ terminal: 'a' })

	// 	await new Application().run(i, o)

	// 	expect(exit).toHaveBeenCalledWith(0)
	// })
})
