import { Terminal } from '../src'
import readline from 'readline'

describe('Terminal', () => {
	test('Can write to the cli', () => {
		const action = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)

		const t = new Terminal()

		t.write('foo')

		expect(action).toHaveBeenCalledWith('foo')
	})

	test('Can write to the error cli', () => {
		const action = jest.spyOn(process.stderr, 'write').mockImplementation(() => true)

		const t = new Terminal()

		t.writeError('foo')

		expect(action).toHaveBeenCalledWith('foo')
	})

	test('Can clear the console contents', () => {
		const action = jest.spyOn(console, 'clear')

		const t = new Terminal()

		t.clear()

		expect(action).toHaveBeenCalled()
	})

	test('Can clear a single line of contents', () => {
		const action = jest.spyOn(readline, 'clearLine')

		const t = new Terminal()

		t.clearLine()

		expect(action).toHaveBeenCalledWith(process.stdout, -1)
	})

	test('Can change the position of the cursor', () => {
		const action = jest.spyOn(readline, 'cursorTo')

		const t = new Terminal()

		t.cursorReset()

		expect(action).toHaveBeenCalledWith(process.stdout, 0)
	})

	test('Can exit the current program', () => {
		const action = jest.spyOn(process, 'exit').mockImplementation(() => {
			// tslint:disable-next-line:no-string-throw
			throw 'EXIT'
		})

		const t = new Terminal()

		expect(() => t.exit()).toThrow()
		expect(action).toHaveBeenCalled()
	})

	test('Can exit the current program with an exitcode', () => {
		const action = jest.spyOn(process, 'exit').mockImplementation(() => {
			// tslint:disable-next-line:no-string-throw
			throw 'EXIT'
		})

		const t = new Terminal()

		expect(() => t.exit(0)).toThrow()
		expect(action).toHaveBeenCalledWith(0)
	})

	test('Get the enviroment', () => {
		;(process.env as any).NODE_ENV = 'foobar'

		const t = new Terminal()

		expect(t.mode()).toBe('foobar')
	})

	test('Can promt the user', async () => {
		jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
		const action = jest.spyOn(readline, 'createInterface').mockImplementation(() => {
			return {
				close: () => null,
				question: (question: string, result: (answer: string) => void) => {
					result('y')
				},
			} as any
		})

		const t = new Terminal()

		expect(await t.question('Foo')).toBe('y')
		expect(action).toHaveBeenCalled()
	})

	test('Can promt the user hidden', async () => {
		jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
		const action = jest.spyOn(readline, 'createInterface').mockImplementation(() => {
			return {
				close: () => null,
				question: (question: string, result: (answer: string) => void) => {
					result('y')
				},
			} as any
		})

		const t = new Terminal()

		expect(await t.hiddenQuestion('Foo')).toBe('y')
		expect(action).toHaveBeenCalled()
	})

	test('Get the size of the cli', () => {
		;(process.stdout as any).columns = 123
		;(process.stdout as any).rows = 321

		const t = new Terminal()

		expect(t.width()).toBe(123)
		expect(t.height()).toBe(321)
	})
})
