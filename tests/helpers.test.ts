import { extractNamespace, escapeshellarg, strlen } from '../src/helpers'
import { Color } from '../src/Output/Color'

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
})
