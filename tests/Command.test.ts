import { Command } from '../src/Commands/Command'
import { Signature, Argument, Input } from '../src/Input'
import { Application } from '../src/Application'
import { Output } from '../src/Output'
import { ListCommand, InspireCommand, HelpCommand } from '../src/Commands'
import { Mock } from 'ts-mockery'

class TestCommand extends Command {
	protected name = 'test'

	async handle() {
		//
	}
}

process.on('unhandledRejection', err => {
	console.log(err)
})

describe('Command', () => {
	test('Public api', async () => {
		const a = new Application('foobar')
		const s = new Signature([new Argument('foo')])
		const i: Input = {} as any
		const o: Output = {} as any

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
			const i = Mock.of<Input>()
			const o = Mock.of<Output>({ line: jest.fn() })

			expect(c.getName()).toBe('list')
			expect(c.getDescription()).toBeTruthy()

			await c.execute(i, o)
		})

		test('Inspire Command', async () => {
			const c = new InspireCommand()
			const fn = jest.fn()
			const i = Mock.of<Input>()
			const o = Mock.of<Output>({ success: fn })

			expect(c.getName()).toBe('inspire')
			expect(c.getDescription()).toBeTruthy()

			await c.execute(i, o)

			expect(fn.mock.calls[0].length).toBe(1)
		})

		describe('Help Command', () => {
			test('Simple use', async () => {
				const c = new HelpCommand()

				expect(c.getName()).toBe('help')
				expect(c.getDescription()).toBeTruthy()
				// expect(() => c.handle()).not.toThrow()
			})

			test('With command', async () => {
				const c = new HelpCommand()
				c.setCommand(
					new (class extends Command {
						protected name = 'foo'

						async handle() {
							//
						}
					})()
				)

				expect(c.getName()).toBe('help')
				expect(c.getDescription()).toBeTruthy()
				// expect(() => c.handle()).not.toThrow()
			})
		})
	})
})
