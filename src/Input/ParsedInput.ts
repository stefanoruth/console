import { Input } from './Input'

export class ParsedInput {
	constructor(protected input: Input) {}

	raw(): Input {
		return this.input
	}

	args() {
		return {
			...this.arguments(),
			...this.options(),
		}
	}

	arguments() {
		const args = this.input.getArguments()

		if (typeof args.command !== 'undefined') {
			delete args.command
		}

		return args
	}

	options() {
		return this.input.getOptions()
	}
}
