import { Argument, ArgumentMode } from '../src/Input'

let arg: Argument

describe('Argument', () => {
	test('Constructor', () => {
		arg = new Argument('foo')

		expect(arg.getName()).toBe('foo')
	})

	test('Modes', () => {
		arg = new Argument('foo')
		expect(arg.isRequired()).toBeFalsy()

		arg = new Argument('foo', undefined, undefined, ArgumentMode.optional)
		expect(arg.isRequired()).toBeFalsy()

		arg = new Argument('foo', undefined, undefined, ArgumentMode.required)
		expect(arg.isRequired()).toBeTruthy()
	})

	test('InvalidModes', () => {
		expect(() => new Argument('foo', undefined, undefined, -1)).toThrow()
	})

	test('IsArray', () => {
		arg = new Argument('foo', undefined, undefined, ArgumentMode.isArray)
		expect(arg.isArray()).toBeTruthy()

		arg = new Argument('foo', undefined, undefined, ArgumentMode.optional | ArgumentMode.isArray)
		expect(arg.isArray()).toBeTruthy()

		arg = new Argument('foo', undefined, undefined, ArgumentMode.optional)
		expect(arg.isArray()).toBeFalsy()
	})

	test('GetDescription', () => {
		arg = new Argument('foo', 'Some description')
		expect(arg.getDescription()).toBe('Some description')
	})

	test('GetDefault', () => {
		arg = new Argument('foo', undefined, 'default')
		expect(arg.getDefault()).toBe('default')
	})

	test('SetDefault', () => {
		arg = new Argument('foo', undefined, undefined, ArgumentMode.optional)
		arg.setDefault(null)
		expect(arg.getDefault()).toBe(null)
		arg.setDefault('another')
		expect(arg.getDefault()).toBe('another')

		arg = new Argument('foo', undefined, undefined, ArgumentMode.optional | ArgumentMode.isArray)
		arg.setDefault([1, 2])
		expect(arg.getDefault()).toEqual([1, 2])
	})

	test('SetDefaultWithRequiredArgument', () => {
		arg = new Argument('foo', undefined, undefined, ArgumentMode.required)
		expect(() => arg.setDefault('default')).toThrow()
	})

	test('SetDefaultWithArrayArgument', () => {
		arg = new Argument('foo', undefined, undefined, ArgumentMode.isArray)
		expect(() => arg.setDefault('default')).toThrow()
	})
})
