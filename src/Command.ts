import { Console as Application } from './Console'
import { Output } from './Output'
import { Input } from './Input'

export abstract class Command<Arguments = {}, Options = {}> {
	abstract name: string
	protected application?: Application
	protected output?: Output
	protected input?: Input<Arguments, Options>

	/**
	 * Build Command
	 */
	constructor() {
		// this.output = output
		// this.input = input
	}

	protected call(commandName: string, options: {} = {}) {
		//
	}

	protected getApplication() {
		return this.application
	}

	setApplication(application?: Application): Command {
		this.application = application

		return this
	}

	setInput(input: Input) {
		this.input = input

		return this
	}

	setOutput(output: Output) {
		this.output = output

		return this
	}

	abstract handle(): void
}
