import { Output } from './Output'

export class ProgressBar {
	protected barWidth: number = 28
	protected barChar?: string
	protected emptyBarChar: string = '-'
	protected progressChar: string = '>'
	protected format?: string
	protected internalFormat?: string
	protected redrawFreq: number = 1
	protected step: number = 0
	protected startTime?: number
	protected stepWidth?: number
	protected percent: number = 0.0
	protected formatLineCount?: number
	protected messages: string[] = []
	protected overwrite: boolean = true
	protected firstRun: boolean = true

	constructor(protected output: Output, protected max: number = 0) {
		this.startTime = new Date().getTime()
	}

	/**
	 * Starts the progress output.
	 */
	start() {
		this.startTime = new Date().getTime()
		this.step = 0
		this.percent = 0.0

		this.display()
	}

	/**
	 * Advances the progress output X steps.
	 */
	advance(step: number = 1) {
		this.setProgress(this.step + step)
	}

	/**
	 * Set the progress output X steps.
	 */
	setProgress(step: number) {
		console.log(step)
		if (this.max && step > this.max) {
			this.max = step
		} else if (step < 0) {
			step = 0
		}

		const prevPeriod = this.step / this.redrawFreq
		const currPeriod = step / this.redrawFreq
		this.step = step
		this.percent = this.max ? this.step / this.max : 0

		if (prevPeriod !== currPeriod || this.max === step) {
			this.display()
		}
	}

	/**
	 * Finishes the progress output.
	 */
	finish() {
		if (!this.max) {
			this.max = this.step
		}

		if (this.step === this.max && !this.overwrite) {
			// prevent double 100% output
			return
		}

		this.setProgress(this.max)
	}

	/**
	 * Outputs the current progress string.
	 */
	display(): void {
		// if (OutputInterface:: VERBOSITY_QUIET === $this -> output -> getVerbosity()) {
		//     return;
		// }
		// if (null === $this -> format) {
		//     $this -> setRealFormat($this -> internalFormat ?: $this -> determineBestFormat());
		// }
		// $this -> overwrite($this -> buildLine());
	}
}
