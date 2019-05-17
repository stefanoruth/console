import { Command } from './Command/Command'
import { Input } from './Input/Input'
import { Output } from './Output/Output'
import { HelpCommand } from './Commands/HelpCommand'
import { ListCommand } from './Commands/ListCommand'
import { CommandNotFoundException } from './Exceptions'
import { Signature } from './Input/Signature'
import { Option } from './Input/Option'
import { Argument } from './Input/Argument'
import { InspireCommand } from './Commands/InspireCommand'

export class Application {
	protected commands: { [key: string]: Command } = {}
	protected runningCommand: Command | null = null
	protected catchExceptions: boolean = true
	protected autoExit: boolean = true
	protected defaultCommand: string = 'list'
	protected singleCommand: boolean = false
	protected help?: string
	protected initialized: boolean = false

	/**
	 * Build Console Application.
	 */
	constructor(protected name?: string, protected version?: string) {}

	/**
	 * Register a new Command.
	 */
	register(commands: Command[]): this {
		commands.forEach((command: Command) => {
			this.addCommand(command)
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
			// this.render
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

	async doRun(input: Input, output: Output): Promise<number> {
		let command: Command | null = null

		// if (true === input.hasParameterOption(['--version', '-V'], true)) {
		//     $output -> writeln($this -> getLongVersion());
		//     return 0;
		// }

		let name: string | undefined = input.getFirstArgument()

		if (typeof name === 'undefined') {
			name = this.defaultCommand
		}

		try {
			this.runningCommand = null

			command = this.find(name)
		} catch (error) {
			console.log(error)
		}

		this.runningCommand = command
		const exitCode = await this.doRunCommand(command!, input, output)
		this.runningCommand = null

		return exitCode
	}

	/**
	 * Gets the help message.
	 */
	getHelp() {
		if (this.getName()) {
			if (this.getVersion()) {
				return `${this.getName()} ${this.getVersion()}`
			}
			return this.getName()
		}
		return 'Console Tool'
	}

	/**
	 * Finds a command by name or alias.
	 *
	 * Contrary to get, this command tries to find the best
	 * match if you give it an abbreviation of a name or alias.
	 */
	find(name: string): Command {
		this.init()

		if (typeof this.commands[name] === 'undefined') {
			throw new CommandNotFoundException(name)
		}

		const command = this.commands[name]

		return command
	}

	/**
	 * Runs the current command.
	 *
	 * If an event dispatcher has been attached to the application,
	 * events are also dispatched during the life-cycle of the command.
	 */
	protected async doRunCommand(command: Command, input: Input, output: Output) {
		try {
			await command.execute(input, output)
		} catch (error) {
			console.error(error)
			return 1
		}

		return 0
	}

	/**
	 * Renders a caught exception.
	 */
	renderException(e: Error, output: Output) {
		// output.writeln('', Output.VERBOSITY_QUIET)

		// this.doRenderException(e, output)

		if (this.runningCommand) {
			// output.writeln(`<info>${this.runningCommand.getSynopsis() + this.getName()}</info>`, Output.VERBOSITY_QUIET)
			// output.writeln('', Output.VERBOSITY_QUIET)
		}
	}

	/**
	 * Gets the name of the application.
	 */
	getName() {
		return this.name
	}

	/**
	 * Gets the version of the application.
	 */
	getVersion() {
		return this.version
	}

	/**
	 * Adds a command object.
	 *
	 * If a command with the same name already exists, it will be overridden.
	 * If the command is not enabled it will not be added.
	 */
	addCommand(command: Command) {
		command.setApplication(this)

		this.commands[command.getName()] = command

		return command
	}

	/**
	 * Gets the default commands that should always be available.
	 */
	protected getDefaultCommands() {
		return [new HelpCommand(), new ListCommand(), new InspireCommand()]
	}

	/**
	 * Fetches a list of commands that are registered
	 */
	getCommands(): Command[] {
		return Object.values(this.commands)
	}

	/**
	 * Add base commands to the list of commands.
	 */
	protected init() {
		if (this.initialized) {
			return
		}

		this.initialized = true

		this.register(this.getDefaultCommands())
	}

	/**
	 * Gets the Signature related to this Application.
	 */
	getSignature() {
		return new Signature([
			new Argument('command', 'The command to execute'),
			new Option('--help', '-h', 'Display this help message'),
			new Option('--quiet', '-q', 'Do not output any message'),
			new Option(
				'--verbose',
				'-v|vv|vvv',
				'Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug'
			),
			new Option('--version', '-V', 'Display this application version'),
			new Option('--ansi', '', 'Force ANSI output'),
			new Option('--no-ansi', '', 'Disable ANSI output'),
			new Option('--no-interaction', '-n', 'Do not ask any interactive question'),
		])
	}
}
