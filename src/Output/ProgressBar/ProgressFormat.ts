import { Output } from '../Output'
import { ProgressStyle } from './ProgressStyle'

export type DisplayProgress = (counter: ProgressStyle) => string

enum Format {
	normal,
	quiet,
	verbose,
	veryVerbose,
	debug,
	normalNomax,
	verboseNomax,
	veryVerboseNomax,
	debugNomax,
	quietNomax,
}

type FormatName = keyof typeof Format

export class ProgressFormat {
	constructor(protected output: Output) {}

	/**
	 * Find out which format we should render for the user.
	 */
	getFormat(showMax: boolean): FormatName {
		const verbosity = this.output.getVerbosity()
		let type

		if (showMax) {
			type = Format[verbosity as any]
		} else {
			type = (Format[verbosity as any] + 'Nomax') as any
		}

		return type
	}

	getRenderFn(format: FormatName): DisplayProgress {
		const types: { [k in FormatName]: DisplayProgress } = {
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
			quiet: (c: ProgressStyle) => {
				return ''
			},
			quietNomax: (c: ProgressStyle) => {
				return ''
			},
		}

		return types[format]
	}
}
