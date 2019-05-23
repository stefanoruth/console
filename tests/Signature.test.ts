import { Signature, Option, Argument, ArgumentMode } from '../src/Input'

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
		// expect(signature.getArgumentRequiredCount()).toBe(1)
		signature.addArgument(a.foo)
		// expect(signature.getArgumentRequiredCount()).toBe(1)
	})

	test('GetArgumentCount', () => {
		//
	})

	test('GetArgumentDefaults', () => {
		signature = new Signature([
			new Argument('foo1', 'optional'),
			new Argument('foo2', 'optional', undefined, 'default'),
			new Argument('foo3', ArgumentMode.optional | ArgumentMode.isArray),
		])

		// expect(signature.getArgumentDefaults()).toEqual({ foo1: null, foo2: 'default', foo3: [] })

		signature = new Signature([new Argument('foo4', ArgumentMode.optional | ArgumentMode.isArray, '', [1, 2])])
		expect(signature.getArgumentDefaults()).toEqual({ foo4: [1, 2] })
	})

	test('GetShortSynopsis', () => {
		signature = new Signature([new Option('foo'), new Option('bar'), new Argument('cat')])
		expect(signature.getSynopsis(true)).toBe('[options] [--] [<cat>]')
	})
})
