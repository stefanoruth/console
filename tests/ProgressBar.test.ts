import { ProgressBar, ProgressCounter, ProgressFormat, ProgressStyle } from '../src/Output/ProgressBar'
import { Mock } from 'ts-mockery'
import { Verbosity } from '../src/Output/Verbosity'
import { Output, Terminal } from '../src'

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
		test('Change style', () => {
			class TestStyle extends ProgressStyle {
				getStyle() {
					return this.style
				}
			}

			const s = new TestStyle(new ProgressCounter(), { barWidth: 10 })

			expect(s.getStyle().barWidth).toBe(10)
		})

		test('Calcuate elapsed time', () => {
			const s = (time: number) =>
				new (class extends ProgressStyle {
					runTime() {
						return 1000 * time
					}
				})(new ProgressCounter())

			expect(
				s(60 * 60 * 24)
					.elapsed()
					.trim()
			).toBe('1 day')
		})

		test('Calcuate elapsed time', () => {
			const c = new ProgressCounter()
			const s = new (class extends ProgressStyle {
				runTime() {
					return 1000 * 2 // 2 sec
				}
			})(c)

			expect(() => s.estimated()).toThrow('Unable to display the estimated')
			c.start(100)
			c.advance(20)

			expect(s.estimated().trim()).toBe('10 secs')
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

		test('Display progress without max', () => {
			const c = new ProgressCounter()
			const s = new ProgressStyle(c)

			c.start()
			expect(s.current()).toBe('   0')
			expect(s.percent()).toBe('  0%')

			c.advance()
			expect(s.current()).toBe('   1')
			expect(s.percent()).toBe('  0%')

			c.advance(50)
			expect(s.current()).toBe('  51')
			expect(s.percent()).toBe('  0%')
		})

		test('Display progress with max', () => {
			const c = new ProgressCounter()
			const s = new ProgressStyle(c)

			c.start(50)
			expect(s.current()).toBe(' 0')
			expect(s.percent()).toBe('  0%')
			expect(s.max()).toBe('50')

			c.advance()
			expect(s.current()).toBe(' 1')
			expect(s.percent()).toBe('  2%')
			expect(s.max()).toBe('50')

			c.advance(50)
			expect(s.current()).toBe('51')
			expect(s.percent()).toBe('100%')
			expect(s.max()).toBe('51')
		})

		test('Display memory', () => {
			const action = jest.spyOn(process, 'memoryUsage').mockImplementation(() => {
				return {
					heapUsed: 500 * 1024 * 1024,
				} as any
			})

			const s = new ProgressStyle(new ProgressCounter())

			expect(s.memory().trim()).toBe('500 B')
			expect(action).toHaveBeenCalled()
		})

		test('Generate bar the damm bar', () => {
			const c = new ProgressCounter()
			const s = new ProgressStyle(c, { barWidth: 5 })
			c.start()

			expect(s.bar()).toBe('[>----]')
			c.advance()
			expect(s.bar()).toBe('[=>---]')
			c.advance(2)
			expect(s.bar()).toBe('[===>-]')
			c.advance()
			expect(s.bar()).toBe('[====>]')
			c.finish()
			expect(s.bar()).toBe('[=====]')
		})
	})

	test('Render Format', () => {
		const render = (verbosity: Verbosity, showMax: boolean) => {
			const o = new Output(Mock.all<Terminal>())
			const c = new ProgressCounter()

			o.setVerbosity(verbosity)

			const f = new ProgressFormat(o)

			c.start()

			if (showMax) {
				c.setMaxSteps(80)
			}

			c.advance(20)

			const formatType = f.getFormat(showMax)
			const s = new ProgressStyle(c, { barWidth: 3 })

			return f.getRenderFn(formatType)(s)
		}

		expect(render(Verbosity.normal, true)).toBe('20/80 [>--]  25%')
		expect(render(Verbosity.normal, false)).toBe('  20 [==>]')
		expect(render(Verbosity.verbose, true)).toBe('20/80 [>--]  25% < 1 sec')
		expect(render(Verbosity.verbose, false)).toBe('  20 [==>] < 1 sec')
		expect(render(Verbosity.veryVerbose, true)).toBe('20/80 [>--]  25% < 1 sec/< 1 sec')
		expect(render(Verbosity.veryVerbose, false)).toBe('  20 [==>] < 1 sec')
		expect(render(Verbosity.debug, true)).toBe('20/80 [>--]  25% < 1 sec/< 1 sec  500 B')
		expect(render(Verbosity.debug, false)).toBe('  20 [==>] < 1 sec  500 B')
		expect(render(Verbosity.quiet, true)).toBe('')
		expect(render(Verbosity.quiet, false)).toBe('')
	})

	test('Public api', () => {
		const write = jest.fn()
		const t = Mock.of<Terminal>({ write, clearLine: jest.fn(), cursorReset: jest.fn() })
		const o = new Output(t)
		const b = new ProgressBar(o, t)

		b.setMaxSteps(5)
		b.start()
		expect(write).toHaveBeenCalledTimes(1)
		b.advance()
		expect(write).toHaveBeenCalledTimes(2)
		b.setProgress(4)
		expect(write).toHaveBeenCalledTimes(3)
		b.finish()
		expect(write).toHaveBeenCalledTimes(4)
	})
})
