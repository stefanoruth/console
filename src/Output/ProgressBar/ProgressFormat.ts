import { ProgressCounter } from './ProgressCounter'
import { Verbosity } from '../Verbosity'
import { Output } from '../Output'
import { ProgressStyle } from './ProgressStyle'

export type DisplayProgress = (counter: ProgressCounter) => string

enum Format {
	normal,
	normalNomax,
	verbose,
	verboseNomax,
	veryVerbose,
	veryVerboseNomax,
	debug,
	debugNomax,
}

export class ProgressFormat {
	constructor(protected output: Output) {}

	/**
	 * Find out which format we should render for the user.
	 */
	protected getFormat(showMax: boolean): Format {
		const verbosity = this.output.getVerbosity()
		let type: keyof typeof Format

		if (showMax) {
			type = verbosity as any
		} else {
			type = (verbosity + 'Nomax') as any
		}

		return Format[type]
	}

	getRenderFn(type: keyof typeof Format) {
		const types: { [k: keyof typeof Format]: DisplayProgress } = {
			normal: (c: ProgressStyle) => {
				return `${c.current()}/${c.max()} ${c.bar()} ${c.percent()}`
			},
			normalNomax: (c: ProgressStyle) => {
				return `${c.current()} ${c.bar()}`
			},
			verbose: (c: ProgressStyle) => {
				return `${c.current()}/${c.max()} ${c.bar()} ${c.percent()} ${c.elapsed()}`
			},
			verboseNomax: (c: ProgressStyle) => {
				return `${c.current()} ${c.bar()} ${c.elapsed()}`
			},
			veryVerbose: (c: ProgressStyle) => {
				return `${c.current()}/${c.max()} ${c.bar()} ${c.percent()} ${c.elapsed()}/${c.estimated()}`
			},
			veryVerboseNomax: (c: ProgressStyle) => {
				return `${c.current()} ${c.bar()} ${c.elapsed()}`
			},
			debug: (c: ProgressStyle) => {
				return `${c.current()}/${c.max()} ${c.bar()} ${c.percent()} ${c.elapsed()}/${c.estimated()} ${c.memory()}`
			},
			debugNomax: (c: ProgressStyle) => {
				return `${c.current()} ${c.bar()} ${c.elapsed()} ${c.memory()}`
			},
		}

		return types[type]
	}
}
