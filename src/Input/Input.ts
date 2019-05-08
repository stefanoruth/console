import { InputArgument } from './InputArgument'
import { InputOption } from './InputOption'

export class Input {
	protected args: string[]
	protected commandName?: string
	protected arguments: { [k: string]: InputArgument } = {}
	protected options: { [k: string]: InputOption } = {}

	constructor() {
		this.args = process.argv.splice(2)
		console.log(this.args)

		if (this.args.length > 0) {
			this.commandName = this.args[0]
		}
		// this.arguments = {}
	}

	getCommandName() {
		return this.commandName
	}

	/**
	 * Check if an option is parsed in by the user.
	 */
	hasOption(option: string): boolean {
		return !!this.options[option]
	}

	/**
	 * Check if an argument is parsed in by the user.
	 */
	hasArgument(arg: string): boolean {
		return !!this.arguments[arg]
	}
}
