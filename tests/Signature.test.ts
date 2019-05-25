import { Signature, Option, Argument, ArgumentMode, OptionMode } from '../src/Input'

let signature: Signature
const a: { [k: string]: Argument } = {}
const o: { [k: string]: Option } = {}

function initializeArguments() {
	a.foo = new Argument('foo')
	a.bar = new Argument('bar')
	a.foo1 = new Argument('foo')
	a.foo2 = new Argument('foo2', ArgumentMode.required)
}

function initializeOptions() {
	o.foo = new Option('foo', 'f')
	o.bar = new Option('bar', 'b')
	o.foo1 = new Option('fooBis', 'f')
	o.foo2 = new Option('foo', 'p')
	o.multi = new Option('multi', 'm|mm|mmm')
}

describe('Signature', () => {
	test('ConstructorArguments', () => {
		initializeArguments()

		signature = new Signature()
		expect(signature.getArguments()).toEqual([])

		signature = new Signature([a.foo, a.bar])
		expect(signature.getArguments()).toEqual([a.foo, a.bar])
	})

	test('ConstructorOptions', () => {
		initializeOptions()

		signature = new Signature()
		expect(signature.getOptions()).toEqual([])

		signature = new Signature([o.foo, o.bar])
		expect(signature.getOptions()).toEqual([o.foo, o.bar])
	})

	test('SetArguments', () => {
		initializeArguments()
		signature = new Signature()

		signature.setArguments([a.foo])
		expect(signature.getArguments()).toEqual([a.foo])

		signature.setArguments([a.bar])
		expect(signature.getArguments()).toEqual([a.bar])
	})

	test('AddArguments', () => {
		initializeArguments()
		signature = new Signature()

		signature.addArguments([a.foo])
		expect(signature.getArguments()).toEqual([a.foo])

		signature.addArguments([a.bar])
		expect(signature.getArguments()).toEqual([a.foo, a.bar])
	})

	test('AddArgument', () => {
		initializeArguments()
		signature = new Signature()

		signature.addArgument(a.foo)
		expect(signature.getArguments()).toEqual([a.foo])

		signature.addArgument(a.bar)
		expect(signature.getArguments()).toEqual([a.foo, a.bar])
	})

	test('ArgumentsMustHaveDifferentNames', () => {
		initializeArguments()
		signature = new Signature()

		expect(() => {
			signature.addArgument(a.foo)
			signature.addArgument(a.foo1)
		}).toThrow('An argument with name "foo" already exists.')
	})

	test('ArrayArgumentHasToBeLast', () => {
		initializeArguments()
		signature = new Signature()

		expect(() => {
			signature.addArgument(new Argument('fooarray', 'isArray'))
			signature.addArgument(new Argument('anotherbar'))
		}).toThrow('Cannot add an argument after an array argument.')
	})

	test('RequiredArgumentCannotFollowAnOptionalOne', () => {
		initializeArguments()
		signature = new Signature()

		expect(() => {
			signature.addArgument(a.foo)
			signature.addArgument(a.foo2)
		}).toThrow('Cannot add a required argument after an optional one.')
	})

	test('GetArgument', () => {
		initializeArguments()
		signature = new Signature()
		signature.addArguments([a.foo])

		expect(signature.getArgument('foo')).toEqual(a.foo)
	})

	test('GetInvalidArgument', () => {
		initializeArguments()
		signature = new Signature()

		expect(() => {
			signature.addArguments([a.foo])
			signature.getArgument('bar')
		}).toThrow('The "bar" argument does not exist.')
	})

	test('HasArgument', () => {
		initializeArguments()
		signature = new Signature()

		signature.addArguments([a.foo])
		expect(signature.hasArgument('foo')).toBeTruthy()
		expect(signature.hasArgument('has')).toBeFalsy()
	})

	test('GetArgumentRequiredCount', () => {
		initializeArguments()
		signature = new Signature()

		signature.addArgument(a.foo2)
		expect(signature.getArgumentRequiredCount()).toBe(1)
		signature.addArgument(a.foo)
		expect(signature.getArgumentRequiredCount()).toBe(1)
	})

	test('GetArgumentCount', () => {
		initializeArguments()
		signature = new Signature()

		signature.addArgument(a.foo2)
		expect(signature.getArgumentCount()).toBe(1)
		signature.addArgument(a.foo)
		expect(signature.getArgumentCount()).toBe(2)
	})

	test('GetArgumentDefaults', () => {
		signature = new Signature([
			new Argument('foo1', 'optional'),
			new Argument('foo2', 'optional', undefined, 'default'),
			new Argument('foo3', ArgumentMode.optional | ArgumentMode.isArray),
		])

		expect(signature.getArgumentDefaults()).toEqual({ foo1: undefined, foo2: 'default', foo3: [] })

		signature = new Signature([new Argument('foo4', ArgumentMode.optional | ArgumentMode.isArray, '', [1, 2])])
		expect(signature.getArgumentDefaults()).toEqual({ foo4: [1, 2] })
	})

	test('SetOptions', () => {
		initializeOptions()

		signature = new Signature([o.foo])
		expect(signature.getOptions()).toEqual([o.foo])
		signature.setOptions([o.bar])
		expect(signature.getOptions()).toEqual([o.bar])
	})

	test('SetOptionsClearsOptions', () => {
		initializeOptions()

		signature = new Signature([o.foo])
		signature.setOptions([o.bar])

		expect(() => {
			signature.getOptionForShortcut('f')
		}).toThrow('The "-f" option does not exist.')
	})

	test('AddOptions', () => {
		initializeOptions()

		signature = new Signature([o.foo])
		expect(signature.getOptions()).toEqual([o.foo])
		signature.addOptions([o.bar])
		expect(signature.getOptions()).toEqual([o.foo, o.bar])
	})

	test('AddOption', () => {
		initializeOptions()

		signature = new Signature()
		signature.addOption(o.foo)
		expect(signature.getOptions()).toEqual([o.foo])
		signature.addOption(o.bar)
		expect(signature.getOptions()).toEqual([o.foo, o.bar])
	})

	test('AddDuplicateOption', () => {
		initializeOptions()
		signature = new Signature()

		expect(() => {
			signature.addOption(o.foo)
			signature.addOption(o.foo2)
		}).toThrow('An option named "foo" already exists.')
	})

	test('AddDuplicateShortcutOption', () => {
		initializeOptions()
		signature = new Signature()

		expect(() => {
			signature.addOption(o.foo)
			signature.addOption(o.foo1)
		}).toThrow('An option with shortcut "f" already exists.')
	})

	test('GetOption', () => {
		initializeOptions()
		signature = new Signature([o.foo])

		expect(signature.getOption('foo')).toBe(o.foo)
	})

	test('GetInvalidOption', () => {
		initializeOptions()
		signature = new Signature([o.foo])

		expect(() => signature.getOption('bar')).toThrow('The "--bar" option does not exist.')
	})

	test('HasOption', () => {
		initializeOptions()
		signature = new Signature([o.foo])

		expect(signature.hasOption('foo')).toBeTruthy()
		expect(signature.hasOption('bar')).toBeFalsy()
	})

	test('HasShortcut', () => {
		initializeOptions()
		signature = new Signature([o.foo])

		expect(signature.hasShortcut('f')).toBeTruthy()
		expect(signature.hasShortcut('b')).toBeFalsy()
	})

	test('GetOptionForShortcut', () => {
		initializeOptions()
		signature = new Signature([o.foo])

		expect(signature.getOptionForShortcut('f')).toEqual(o.foo)
	})

	test('GetOptionForMultiShortcut', () => {
		initializeOptions()
		signature = new Signature([o.multi])

		expect(signature.getOptionForShortcut('m')).toEqual(o.multi)
		expect(signature.getOptionForShortcut('mmm')).toEqual(o.multi)
	})

	test('GetOptionForInvalidShortcut', () => {
		initializeOptions()
		signature = new Signature([o.foo])

		expect(() => signature.getOptionForShortcut('l')).toThrow('The "-l" option does not exist.')
	})

	test('GetOptionDefaults', () => {
		signature = new Signature([
			new Option('foo1', undefined, 'none'),
			new Option('foo2', undefined, 'required'),
			new Option('foo3', undefined, 'required', undefined, 'default'),
			new Option('foo4', undefined, 'optional'),
			new Option('foo5', undefined, 'optional', undefined, 'default'),
			new Option('foo6', undefined, OptionMode.optional | OptionMode.isArray),
			new Option('foo7', undefined, OptionMode.optional | OptionMode.isArray, undefined, [1, 2]),
		])

		expect(signature.getOptionDefaults()).toEqual({
			foo1: false,
			foo2: undefined,
			foo3: 'default',
			foo4: undefined,
			foo5: 'default',
			foo6: [],
			foo7: [1, 2],
		})
	})

	test('GetSynopsis', () => {
		const tests = [
			{
				signature: [new Option('foo')],
				synopsis: '[--foo]',
			},
			{
				signature: [new Option('foo', 'f')],
				synopsis: '[-f|--foo]',
			},
			{
				signature: [new Option('foo', 'f', 'required')],
				synopsis: '[-f|--foo FOO]',
			},
			{
				signature: [new Option('foo', 'f', 'optional')],
				synopsis: '[-f|--foo [FOO]]',
			},
			{
				signature: [new Argument('foo', 'required')],
				synopsis: '<foo>',
			},
			{
				signature: [new Argument('foo')],
				synopsis: '[<foo>]',
			},
			{
				signature: [new Argument('foo'), new Argument('bar')],
				synopsis: '[<foo> [<bar>]]',
			},
			{
				signature: [new Argument('foo', 'isArray')],
				synopsis: '[<foo>...]',
			},
			{
				signature: [new Argument('foo', ArgumentMode.required | ArgumentMode.isArray)],
				synopsis: '<foo>...',
			},
			{
				signature: [new Option('foo'), new Argument('foo', 'required')],
				synopsis: '[--foo] [--] <foo>',
			},
		]

		tests.forEach(test => {
			expect(new Signature(test.signature).getSynopsis()).toBe(test.synopsis)
		})
	})

	test('GetShortSynopsis', () => {
		signature = new Signature([new Option('foo'), new Option('bar'), new Argument('cat')])
		expect(signature.getSynopsis(true)).toBe('[options] [--] [<cat>]')
	})
})
