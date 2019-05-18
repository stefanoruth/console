import { Input, Signature, Option, Argument } from '../src/Input'

const reset = [...process.argv]

function processReset() {
	process.argv = [...reset]
}

describe('Input', () => {
	beforeEach(() => {
		processReset()
	})

	test('Constructor', () => {
		// process.argv = ['node', 'cli.js', 'foo']
		// const input = new (class extends Input {
		// 	getTokens = () => this.tokens
		// })()
		// expect(input.getTokens()).toEqual(['foo'])
	})

	test('ParseArguments', () => {
		// const input = new Input(['cli.js', 'foo'])
		// input.bind(new Signature([new Argument('name')]))
		// expect(input.getArguments()).toBe({ name: 'foo' })
		// input.bind(new Signature([new Argument('name')]))
		// expect(input.getArguments()).toBe({ name: 'foo' })
	})
})
