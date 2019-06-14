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
	constructor(protected output: Output, protected progressBar: ProgressBar) {}

	determineBestFormat(): StyleType {
		switch (this.output.getVerbosity()) {
			// OutputInterface::VERBOSITY_QUIET: display is disabled anyway
			case Verbosity.verbose:
				return this.progressBar.getMaxSteps() ? 'verbose' : 'verbose_nomax'

			case Verbosity.veryVerbose:
				return this.progressBar.getMaxSteps() ? 'veryVerbose' : 'veryVerbose_nomax'

			case Verbosity.debug:
				return this.progressBar.getMaxSteps() ? 'debug' : 'debug_nomax'

			default:
				return this.progressBar.getMaxSteps() ? 'normal' : 'normal_nomax'
		}
	}

	protected getStyle(style: StyleType): () => string {
		const f: any = {} // this.getFormatters()

		const types = {
			normal: () => `${f.current()}/${f.max()} [${f.bar()}] ${f.percent()}`,
			normal_nomax: () => `${f.current()} [${f.bar()}]`,
			verbose: () => `${f.current()}/${f.max()} [${f.bar()}] ${f.percent()} ${f.elapsed()}`,
			verbose_nomax: () => `${f.current()}} [${f.bar()}] ${f.elapsed()}`,
			veryVerbose: () => `${f.current()}/${f.max()} [${f.bar()}] ${f.percent()} ${f.elapsed()}/${f.estimated()}`,
			veryVerbose_nomax: () => `${f.current()}} [${f.bar()}] ${f.elapsed()}`,
			debug: () =>
				`${f.current()}/${f.max()} [${f.bar()}] ${f.percent()} ${f.elapsed()}/${f.estimated()} ${f.memory()}`,
			debug_nomax: () => `${f.current()}} [${f.bar()}] ${f.elapsed()} ${f.memory()}`,
		}

		return types[style]
	}
}
