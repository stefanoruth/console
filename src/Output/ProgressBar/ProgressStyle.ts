import { ProgressCounter } from './ProgressCounter'
import { formatTime, formatMemory } from '../../helpers'

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

export class ProgressStyle {
	protected barWidth: number = 28
	protected barChar: string = '='
	protected emptyBarChar: string = '-'
	protected progressChar: string = '>'

	constructor(protected counter: ProgressCounter) {}

	protected runTime(): number {
		return (new Date().getTime() - this.counter.getStartTime()) / 1000
	}

	protected elapsed(): string {
		return formatTime(this.runTime()).padStart(6, ' ')
	}

	protected estimated(): string {
		if (!this.counter.getMaxSteps()) {
			throw new Error('Unable to display the estimated time if the maximum number of steps is not set.')
		}

		let estimated = 0

		if (this.counter.getProgress()) {
			estimated = Math.round((this.runTime() / this.counter.getProgress()) * this.counter.getMaxSteps())
		}

		return '-' + formatTime(estimated).padStart(6, ' ')
	}

	protected getStepWidth() {
		return this.max ? this.max.length : 4
	}

	protected max(): string {
		return this.counter.getMaxSteps().toString()
	}

	protected percent(): string {
		return Math.floor(this.counter.getProgressPercent() * 100)
			.toString()
			.padStart(3, ' ')
	}

	protected current(): string {
		return this.counter
			.getProgress()
			.toString()
			.padStart(this.getStepWidth(), ' ')
	}

	protected bar(): string {
		const completeBars = Math.floor(
			this.counter.getMaxSteps() > 0
				? (this.counter.getProgress() / this.counter.getMaxSteps()) * this.barWidth
				: this.counter.getProgress() % this.barWidth
		)

		let display = this.barChar.repeat(completeBars)

		if (completeBars < this.barWidth) {
			const emptyBar = this.barWidth - completeBars - this.progressChar.length
			display += this.progressChar + this.emptyBarChar.repeat(emptyBar)
		}

		return `[${display}]`
	}

	protected memory(): string {
		return formatMemory(process.memoryUsage().heapUsed / 1024 / 1024).padStart(6, ' ')
	}

	format(type: keyof ProgressFormats): () => string {
		const formatters: ProgressFormats = {
			normal: () => `${this.current()}/${this.max()} ${this.bar()} ${this.percent()}`,
			normalNomax: () => `${this.current()} ${this.bar()}`,
			verbose: () => `${this.current()}/${this.max()} ${this.bar()} ${this.percent()} ${this.elapsed()}`,
			verboseNomax: () => `${this.current()} ${this.bar()} ${this.elapsed()}`,
			veryVerbose: () =>
				`${this.current()}/${this.max()} ${this.bar()} ${this.percent()} ${this.elapsed()}/${this.estimated()}`,
			veryVerboseNomax: () => `${this.current()} ${this.bar()} ${this.elapsed()}`,
			debug: () =>
				`${this.current()}/${this.max()} ${this.bar()} ${this.percent()} ${this.elapsed()}/${this.estimated()} ${this.memory()}`,
			debugNomax: () => `${this.current()} ${this.bar()} ${this.elapsed()} ${this.memory()}`,
		}

		return formatters[type]
	}
}
