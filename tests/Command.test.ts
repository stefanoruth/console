import { Signature, Argument, Input, CommandSignature, Option } from '../src/Input'
import { Application } from '../src/Application'
import { Output, Terminal } from '../src/Output'
import { ListCommand, InspireCommand, HelpCommand, Command } from '../src/Commands'
import { Mock } from 'ts-mockery'

class TestCommand extends Command {
	protected name = 'test'

	async handle() {
		//
	}
}

const baseOptions = {
	help: false,
	'no-interaction': false,
	quiet: false,
	verbose: false,
	version: false,
}

const runTestCommand = async (callback: (i: Input) => void, input: string[] = [], signature: CommandSignature = []) => {
	const a = new Application('TestApp')
	const s = new Signature(signature)
	const i = new Input(['test', ...input])
	const t = Mock.all<Terminal>()
	const o = new Output(t)

	const c = new class extends TestCommand {
		protected description = 'desc'
		protected help = 'help'
		protected signature = s

		async handle() {
			callback(this.input)
		}
	})()

	c.setApplication(a)

	return a.run(i, o, t)
}

describe('Command', () => {
	test('Public api', async () => {
		const a = new Application('foobar')
		const s = new Signature([new Argument('foo')])
		const i = new Input()
		const o = new Output(Mock.all<Terminal>())

		const c = new (class extends TestCommand {
			protected description = 'desc'
			protected help = 'help'
			protected signature = s
		})()

		expect(() => c.getApplication()).toThrow()
		expect(() => c.input).toThrow()
		expect(() => c.output).toThrow()

		c.setApplication(a)

		await c.execute(i, o)

		expect(c.getName()).toBe('test')
		expect(c.getHelp()).toBe('help')
		expect(c.getDescription()).toBe('desc')
		expect(c.getSignature()).toEqual(s)
		expect(c.getApplication()).toBe(a)
		expect(c.input).toBe(i)
		expect(c.output).toBe(o)
	})

	describe('Built in commands', () => {
		test('List Command', async () => {
			const c = new ListCommand()
			c.setApplication(new Application())
			const i = new Input()
			const o = new Output(Mock.all<Terminal>())

			expect(c.getName()).toBe('list')
			expect(c.getDescription()).toBeTruthy()

			await c.execute(i, o)
		})

		test('Inspire Command', async () => {
			const c = new InspireCommand()
			const fn = jest.fn()
			const i = new Input()
			const o = Mock.of<Output>({ success: fn })

			expect(c.getName()).toBe('inspire')
			expect(c.getDescription()).toBeTruthy()

			await c.execute(i, o)

			expect(fn.mock.calls[0].length).toBe(1)
		})

		describe('Help Command', () => {
			test('Simple use', async () => {
				const c = new HelpCommand()
				c.setApplication(new Application())

				const i = new Input(['help', 'list'])
				const o = new Output(Mock.all<Terminal>())

				expect(c.getName()).toBe('help')
				expect(c.getDescription()).toBeTruthy()
				// expect(() => c.execute(i, o)).not.toThrow()
			})

			test('With command', async () => {
				const c = new HelpCommand()
				const app = new Application()
				c.setApplication(app)

				const fooCommand = new (class extends Command {
					protected name = 'foo'

					async handle() {
						//
					}
				})()

				fooCommand.setApplication(app)

				c.setCommand(fooCommand)

				const i = new Input()
				const o = new Output(Mock.all<Terminal>())

				expect(c.getName()).toBe('help')
				expect(c.getDescription()).toBeTruthy()
				expect(() => c.execute(i, o)).not.toThrow()
			})
		})
	})

	test('Command inputs', async () => {
		await runTestCommand(
			i => {
				expect(i.getArguments()).toEqual({ foo: 'foobar' })
				expect(i.getOptions()).toEqual({})
			},
			['foobar'],
			[new Argument('foo')]
		)

		await runTestCommand(
			i => {
				expect(i.getArguments()).toEqual({ foo: 'foobar' })
				expect(i.getOptions()).toEqual({})
			},
			['foobar'],
			[new Argument('foo'), new Option('bar')]
		)

		await runTestCommand(
			i => {
				expect(i.getArguments()).toEqual({ foo: 'foobar' })
				expect(i.getOptions()).toEqual({ bar: 'har' })
				expect(i.getArgs()).toEqual({ foo: 'foobar', bar: 'har' })
			},
			['foobar', '-b', 'har'],
			[new Argument('foo'), new Option('bar')]
		)
	})
})
