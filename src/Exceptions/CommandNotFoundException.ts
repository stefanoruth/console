export class CommandNotFoundException extends Error {
	constructor(message: string, protected alternatives: string[] = []) {
		super(message)
		this.name = this.constructor.name
	}

	/**
	 * A list of similar defined names
	 */
	getAlternatives() {
		return this.alternatives
	}
}
