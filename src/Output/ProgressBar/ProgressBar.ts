import { Output } from '../Output'
import { Terminal } from '../Terminal'
import { ProgressStyle, ProgressFormat } from './ProgressStyle'
import { ProgressCounter } from './ProgressCounter'
import { Verbosity } from '../Verbosity'

export class ProgressBar {
	protected format?: ProgressFormat
	protected style: ProgressStyle
	protected counter: ProgressCounter

	/**
	 * Build new progress bar.
	 */
	constructor(protected output: Output, protected terminal: Terminal) {
		this.counter = new ProgressCounter()
		this.style = new ProgressStyle(this.counter)
	}

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
		if (!this.format) {
			this.format = this.getFormat()
		}

		const render = this.style.format(this.format)

		this.terminal.clearLine()
		this.terminal.cursorReset()
		this.terminal.write(render())
	}

	/**
	 * Find out which format we should render for the user.
	 */
	protected getFormat(): ProgressFormat {
		switch (this.output.getVerbosity()) {
			// OutputInterface::VERBOSITY_QUIET: display is disabled anyway
			case Verbosity.verbose:
				return this.counter.getMaxSteps() ? 'verbose' : 'verboseNomax'

			case Verbosity.veryVerbose:
				return this.counter.getMaxSteps() ? 'veryVerbose' : 'veryVerboseNomax'

			case Verbosity.debug:
				return this.counter.getMaxSteps() ? 'debug' : 'debugNomax'

			default:
				return this.counter.getMaxSteps() ? 'normal' : 'normalNomax'
		}
	}
}
