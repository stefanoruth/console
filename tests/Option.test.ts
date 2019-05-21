import { Option, OptionMode } from '../src/Input'

let option: Option

describe('Option', () => {
	test('Constructor', () => {
		option = new Option('foo')
		expect(option.getName()).toBe('foo')

		option = new Option('--foo')
		expect(option.getName()).toBe('foo')
	})

	test('ArrayModeWithoutValue', () => {
		expect(() => new Option('foo', 'f', OptionMode.isArray)).toThrow()
	})

	test('Shortcut', () => {
		option = new Option('foo', 'f')
		expect(option.getShortcut()).toBe('f')

		option = new Option('foo', '-f|-ff|fff')
		expect(option.getShortcut()).toBe('f|ff|fff')

		option = new Option('foo', ['f', 'ff', '-fff'])
		expect(option.getShortcut()).toBe('f|ff|fff')

		option = new Option('foo')
		expect(option.getShortcut()).toBe(undefined)
	})

	test('Modes', () => {
		option = new Option('foo', 'f')
		expect(option.acceptValue()).toBeFalsy()
		expect(option.isValueRequired()).toBeFalsy()
		expect(option.isValueOptional()).toBeFalsy()

		option = new Option('foo', 'f', undefined)
		expect(option.acceptValue()).toBeFalsy()
		expect(option.isValueRequired()).toBeFalsy()
		expect(option.isValueOptional()).toBeFalsy()

		option = new Option('foo', 'f', OptionMode.none)
		expect(option.acceptValue()).toBeFalsy()
		expect(option.isValueRequired()).toBeFalsy()
		expect(option.isValueOptional()).toBeFalsy()

		option = new Option('foo', 'f', OptionMode.required)
		expect(option.acceptValue()).toBeTruthy()
		expect(option.isValueRequired()).toBeTruthy()
		expect(option.isValueOptional()).toBeFalsy()

		option = new Option('foo', 'f', OptionMode.optional)
		expect(option.acceptValue()).toBeTruthy()
		expect(option.isValueRequired()).toBeFalsy()
		expect(option.isValueOptional()).toBeTruthy()
	})

	test('InvalidModes', () => {
		expect(() => new Option('foo', 'f', -1)).toThrow()
	})

	test('EmptyNameIsInvalid', () => {
		expect(() => new Option('')).toThrow()
	})

	test('DoubleDashNameIsInvalid', () => {
		expect(() => new Option('--')).toThrow()
	})

	test('SingleDashOptionIsInvalid', () => {
		expect(() => new Option('foo', '-')).toThrow()
	})

	test('IsArray', () => {
		option = new Option('foo', undefined, OptionMode.optional | OptionMode.isArray)
		expect(option.isArray()).toBeTruthy()

		option = new Option('foo', undefined, OptionMode.none)
		expect(option.isArray()).toBeFalsy()
	})

	test('GetDescription', () => {
		option = new Option('foo', 'f', undefined, 'Some description')
		expect(option.getDescription()).toBe('Some description')
	})

	test('GetDefault', () => {
		option = new Option('foo', undefined, OptionMode.optional, undefined, 'default')
		expect(option.getDefault()).toBe('default')

		option = new Option('foo', undefined, OptionMode.required, undefined, 'default')
		expect(option.getDefault()).toBe('default')

		option = new Option('foo', undefined, OptionMode.required)
		expect(option.getDefault()).toBe(undefined)

		option = new Option('foo', undefined, OptionMode.optional | OptionMode.isArray)
		expect(option.getDefault()).toEqual([])

		option = new Option('foo', undefined, OptionMode.none)
		expect(option.getDefault()).toBe(false)
	})

	test('SetDefault', () => {
		option = new Option('foo', undefined, OptionMode.required, 'default')
		option.setDefault(null)
		expect(option.getDefault()).toBe(null)
		option.setDefault('another')
		expect(option.getDefault()).toBe('another')

		option = new Option('foo', undefined, OptionMode.required | OptionMode.isArray)
		option.setDefault([1, 2])
		expect(option.getDefault()).toEqual([1, 2])
	})

	test('DefaultValueWithValueNoneMode', () => {
		option = new Option('foo', 'f', OptionMode.none)

		expect(() => option.setDefault('default')).toThrow()
	})

	test('DefaultValueWithIsArrayMode', () => {
		option = new Option('foo', 'f', OptionMode.optional | OptionMode.isArray)

		expect(() => option.setDefault('default')).toThrow()
	})

	test('Equals', () => {
		option = new Option('foo', 'f', undefined, 'Some description')
		let option2 = new Option('foo', 'f', undefined, 'Alternative description')
		expect(option.equals(option2)).toBeTruthy()

		option = new Option('foo', 'f', OptionMode.optional, 'Some description')
		option2 = new Option('foo', 'f', OptionMode.optional, 'Some description', true)
		expect(option.equals(option2)).toBeFalsy()

		option = new Option('foo', 'f', undefined, 'Some description')
		option2 = new Option('bar', 'f', undefined, 'Some description')
		expect(option.equals(option2)).toBeFalsy()

		option = new Option('foo', 'f', undefined, 'Some description')
		option2 = new Option('foo', '', undefined, 'Some description')
		expect(option.equals(option2)).toBeFalsy()

		option = new Option('foo', 'f', undefined, 'Some description')
		option2 = new Option('foo', 'f', OptionMode.optional, 'Some description')
		expect(option.equals(option2)).toBeFalsy()
	})
})
