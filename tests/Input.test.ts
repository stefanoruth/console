import { Input, Signature, Option, Argument, OptionMode } from '../src/Input'

const reset = [...process.argv]
let input: Input

function getInput(argv: string[], signature: Array<Argument | Option>) {
	const base = new Input(argv)
	base.bind(new Signature(signature))

	return base
}

function processReset() {
	process.argv = [...reset]
}

describe('Input', () => {
	beforeEach(() => {
		processReset()
	})

	test('Constructor', () => {
		process.argv = ['node', 'cli.js', 'foo']
		const inputRaw = new (class extends Input {
			getTokens = () => this.tokens
		})()
		expect(inputRaw.getTokens()).toEqual(['foo'])
	})

	test('ParseArguments', () => {
		input = new Input(['foo'])

		input.bind(new Signature([new Argument('name')]))
		expect(input.getArguments()).toEqual({ name: 'foo' })

		input.bind(new Signature([new Argument('name')]))
		expect(input.getArguments()).toEqual({ name: 'foo' })
	})

	test('ParseOptions', () => {
		input = getInput(['--foo'], [new Option('foo')])
		expect(input.getOptions()).toEqual({ foo: true })

		input = getInput(['--foo=bar'], [new Option('foo', 'f', 'required')])
		expect(input.getOptions()).toEqual({ foo: 'bar' })
	})
})
