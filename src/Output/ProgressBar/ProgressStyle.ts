import { ProgressCounter } from './ProgressCounter'
import { formatMemory, formatTime } from '../../helpers'

interface Style {
	barWidth: number
	barChar: string
	emptyBarChar: string
	progressChar: string
}

export class ProgressStyle {
	protected style: Style = {
		barWidth: 28,
		barChar: '=',
		emptyBarChar: '-',
		progressChar: '>',
	}

	constructor(protected counter: ProgressCounter) {}

	/**
	 * Calculate the amount of miliseconds the counter has been running.
	 */
	protected runTime(): number {
		return new Date().getTime() - this.counter.getStartTime()
	}

	/**
	 * Show in human form how long the command has been running.
	 */
	elapsed(): string {
		return formatTime(this.runTime()).padStart(6, ' ')
	}

	/**
	 * Estimate, how long the command is going to run.
	 */
	estimated(): string {
		if (!this.counter.getMaxSteps()) {
			throw new Error('Unable to display the estimated time if the maximum number of steps is not set.')
		}

		let estimated = 0

		if (this.counter.getProgress()) {
			estimated = Math.round((this.runTime() / this.counter.getProgress()) * this.counter.getMaxSteps())
		}

		return formatTime(estimated).padStart(6, ' ')
	}

	/**
	 * Calculate the width of the progress counter.
	 */
	getStepWidth() {
		return this.counter.getMaxSteps() ? this.counter.getMaxSteps().toString().length : 4
	}

	/**
	 * Calcuate the max amount of steps.
	 */
	max(): string {
		return this.counter.getMaxSteps().toString()
	}

	/**
	 * Calculate how many procent of the work is done.
	 */
	percent(): string {
		return (
			Math.floor(this.counter.getProgressPercent() * 100)
				.toString()
				.padStart(3, ' ') + '%'
		)
	}

	/**
	 * Show the current progress of the counter.
	 */
	current(): string {
		return this.counter
			.getProgress()
			.toString()
			.padStart(this.getStepWidth(), ' ')
	}

	/**
	 * Render the bar showing progress.
	 */
	bar(): string {
		const completeBars = Math.floor(
			this.counter.getMaxSteps() > 0
				? (this.counter.getProgress() / this.counter.getMaxSteps()) * this.style.barWidth
				: this.counter.getProgress() % this.style.barWidth
		)

		let display = this.style.barChar.repeat(completeBars)

		if (completeBars < this.style.barWidth) {
			const emptyBar = this.style.barWidth - completeBars - this.style.progressChar.length
			display += this.style.progressChar + this.style.emptyBarChar.repeat(emptyBar)
		}

		return `[${display}]`
	}

	/**
	 * Calculate the memory usages of the current progress.
	 */
	memory(): string {
		return formatMemory(process.memoryUsage().heapUsed / 1024 / 1024).padStart(6, ' ')
	}
}
