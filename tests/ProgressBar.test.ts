import { ProgressBar, ProgressCounter, ProgressFormat, ProgressStyle } from '../src/Output/ProgressBar'

describe('ProgressBar', () => {
	describe('Counter', () => {
		test('Automatic start timer', () => {
			const c = new ProgressCounter()

			expect(() => c.getStartTime()).toThrow()
			c.start()
			expect(() => c.getStartTime()).not.toThrow()
		})

		test('Works with a max value', () => {
			const c = new ProgressCounter()

			expect(c.start(200).getMaxSteps()).toBe(200)
		})

		test('Works without a max value', () => {
			const c = new ProgressCounter()

			expect(c.start().getMaxSteps()).toBe(0)
		})

		test('Need to call start before advancing', () => {
			const c = new ProgressCounter()

			expect(() => c.advance()).toThrow()
			c.start()
			expect(() => c.advance()).not.toThrow()
		})

		test('Need to call start before finishing', () => {
			const c = new ProgressCounter()

			expect(() => c.finish()).toThrow()
			c.start()
			expect(() => c.finish()).not.toThrow()
		})

		test('Can calcuate progress', () => {
			const c = new ProgressCounter()

			c.start(5)

			c.advance()
			expect(c.getProgress()).toBe(1)
			expect(c.getProgressPercent()).toBe(0.2)

			c.advance(3)
			expect(c.getProgress()).toBe(4)
			expect(c.getProgressPercent()).toBe(0.8)
		})

		test('Finish set step to max value', () => {
			const c = new ProgressCounter()

			c.start(5).advance()
			expect(c.getProgress()).toBe(1)

			c.finish()
			expect(c.getProgress()).toBe(5)
		})

		test('Can advance beyond the max level', () => {
			const c = new ProgressCounter()
			c.start(5)

			expect(c.getMaxSteps()).toBe(5)
			c.advance(10)
			expect(c.getMaxSteps()).toBe(10)
		})

		test('Can advance backwards but not beyond zero', () => {
			const c = new ProgressCounter()
			c.start()

			c.advance(-1)
			expect(c.getProgress()).toBe(0)

			c.advance(10)
			expect(c.getProgress()).toBe(10)

			c.advance(-5)
			expect(c.getProgress()).toBe(5)

			c.advance(-10)
			expect(c.getProgress()).toBe(0)
		})
	})
})
