import { ProgressCounter } from './ProgressCounter'
import { formatTime } from '../../helpers'

interface ProgressFormats {
	normal: () => string
	normalNomax: () => string
	verbose: () => string
	verboseNomax: () => string
	veryVerbose: () => string
	veryVerboseNomax: () => string
	debug: () => string
	debugNomax: () => string
}

export type ProgressFormat = keyof ProgressFormats

export class ProgressStyle implements ProgressFormats {
	protected barWidth: number = 28
	protected barChar?: string
	protected emptyBarChar: string = '-'
	protected progressChar: string = '>'

	constructor(protected counter: ProgressCounter) {}

	protected getBarWidth() {
		return this.barWidth
	}

	protected elapsed(): string {
		return `${new Date().getTime() - this.counter.getStartTime()} secs`
	}

	protected estimated(): string {
		if (!this.counter.getMaxSteps()) {
			throw new Error('Unable to display the estimated time if the maximum number of steps is not set.')
		}

		let estimated = 0

		if (this.counter.getProgress()) {
			estimated = Math.round(
				new Date().getTime() - (this.counter.getStartTime() / this.counter.getProgress()) * this.counter.getMaxSteps()
			)
		}

		return formatTime(estimated)
	}

	protected max(): string {
		return this.counter.getMaxSteps().toString()
	}

	protected percent(): string {
		return Math.floor(this.counter.getProgressPercent() * 100).toString()
	}

	protected current(): string {
		return this.counter
			.getProgress()
			.toString()
			.padStart(4, ' ')
	}

	protected bar(): string {
		const completeBars = Math.floor(
			this.counter.getMaxSteps() > 0
				? this.counter.getProgress() * this.barWidth
				: this.counter.getProgress() % this.barWidth
		)
		let display = this.progressChar.repeat(completeBars)

		if (completeBars < this.barWidth) {
			const emptyBar = this.barWidth - completeBars - this.progressChar.length
			display += this.progressChar + this.emptyBarChar.repeat(emptyBar)
		}
		return `[${display}]`
	}

	protected remaining(): string {
		if (!this.counter.getMaxSteps()) {
			throw new Error('Unable to display the remaining time if the maximum number of steps is not set.')
		}

		let remaining = 0

		if (this.counter.getProgress()) {
			remaining = Math.round(
				(new Date().getTime() / this.counter.getProgress()) * (this.counter.getMaxSteps() - this.counter.getProgress())
			)
		}

		return formatTime(remaining)
	}
	protected memory(): string {
		return 'memory'
		// return Helper:: formatMemory(memory_get_usage(true));
	}

	normal() {
		return `${this.current()}/${this.max()} ${this.bar()} ${this.percent()}`
	}
	normalNomax() {
		return `${this.current()} ${this.bar()}`
	}
	verbose() {
		return `${this.current()}/${this.max()} ${this.bar()} ${this.percent()} ${this.elapsed()}`
	}
	verboseNomax() {
		return `${this.current()} ${this.bar()} ${this.elapsed()}`
	}
	veryVerbose() {
		return ''
	}
	veryVerboseNomax() {
		return ''
	}
	debug() {
		return ''
	}
	debugNomax() {
		return ''
	}
}
