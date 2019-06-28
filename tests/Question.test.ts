import { Output, Terminal } from '../src'
import { Mock } from 'ts-mockery'

describe('Question', () => {
	test('Simple question', async () => {
		const action = jest.fn().mockImplementation(async (q: string) => {
			return 'bar'
		})
		const t = Mock.of<Terminal>({ question: action })
		const o = new Output(t)

		expect(await o.ask('Foo')).toBe('bar')
	})

	test('Hidden question', async () => {
		const action = jest.fn().mockImplementation(async (q: string) => {
			return 'bar'
		})
		const t = Mock.of<Terminal>({ hiddenQuestion: action })
		const o = new Output(t)

		expect(await o.askHidden('Foo')).toBe('bar')
	})

	test('Confirmation', async () => {
		const action = jest.fn().mockImplementation(async (q: string) => {
			return 'y'
		})
		const t = Mock.of<Terminal>({ question: action })
		const o = new Output(t)

		expect(await o.confirm('Foo')).toBe(true)
	})

	test('ConfirmToProceed ', async () => {
		const run = (answer: string, mode?: string) => {
			const action = jest.fn().mockImplementation(async (q: string) => {
				return answer
			})
			const t = Mock.of<Terminal>({ question: action, write: jest.fn(), mode: () => mode })
			const o = new Output(t)

			return o.confirmToProceed('Foo')
		}

		expect(await run('y', 'development')).toBe(true)
		expect(await run('y', 'production')).toBe(true)
		expect(await run('n', 'development')).toBe(true)
		expect(await run('n', 'production')).toBe(false)
		expect(await run('', 'development')).toBe(true)
		expect(await run('', 'production')).toBe(false)
		expect(await run('')).toBe(true)
	})
})
