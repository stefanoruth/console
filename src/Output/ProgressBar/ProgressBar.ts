import { Output } from '../Output'
import { Terminal } from '../Terminal'
import { ProgressBarStyle } from './ProgressBarStyle'
import { Counter } from './Counter'
import { Verbosity } from '../Verbosity'
import { DisplayProgress } from './ProgressFormat'

export class ProgressBar {
	protected render?: DisplayProgress
	protected style: ProgressStyle
	protected counter: ProgressCounter

	/**
	 * Build new progress bar.
	 */
	constructor(
		protected output: Output,
		protected terminal: Terminal,
		protected counter: Counter = new Counter(),
		protected style: ProgressBarStyle = new ProgressBarStyle()
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
			this.display()
		}
	}

	/**
	 * Outputs the current progress string.
	 */
	protected display(): void {
		if (!this.render) {
			this.render = this.style.format(this.getFormat())
		}

		const display = this.render(this.counter)

		this.terminal.clearLine()
		this.terminal.cursorReset()
		this.terminal.write(display)
	}
}
