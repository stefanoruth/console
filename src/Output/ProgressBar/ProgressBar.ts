import { Output } from '../Output'
import { Terminal } from '../Terminal'
import { ProgressStyle } from './ProgressStyle'
import { ProgressCounter } from './ProgressCounter'
import { DisplayProgress, ProgressFormat } from './ProgressFormat'

export class ProgressBar {
	protected render?: DisplayProgress
	protected style?: ProgressStyle

	/**
	 * Build new progress bar.
	 */
	constructor(
		protected output: Output,
		protected terminal: Terminal,
		protected counter: ProgressCounter = new ProgressCounter(),
		protected formatter: ProgressFormat = new ProgressFormat(output)
	) {}

	/**
	 * Starts the progress output.
	 */
	start(max?: number) {
		this.counter.start(max)

		this.display()

		return this
	}

	/**
	 * Advances the progress output X steps.
	 */
	advance(step: number = 1) {
		if (this.counter.advance(step)) {
			this.display()
		}
	}

	/**
	 * Set the progress output X steps.
	 */
	setProgress(step: number) {
		if (this.counter.setProgress(step)) {
			this.display()
		}
	}

	/**
	 * Set max steps.
	 */
	setMaxSteps(max: number) {
		this.counter.setMaxSteps(max)
	}

	/**
	 * Finishes the progress output.
	 */
	finish() {
		if (this.counter.finish()) {
			return this.display()
		}
	}

	/**
	 * Get progress styling.
	 */
	getStyle() {
		if (!this.style) {
			this.style = new ProgressStyle(this.counter)
		}

		return this.style
	}

	/**
	 * Outputs the current progress string.
	 */
	protected display(): string {
		if (!this.render) {
			const hasMax = !!this.counter.getMaxSteps()

			const format = this.formatter.getFormat(hasMax)

			this.render = this.formatter.getRenderFn(format)
		}

		const display = this.render(this.getStyle())

		this.terminal.clearLine()
		this.terminal.cursorReset()
		this.terminal.write(display)

		return display
	}
}
