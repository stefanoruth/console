import { Input, Signature, Option, Argument, OptionMode } from '../src/Input'

const reset = [...process.argv]
let input: Input

function getInput(argv: string[], signature?: Array<Argument | Option>) {
	const base = new Input(argv)

	if (signature) {
		base.bind(new Signature(signature))
	}

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

	describe('ParseOptions', () => {
		test('Long', () => {
			input = getInput(['--foo'], [new Option('foo')])
			expect(input.getOptions()).toEqual({ foo: true })

			input = getInput(['--foo=bar'], [new Option('foo', 'f', 'required')])
			expect(input.getOptions()).toEqual({ foo: 'bar' })

			input = getInput(['--foo='], [new Option('foo', 'f', 'required')])
			expect(input.getOptions()).toEqual({ foo: '' })

			input = getInput(['--foo='], [new Option('foo', 'f', 'optional')])
			expect(input.getOptions()).toEqual({ foo: '' })

			input = getInput(['--foo=', 'bar'], [new Option('foo', 'f', 'optional'), new Argument('name', 'required')])
			expect(input.getOptions()).toEqual({ foo: '' })

			input = getInput(['bar', '--foo'], [new Option('foo', 'f', 'optional'), new Argument('name', 'required')])
			expect(input.getOptions()).toEqual({ foo: null })

			input = getInput(['--foo', '', 'bar'], [new Option('foo', 'f', 'optional'), new Argument('name', 'required')])
			expect(input.getOptions()).toEqual({ foo: '' })

			input = getInput(['--foo'], [new Option('foo', 'f', 'optional')])
			expect(input.getOptions()).toEqual({ foo: null })
		})

		test('Short', () => {
			input = getInput(['-f'], [new Option('foo', 'f')])
			expect(input.getOptions()).toEqual({ foo: true })

			input = getInput(['-fbar'], [new Option('foo', 'f', 'required')])
			expect(input.getOptions()).toEqual({ foo: 'bar' })

			input = getInput(['-f', 'bar'], [new Option('foo', 'f', 'required')])
			expect(input.getOptions()).toEqual({ foo: 'bar' })

			input = getInput(['-f', ''], [new Option('foo', 'f', 'required')])
			expect(input.getOptions()).toEqual({ foo: '' })

			input = getInput(['-f', '', 'foo'], [new Argument('name'), new Option('foo', 'f', 'required')])
			expect(input.getOptions()).toEqual({ foo: '' })

			input = getInput(['-f', '', '-b'], [new Option('foo', 'f', 'optional'), new Option('bar', 'b')])
			expect(input.getOptions()).toEqual({ foo: '', bar: true })

			input = getInput(
				['-f', '-b', 'foo'],
				[new Argument('name'), new Option('foo', 'f', 'optional'), new Option('bar', 'b')]
			)
			expect(input.getOptions()).toEqual({ foo: null, bar: true })

			input = getInput(['-fb'], [new Option('foo', 'f'), new Option('bar', 'b')])
			expect(input.getOptions()).toEqual({ foo: true, bar: true })

			input = getInput(['-fb', 'bar'], [new Option('foo', 'f'), new Option('bar', 'b', 'required')])
			expect(input.getOptions()).toEqual({ foo: true, bar: 'bar' })

			input = getInput(['-fb', 'bar'], [new Option('foo', 'f'), new Option('bar', 'b', 'optional')])
			expect(input.getOptions()).toEqual({ foo: true, bar: 'bar' })

			input = getInput(['-fbbar'], [new Option('foo', 'f'), new Option('bar', 'b', 'optional')])
			expect(input.getOptions()).toEqual({ foo: true, bar: 'bar' })

			input = getInput(['-fbbar'], [new Option('foo', 'f', 'optional'), new Option('bar', 'b', 'optional')])
			expect(input.getOptions()).toEqual({ foo: 'bbar', bar: undefined })
		})
	})

	test('InvalidInput', () => {
		expect(() => getInput(['--foo'], [new Option('foo', 'f', 'required')])).toThrow(
			'The "--foo" option requires a value.'
		)

		expect(() => getInput(['-f'], [new Option('foo', 'f', 'required')])).toThrow('The "--foo" option requires a value.')

		expect(() => getInput(['-ffoo'], [new Option('foo', 'f', 'none')])).toThrow('The "-o" option does not exist.')

		expect(() => getInput(['--foo=bar'], [new Option('foo', 'f', 'none')])).toThrow(
			'The "--foo" option does not accept a value.'
		)

		expect(() => getInput(['foo', 'bar'], [])).toThrow('No arguments expected, got "foo".')

		expect(() => getInput(['foo', 'bar'], [new Argument('number')])).toThrow(
			'Too many arguments, expected arguments "number".'
		)

		expect(() => getInput(['foo', 'bar', 'zzz'], [new Argument('number'), new Argument('county')])).toThrow(
			'Too many arguments, expected arguments "number" "county".'
		)

		expect(() => getInput(['--foo'], [])).toThrow('The "--foo" option does not exist.')

		expect(() => getInput(['-f'], [])).toThrow('The "-f" option does not exist.')

		expect(() => getInput(['-1'], [new Argument('number')])).toThrow('The "-1" option does not exist.')

		expect(() => getInput(['-fЩ'], [new Option('foo', 'f', 'none')])).toThrow('The "-Щ" option does not exist.')
	})

	test('ParseArrayArgument', () => {
		input = getInput(['foo', 'bar', 'baz', 'bat'], [new Argument('name', 'isArray')])

		expect(input.getArguments()).toEqual({ name: ['foo', 'bar', 'baz', 'bat'] })
	})

	test('ParseArrayOption', () => {
		input = getInput(
			['--name=foo', '--name=bar', '--name=baz'],
			[new Option('name', undefined, OptionMode.optional | OptionMode.isArray)]
		)
		expect(input.getOptions()).toEqual({ name: ['foo', 'bar', 'baz'] })

		input = getInput(
			['--name', 'foo', '--name', 'bar', '--name', 'baz'],
			[new Option('name', undefined, OptionMode.optional | OptionMode.isArray)]
		)
		expect(input.getOptions()).toEqual({ name: ['foo', 'bar', 'baz'] })

		input = getInput(
			['--name=foo', '--name=bar', '--name='],
			[new Option('name', undefined, OptionMode.optional | OptionMode.isArray)]
		)
		expect(input.getOptions()).toEqual({ name: ['foo', 'bar', ''] })

		input = getInput(
			['--name', 'foo', '--name', 'bar', '--name', '--anotherOption'],
			[
				new Option('name', undefined, OptionMode.optional | OptionMode.isArray),
				new Option('anotherOption', undefined, 'none'),
			]
		)
		expect(input.getOptions()).toEqual({ name: ['foo', 'bar', null], anotherOption: true })
	})

	test('ParseNegativeNumberAfterDoubleDash', () => {
		input = getInput(['--', '-1'], [new Argument('number')])
		expect(input.getArguments()).toEqual({ number: '-1' })

		input = getInput(['-f', 'bar', '--', '-1'], [new Argument('number'), new Option('foo', 'f', 'optional')])
		expect(input.getOptions()).toEqual({ foo: 'bar' })
		expect(input.getArguments()).toEqual({ number: '-1' })
	})

	test('ParseEmptyStringArgument', () => {
		input = getInput(['-f', 'bar', ''], [new Argument('empty'), new Option('foo', 'f', 'optional')])
		expect(input.getArguments()).toEqual({ empty: '' })
	})

	test('GetFirstArgument', () => {
		input = getInput(['-fbbar'])
		expect(input.getFirstArgument()).toBeUndefined()

		input = getInput(['-fbbar', 'foo'])
		expect(input.getFirstArgument()).toBe('foo')

		input = getInput(['--foo', 'fooval', 'bar'], [new Option('foo', 'f', 'optional'), new Argument('arg')])
		expect(input.getFirstArgument()).toBe('bar')

		// input = getInput(
		// 	['-bf', 'fooval', 'argval'],
		// 	[new Option('bar', 'b', 'none'), new Option('foo', 'f', 'optional'), new Argument('arg')]
		// )
		// expect(input.getFirstArgument()).toBe('argval')
	})

	test('HasParameterOption', () => {
		input = getInput(['-f', 'foo'])
		expect(input.hasParameterOption('-f')).toBeTruthy()

		input = getInput(['-etest'])
		expect(input.hasParameterOption('-e')).toBeTruthy()
		expect(input.hasParameterOption('-s')).toBeFalsy()

		input = getInput(['--foo', 'foo'])
		expect(input.hasParameterOption('--foo')).toBeTruthy()

		input = getInput(['foo'])
		expect(input.hasParameterOption('--foo')).toBeFalsy()

		input = getInput(['--foo=bar'])
		expect(input.hasParameterOption('--foo')).toBeTruthy()
	})

	test('HasParameterOptionOnlyOptions', () => {
		input = getInput(['-f', 'foo'])
		expect(input.hasParameterOption('-f', true)).toBeTruthy()

		input = getInput(['--foo', '--', 'foo'])
		expect(input.hasParameterOption('--foo', true)).toBeTruthy()

		input = getInput(['--foo=bar', 'foo'])
		expect(input.hasParameterOption('--foo', true)).toBeTruthy()

		input = getInput(['--', '--foo'])
		expect(input.hasParameterOption('--foo', true)).toBeFalsy()
	})

	test('HasParameterOptionEdgeCasesAndLimitations', () => {
		input = getInput(['-fh'])
		expect(input.hasParameterOption('-h')).toBeFalsy()
		expect(input.hasParameterOption('-f')).toBeTruthy()
		expect(input.hasParameterOption('-fh')).toBeTruthy()
		expect(input.hasParameterOption('-hf')).toBeFalsy()

		input = getInput(['-f', '-h'])
		expect(input.hasParameterOption('-fh')).toBeFalsy()
	})

	test('NoWarningOnInvalidParameterOption', () => {
		input = getInput(['-edev'])
		expect(input.hasParameterOption(['-e', ''])).toBeTruthy()
		expect(input.hasParameterOption(['-m', ''])).toBeFalsy()
		// expect(input.getParameterOption(['-e', ''])).toEqual('dev')
		expect(input.getParameterOption(['-m', ''])).toBeFalsy()
	})

	test('ToString', () => {
		input = getInput(['-f', 'foo'], [new Argument('file')])
		expect(input.toString()).toEqual({ file: '-' })

		input = getInput(['-'], [new Argument('file')])
		expect(input.getArguments()).toEqual({ file: '-' })
	})

	test.only('GetParameterOptionEqualSign', () => {
		const tests = [
			{
				args: ['foo:bar'],
				key: '-e',
				only: false,
				expect: 'default',
			},
			{
				args: ['foo:bar', '-e', 'dev'],
				key: '-e',
				only: false,
				expect: 'dev',
			},
			{
				args: ['foo:bar', '--env=dev'],
				key: '--env',
				only: false,
				expect: 'dev',
			},
			{
				args: ['foo:bar', '-e', 'dev'],
				key: ['-e', '--env'],
				only: false,
				expect: 'dev',
			},
			{
				args: ['foo:bar', '--env=dev'],
				key: ['-e', '--env'],
				only: false,
				expect: 'dev',
			},
			{
				args: ['foo:bar', '--env=dev', '--en=1'],
				key: ['--en'],
				only: false,
				expect: '1',
			},
			{
				args: ['foo:bar', '--env=dev', '', '--en=1'],
				key: ['--en'],
				only: false,
				expect: '1',
			},
			{
				args: ['foo:bar', '--env', 'val'],
				key: '--env',
				only: false,
				expect: 'val',
			},
			{
				args: ['--env', 'val', '--dummy'],
				key: '--env',
				only: false,
				expect: 'val',
			},
			{
				args: ['--', '--env=dev'],
				key: '--env',
				only: false,
				expect: 'dev',
			},
			{
				args: ['--', '--env=dev'],
				key: '--env',
				only: true,
				expect: 'default',
			},
		]

		tests.forEach(test => {
			expect(getInput(test.args).getParameterOption(test.key, 'default', test.only)).toEqual(test.expect)
		})
	})

	test('ParseSingleDashAsArgument', () => {
		input = getInput(['-'], [new Argument('file')])
		expect(input.getArguments()).toEqual({ file: '-' })
	})

	test('ParseOptionWithValueOptionalGivenEmptyAndRequiredArgument', () => {
		// input = getInput(['--foo=', 'bar'], [new Option('foo', 'f', 'optional'), new Argument('name', 'required')])
		// expect(input.getOptions()).toEqual({ foo: null })
		// expect(input.getArguments()).toEqual({ name: 'bar' })

		input = getInput(['--foo=0', 'bar'], [new Option('foo', 'f', 'optional'), new Argument('name', 'required')])
		expect(input.getOptions()).toEqual({ foo: '0' })
		expect(input.getArguments()).toEqual({ name: 'bar' })
	})

	test('ParseOptionWithValueOptionalGivenEmptyAndOptionalArgument', () => {
		// input = getInput(['--foo=', 'bar'], [new Option('foo', 'f', 'optional'), new Argument('name', 'optional')])
		// expect(input.getOptions()).toEqual({ foo: null })
		// expect(input.getArguments()).toEqual({ name: 'bar' })

		input = getInput(['--foo=0', 'bar'], [new Option('foo', 'f', 'optional'), new Argument('name', 'optional')])
		expect(input.getOptions()).toEqual({ foo: '0' })
		expect(input.getArguments()).toEqual({ name: 'bar' })
	})
})
