import { Output } from '../Output'
import { Console as Application } from '../Console'
// import { Arguments } from 'yargs'

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

	/**
	 * Get the path to the migration directory.
	 */
	protected getMigrationPath(): string {
		return './migrations'
	}

	call(commandName: string, options: {} = {}) {
		//
	}

	getApplication() {
		return this.application
	}

	setApplication(application?: Application): Command {
		this.application = application

		return this
	}

	abstract handle(): void
}
