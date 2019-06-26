import { extractNamespace, escapeshellarg, strlen, formatTime, formatMemory } from '../src/helpers'
import { Color } from '../src/Output/Style/Color'

describe('Helpers', () => {
	test('Extract Namespace', () => {
		expect(extractNamespace('app')).toBe('')
		expect(extractNamespace('app:home')).toBe('app')
		expect(extractNamespace('app:home:page')).toBe('app:home')
		expect(extractNamespace('app:home:page:nested')).toBe('app:home:page')
	})

	test('escapeshellarg', () => {
		expect(escapeshellarg("Hello's world")).toBe("Hello\\'s world")
	})

	test('strlen without cli colors', () => {
		expect(strlen('Foo')).toBe(3)

		const textColor = new Color().apply('Foo', { text: 'green' })
		expect(textColor).toBe('\x1b[32mFoo\x1b[0m')
		expect(strlen(textColor)).toBe(3)
	})

	test('formatTime', () => {
		const values: Array<[number, string]> = [
			[0, '< 1 sec'],
			[1, '1 sec'],
			[2, '2 secs'],
			[59, '59 secs'],
			[60, '1 min'],
			[61, '1 min'],
			[119, '1 min'],
			[120, '2 mins'],
			[121, '2 mins'],
			[3599, '59 mins'],
			[3600, '1 hr'],
			[7199, '1 hr'],
			[7200, '2 hrs'],
			[7201, '2 hrs'],
			[86399, '23 hrs'],
			[86400, '1 day'],
			[86401, '1 day'],
			[172799, '1 day'],
			[172800, '2 days'],
			[172801, '2 days'],
		]

		values.forEach(value => {
			expect(formatTime(value[0] * 1000)).toBe(value[1])
		})

		expect(() => formatTime(-1)).toThrow()
	})

	test('formatMemory', () => {
		const values: Array<[number, string]> = [
			[0, '0 B'],
			[1, '1 B'],
			[2, '2 B'],
			[1000, '1000 B'],
			[1024, '1 KiB'],
			[1024 * 1024, '1.0 MiB'],
			[1024 * 1024 * 1024, '1.0 GiB'],
		]

		values.forEach(value => {
			expect(formatMemory(value[0])).toBe(value[1])
		})
	})
})
