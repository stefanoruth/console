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
})
