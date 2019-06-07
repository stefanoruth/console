import { Formatter } from '../src/Output/Style/Formatter'

describe('Output > Style > Formatter', () => {
	test('BundledStyles', () => {
		const formatter = new Formatter()

		expect(formatter.format('<error>some error</error>')).toBe('')
	})
})
