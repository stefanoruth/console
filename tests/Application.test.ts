import { Application, Command, Output, Input, Terminal } from '../src/index'
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

		expect(app.getCommands().length).toBe(3 + 2)
	})

	test('Find a command', () => {
		expect(new Application().find('list')).toBeInstanceOf(ListCommand)
	})

	test('Shows basic information about the App', () => {
		expect(new Application().getHelp()).toBeDefined()
		expect(new Application({ name: 'foo', version: '1' }).getHelp()).toBe('foo 1')
		expect(new Application({ name: 'foo', version: '1' }).getName()).toBe('foo')
		expect(new Application({ name: 'foo', version: '1' }).getVersion()).toBe('1')

		expect(new Application().run(new Input(['--version']), new Output(Mock.all<Terminal>())))
	})

	test('Application can autoexit', async () => {
		const app = new Application()
		const t = Mock.all<Terminal>()

		const code = await app.run(new Input([]), new Output(t))

		expect(code).toBe(0)
		expect(t.exit).toBeCalled()
	})

	test('Application can keep runing without exiting the process', async () => {
		const app = new Application()
		const t = Mock.all<Terminal>()

		app.setAutoExit(false)

		const code = await app.run(new Input([]), new Output(t))

		expect(code).toBe(0)
		expect(t.exit).not.toBeCalled()
	})

	test('Change verbosity', () => {
		const run = (args: string) => {
			const t = Mock.all<Terminal>()
			const o = new Output(t)

			const app = new Application()

			app.register([new TestCommand('foo')])

			app.run(new Input(['foo', args]), o)

			return o
		}

		expect(run('').getVerbosity()).toBe(Verbosity.normal)
		expect(run('-v').getVerbosity()).toBe(Verbosity.verbose)
		expect(run('-vv').getVerbosity()).toBe(Verbosity.veryVerbose)
		expect(run('-vvv').getVerbosity()).toBe(Verbosity.debug)
		expect(run('-q').getVerbosity()).toBe(Verbosity.quiet)
	})

	test('Change interactivity', () => {
		const run = (args: string) => {
			const t = Mock.all<Terminal>()
			const o = new Output(t)
			const i = new Input(['foo', args])
			const app = new Application()

			app.register([new TestCommand('foo')])

			app.run(i, o)

			return i
		}

		expect(run('-n').isInteractive()).toBeFalsy()
		expect(run('').isInteractive()).toBeTruthy()
	})
})
