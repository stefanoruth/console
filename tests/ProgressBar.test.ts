import { ProgressBar, ProgressCounter, ProgressFormat, ProgressStyle } from '../src/Output/ProgressBar'
import { Mock } from 'ts-mockery'

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

	describe('Style', () => {
		test('Calcuate elapsed time', () => {
			const run = (dateFn: (d: Date) => number) => {
				const c = Mock.of<ProgressCounter>({ getStartTime: () => dateFn(new Date()) })
				const s = new ProgressStyle(c)

				return s.elapsed().trim()
			}

			// expect(run(d => d.setDate(d.getDate() - 1))).toBe('1 day')
			// expect(run(d => d.setHours(d.getHours() - 1))).toBe('1 hr')
		})

		test('Step widths', () => {
			const run = (max?: number) => {
				const c = new ProgressCounter()

				if (max) {
					c.setMaxSteps(max)
				}

				return new ProgressStyle(c).getStepWidth()
			}

			expect(run()).toBe(4)
			expect(run(1)).toBe(1)
			expect(run(99)).toBe(2)
			expect(run(200)).toBe(3)
			expect(run(50000)).toBe(5)
		})

		test('Display max step', () => {
			const run = (max?: number) => {
				const c = new ProgressCounter()

				if (max) {
					c.setMaxSteps(max)
				}

				return new ProgressStyle(c).max()
			}

			expect(run()).toBe('0')
			expect(run(50)).toBe('50')
		})
	})
})
