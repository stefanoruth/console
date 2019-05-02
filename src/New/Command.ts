import { Output } from '../Output'
import { Application } from '../Application'

export interface CommandInterface {
	name: string
	call(commandName: string, options: {}): void
}

export type CommandBuilder = new () => Command

export abstract class Command<Arguments = {}, Options = {}> implements CommandInterface {
	abstract name: string
	protected application?: Application
	protected output: Output

	/**
	 * Build Command
	 */
	constructor(output: Output = new Output()) {
		this.output = output
	}

	call(commandName: string, options: {} = {}) {
		//
	}

	getApplication(): Application {
		if (!this.application) {
			throw new Error('Application has not been set')
		}

		return this.application
	}

	setApplication(application?: Application): Command {
		this.application = application

		return this
	}

	abstract handle(): void
}
