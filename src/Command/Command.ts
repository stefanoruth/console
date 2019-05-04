import { Application } from '../Application'
import { Output } from '../Output/Output'
import { Input } from '../Input/Input'
import { Argument } from './Argument'
import { Option } from './Option'

export abstract class Command {
	protected name?: string
	protected signature: Array<Argument<any> | Option<any>> = []
	protected application?: Application
	protected output?: Output
	protected input?: Input<Argument, Option>

	/**
	 * Build Command
	 */
	constructor() {
		this.output = new Output()
		this.input = new Input()
	}

	async call(args: Argument[], options: Option[]) {
		return this.handle(args, options)
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

	setInput(input: Input) {
		this.input = input

		return this
	}

	setOutput(output: Output) {
		this.output = output

		return this
	}

	/**
	 * Returns the command name.
	 */
	getName() {
		if (!this.name) {
			return this.constructor.name.replace(/command$/gi, '')
		}

		return this.name
	}

	abstract async handle(args: Argument[], options: Option[]): Promise<void>
}
