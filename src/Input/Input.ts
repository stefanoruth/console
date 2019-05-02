export class Input<A = {}, O = {}> {
	protected args: string[]
	// protected arguments: A
	// protected options: O

	constructor() {
		this.args = process.argv.splice(2)
		// this.arguments = {}
	}
}
