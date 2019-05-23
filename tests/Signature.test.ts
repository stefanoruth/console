import { Signature, Option, Argument, ArgumentMode } from '../src/Input'

let signature: Signature
let foo: Argument | Option
let bar: Argument | Option
let foo1: Argument | Option
let foo2: Argument | Option
let multi: Argument | Option

function initializeArguments() {
	foo = new Argument('foo')
	bar = new Argument('bar')
	foo1 = new Argument('foo')
	foo2 = new Argument('foo2', ArgumentMode.required)
}

function initializeOptions() {
	foo = new Option('foo', 'f')
	bar = new Option('bar', 'b')
	foo1 = new Option('fooBis', 'f')
	foo2 = new Option('foo', 'p')
	multi = new Option('multi', 'm|mm|mmm')
}

describe('Signature', () => {
	test('ConstructorArguments', () => {
		initializeArguments()

		signature = new Signature()
		expect(signature.getArguments()).toEqual([])

		signature = new Signature([foo, bar])
		expect(signature.getArguments()).toEqual([foo, bar])
	})

	test('ConstructorOptions', () => {
		initializeOptions()

		signature = new Signature()
		expect(signature.getOptions()).toEqual([])

		signature = new Signature([foo, bar])
		expect(signature.getOptions()).toEqual([foo, bar])
	})

	test('GetShortSynopsis', () => {
		signature = new Signature([new Option('foo'), new Option('bar'), new Argument('cat')])
		expect(signature.getSynopsis(true)).toBe('[options] [--] [<cat>]')
	})
})
