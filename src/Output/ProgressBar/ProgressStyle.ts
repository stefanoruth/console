import { ProgressBar } from './ProgressBar'
import { Verbosity } from '../Verbosity'
import { Output } from '../Output'

type StyleType =
	| 'normal'
	| 'normal_nomax'
	| 'verbose'
	| 'verbose_nomax'
	| 'veryVerbose'
	| 'veryVerbose_nomax'
	| 'debug'
	| 'debug_nomax'

export class ProgressStyle {
	constructor(protected output: Output, protected bar: ProgressBar) {}

	determineBestFormat(): StyleType {
		switch (this.output.getVerbosity()) {
			// OutputInterface::VERBOSITY_QUIET: display is disabled anyway
			case Verbosity.verbose:
				return this.bar.getMaxSteps() ? 'verbose' : 'verbose_nomax'

			case Verbosity.veryVerbose:
				return this.bar.getMaxSteps() ? 'veryVerbose' : 'veryVerbose_nomax'

			case Verbosity.debug:
				return this.bar.getMaxSteps() ? 'debug' : 'debug_nomax'

			default:
				return this.bar.getMaxSteps() ? 'normal' : 'normal_nomax'
		}
	}

	protected getStyle(style: StyleType, typeMax: boolean): () => string {
		const f: any = {} // this.getFormatters()

		const current = typeMax ? `${f.current()}/${f.max()}` : f.current()
		const bar = `[${f.bar()}]`
		const percent = typeMax ? f.percent() : ''
		const base = `${current} ${bar} ${percent}`

		const types = {
			normal: () => base,
			normal_nomax: () => base,
			verbose: () => `${base} ${f.elapsed()}`,
			verbose_nomax: () => `${base} ${f.elapsed()}`,
			veryVerbose: () => `${base} ${f.elapsed()}/${f.estimated()}`,
			veryVerbose_nomax: () => `${base} ${f.elapsed()}`,
			debug: () => `${base} ${f.elapsed()}/${f.estimated()} ${f.memory()}`,
			debug_nomax: () => `${base} ${f.elapsed()} ${f.memory()}`,
		}

		return types[style]
	}

	protected formatBar(): string {
		// const completeBars = Math.floor(
		// 	this.bar.getMaxSteps() > 0
		// 		? this.bar.getProgress() * this.bar.barWidth
		// 		: this.bar.getProgress() % this.bar.barWidth
		// )
		// let display = this.bar.getBarCharacter().repeat(completeBars)

		// if (completeBars < this.bar.barWidth) {
		//     const emptyBar = this.bar.barWidth - completeBars - this.bar.progressChar.length
		//     display += this.bar.progressChar + this.bar.emptyBarChar.repeat(emptyBar)
		// }

		// return display
		return ''
	}
}
