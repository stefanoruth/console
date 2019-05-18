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
		expect(() => new Option('foo', 'f', undefined, OptionMode.isArray)).toThrow()
	})

	test('Shortcut', () => {
		option = new Option('foo', 'f')
		expect(option.getShortcut()).toBe('f')

		option = new Option('foo', '-f|-ff|fff')
		expect(option.getShortcut()).toBe('f|ff|fff')

		option = new Option('foo', ['f', 'ff', '-fff'])
		expect(option.getShortcut()).toBe('f|ff|fff')

		option = new Option('foo')
		expect(option.getShortcut()).toBe(null)
	})

	//
})
