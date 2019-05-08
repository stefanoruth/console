import { Application } from '../Application'
import { Output } from '../Output/Output'
import { Input } from '../Input/Input'
import { Argument } from './Argument'
import { Option } from './Option'
import { Signature } from './Signature'

export abstract class Command {
	protected abstract name: string
	protected signature: Signature = new Signature()
	protected application?: Application
	private _input?: Input
	private _output?: Output

	/**
	 * Build Command
	 */
	constructor() {
		//
	}

	async run(input: Input, output: Output) {
		this._input = input
		this._output = output

		return this.handle()
	}

	/**
	 * Fetch application.
	 */
	protected getApplication(): Application {
		if (!this.application) {
			throw new Error('Application has not been set for the Command')
		}
		return this.application
	}

	/**
	 * Set the application
	 */
	setApplication(application?: Application) {
		this.application = application

		return this
	}

	/**
	 * Returns the command name.
	 */
	getName() {
		return this.name
	}

	get output() {
		if (!this._output) {
			throw new Error('Output has not yet been set')
		}

		return this._output
	}

	get input() {
		if (!this._input) {
			throw new Error('Input has not yet been set')
		}

		return this._input
	}

	abstract async handle(): Promise<void>
}
