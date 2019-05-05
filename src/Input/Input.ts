export class Input<A = {}, O = {}> {
	protected args: string[]
	protected commandName?: string
	// protected arguments: A
	// protected options: O

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
}
