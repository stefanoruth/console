import { Counter } from './ProgressCounter'
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

	constructor(protected counter: Counter) {}

	/**
	 * Calculate the amount of miliseconds the counter has been running.
	 */
	protected runTime(): number {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		return new Date().getTime() - this.getStartTime()
	}

	/**
	 * Show in human form how long the command has been running.
	 */
	showElapsed(): string {
		return formatTime(this.runTime()).padStart(6, ' ')
	}

	/**
	 * Estimate, how long the command is going to run.
	 */
	showEstimated(): string {
		if (!this.getMaxSteps()) {
			throw new Error('Unable to display the estimated time if the maximum number of steps is not set.')
		}

		let estimated = 0

		if (this.getProgress()) {
			estimated = Math.round((this.runTime() / this.getProgress()) * this.getMaxSteps())
		}

		return formatTime(estimated).padStart(6, ' ')
	}

	/**
	 * Calculate the width of the progress counter.
	 */
	getStepWidth() {
		return this.getMaxSteps() ? this.getMaxSteps().toString().length : 4
	}

	/**
	 * Calcuate the max amount of steps.
	 */
	showMax(): string {
		return this.getMaxSteps().toString()
	}

	/**
	 * Calculate how many procent of the work is done.
	 */
	showPercent(): string {
		return (
			Math.floor(this.percent * 100)
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
	showBar(): string {
		const completeBars = Math.floor(
			this.getMaxSteps() > 0
				? (this.getProgress() / this.getMaxSteps()) * this.barWidth
				: this.getProgress() % this.barWidth
		)

		let display = this.barChar.repeat(completeBars)

		if (completeBars < this.barWidth) {
			const emptyBar = this.barWidth - completeBars - this.progressChar.length
			display += this.progressChar + this.emptyBarChar.repeat(emptyBar)
		}

		return `[${display}]`
	}

	/**
	 * Calculate the memory usages of the current progress.
	 */
	showMemory(): string {
		return formatMemory(process.memoryUsage().heapUsed / 1024 / 1024).padStart(6, ' ')
	}
}
