export class ProgressCounter {
	protected step: number = 0
	protected startTime?: number
	protected percent: number = 0.0
	protected max: number = 0
	protected redrawFreq: number = 1

	/**
	 * Starts the progress output.
	 */
	start(max?: number) {
		this.startTime = new Date().getTime()
		this.step = 0
		this.percent = 0.0

		if (max !== undefined) {
			this.setMaxSteps(max)
		}
	}

	/**
	 * Advances the progress output X steps.
	 */
	advance(step: number = 1) {
		return this.setProgress(this.step + step)
	}

	/**
	 * Set the progress output X steps.
	 *
	 * Returns if time to redraw.
	 */
	setProgress(step: number): boolean {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		if (this.max && step > this.max) {
			this.max = step
		} else if (step < 0) {
			step = 0
		}

		// Ensure we dont redraw to often.
		const prevPeriod = this.step / this.redrawFreq
		const currPeriod = step / this.redrawFreq
		// Change step
		this.step = step
		this.percent = this.max ? this.step / this.max : 0

		if (prevPeriod !== currPeriod || this.max === step) {
			// console.log(this.step, this.percent)
			return true
		}

		return false
	}

	/**
	 * Set max steps.
	 */
	setMaxSteps(max: number) {
		this.max = Math.max.apply(null, [0, max])
	}

	/**
	 * Finishes the progress output.
	 */
	finish() {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		if (!this.max) {
			this.max = this.step
		}

		if (this.step === this.max) {
			// prevent double 100% output
			return
		}

		return this.setProgress(this.max)
	}

	getMaxSteps() {
		return this.max
	}

	getProgress() {
		return this.step
	}

	getProgressPercent() {
		return this.percent
	}

	getStartTime() {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		return this.startTime
	}
}
