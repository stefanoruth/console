export class ArgvInput {
	protected tokens: string[]

	constructor(argv?: string[]) {
		if (!argv) {
			argv = process.argv.slice(2)
		}

		this.tokens = argv
	}
}
