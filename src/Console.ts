import { Command } from './Command'
import { Input } from './Input'
import { Output } from './Output'
import { Schedule } from './Schedule'

type ExitCode = 0 | 1

export class Console {
	protected commands: { [key: string]: Command } = {}
	protected defaultCommand: string = 'list'
	protected singleCommand: boolean = false
	protected input: Input
	protected output: Output
	protected projectName?: string
	protected version?: string
	protected help?: string

	/**
	 * Build Console Application.
	 */
	constructor(projectName?: string, version?: string) {
		this.projectName = projectName
		this.version = version
		this.input = new Input()
		this.output = new Output()
	}

	/**
	 * Register a new Command.
	 */
	register(...commands: Command[]): this {
		commands.forEach((command: Command) => {
			this.commands[command.name] = command
		})

		return this
	}
	/**
	 * Run the Commands.
	 */
	run() {
		return new Promise(async (resolve, reject) => {
			await this.doRun()
		})
			.then(() => {
				process.exit(0)
			})
			.catch((err: Error) => {
				console.log(err)
				process.exit(1)
			})
	}

	schedule(callback: (schedule: Schedule) => void) {
		callback(new Schedule())
	}

	async doRun() {
		if (args[0] && this.commands[args[0]]) {
			const command = this.commands[args[0]]

			await command.setApplication(this).handle()
		}
	}

	/**
	 * Gets the name of the command based on input.
	 */
	protected getCommandName(input: any): string {
		return this.singleCommand ? this.defaultCommand : input.getFirstArgument()
	}
}
