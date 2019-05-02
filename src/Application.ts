import { Command } from './Command'
import { Input } from './Input/Input'
import { OutputStyle } from './Output/OutputStyle'
import { Output } from './Output/Output'

export class Application {
	protected commands: { [key: string]: Command } = {}
	protected runningCommand?: Command
	protected catchExceptions: boolean = true
	protected autoExit: boolean = true
	protected defaultCommand: string = 'list'
	protected singleCommand: boolean = false
	protected help?: string

	/**
	 * Build Console Application.
	 */
	constructor(protected name: string = 'UNKNOWN', protected version: string = 'UNKNOWN') {}

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
	async run(input?: Input, output?: Output) {
		let exitCode: number = 0

		if (!input) {
			input = new Input()
		}

		if (!output) {
			output = new Output()
		}

		const renderException = (e: Error) => {
			this.render
		}

		try {
			exitCode = await this.doRun(input, output)
		} catch (error) {
			if (!this.catchExceptions) {
				throw error
			}

			renderException(error)

			exitCode = error.getCode()
		}

		if (this.autoExit) {
			process.exit(exitCode)
		}

		return exitCode
	}

	async doRun(input: Input, output: Output): Promise<number> {}

	/**
	 * Renders a caught exception.
	 */
	renderException(e: Error, output: Output) {
		output.writeln('', Output.VERBOSITY_QUIET)

		// this.doRenderException(e, output)

		if (this.runningCommand) {
			output.writeln(`<info>${this.runningCommand.getSynopsis() + this.getName()}</info>`, Output.VERBOSITY_QUIET)
			output.writeln('', Output.VERBOSITY_QUIET)
		}
	}

	/**
	 * Gets the name of the application.
	 */
	getName() {
		return this.name
	}

	/**
	 * Gets the name of the command based on input.
	 */
	protected getCommandName(input: any): string {
		return this.singleCommand ? this.defaultCommand : input.getFirstArgument()
	}
}
