import { Command } from './Commands'
import { Input, Signature, Option, Argument } from './Input'
import { CommandNotFoundException } from './Exceptions'
import { Output, ErrorHandler, Terminal } from './Output'
import { Registry } from './Commands/Registry'
import {
	EventDispatcher,
	ApplicationStarting,
	CommandStarting,
	CommandFinished,
	EventListener,
	EventTypes,
} from './Events'
import { Verbosity } from './Output/Verbosity'

export type Bootstrap = (application: Application) => void

export class Application {
	protected runningCommand: Command | null = null
	protected catchExceptions: boolean = true
	protected autoExit: boolean = true
	protected events: EventDispatcher = new EventDispatcher()
	protected static bootstrappers: Bootstrap[] = []
	protected commandRegistry: Registry = new Registry(this)

	/**
	 * Build Console Application.
	 */
	constructor(protected name?: string, protected version?: string) {
		this.bootstrap()
		this.events.dispatch(new ApplicationStarting())
	}

	/**
	 * Register a new Command.
	 */
	register(commands: Command[]): this {
		commands.forEach((command: Command) => {
			this.commandRegistry.addCommand(command)
		})

		return this
	}

	/**
	 * Fetches a list of commands that are registered
	 */
	getCommands(): Command[] {
		return this.commandRegistry.getCommands()
	}

	/**
	 * Run the Commands.
	 */
	async run(input?: Input, output?: Output, terminal?: Terminal): Promise<number> {
		let exitCode: number = 0

		if (!terminal) {
			terminal = new Terminal()
		}

		if (!input) {
			input = new Input()
		}

		if (!output) {
			output = new Output(terminal)
		}

		const commandName: string = this.commandRegistry.getCommandName(input)

		this.events.dispatch(new CommandStarting(commandName, input, output))

		this.configureIO(input, output)

		try {
			exitCode = await this.doRun(input, output)
		} catch (error) {
			if (!this.catchExceptions) {
				throw error
			}

			new ErrorHandler(output).render(error)

			exitCode = 1 // error.getCode()
		}

		this.events.dispatch(new CommandFinished(commandName, input, output, exitCode))

		if (this.autoExit) {
			terminal.exit(exitCode)
		}

		return exitCode
	}

	/**
	 * Runs the current application.
	 * int 0 if everything went fine, or an error code
	 */
	protected async doRun(input: Input, output: Output): Promise<number> {
		let command: Command
		if (true === input.hasParameterOption(['--version', '-V'], true)) {
			output.success(this.getHelp())
			return 0
		}

		try {
			// Makes input.getFirstArgument() able to distinguish an option from an argument.
			input.bind(this.getSignature())
		} catch (e) {
			// Errors must be ignored, full binding/validation happens later when the command is known.
		}

		const name = this.commandRegistry.getCommandName(input)

		try {
			this.runningCommand = null

			command = this.commandRegistry.find(name)
		} catch (error) {
			// if (!(error instanceof CommandNotFoundException)) {
			// 	throw error
			// }

			new ErrorHandler(output).render(error)

			// Find alternatives

			return 1
		}

		this.runningCommand = command
		const exitCode = await this.doRunCommand(command, input, output)
		this.runningCommand = null

		return exitCode
	}

	/**
	 * Finds a command by name or alias.
	 *
	 * Contrary to get, this command tries to find the best
	 * match if you give it an abbreviation of a name or alias.
	 */
	find(name: string): Command {
		return this.commandRegistry.find(name)
	}

	/**
	 * Gets the help message.
	 */
	getHelp(): string {
		const name = this.getName()
		if (name) {
			const version = this.getVersion()

			if (version) {
				return `${name} ${version}`
			}
			return name
		}
		return 'Console Tool'
	}

	/**
	 * Configures the input and output instances based on the user arguments and options.
	 */
	protected configureIO(input: Input, output: Output) {
		// Verbosity
		if (input.hasParameterOption(['--quiet', '-q'], true)) {
			output.setVerbosity(Verbosity.quiet)
		} else if (
			input.hasParameterOption(['-vvv', '--verbose=3'], true) ||
			'3' === input.getParameterOption('--verbose', false, true)
		) {
			output.setVerbosity(Verbosity.debug)
		} else if (
			input.hasParameterOption(['-vv', '--verbose=2'], true) ||
			'2' === input.getParameterOption('--verbose', false, true)
		) {
			output.setVerbosity(Verbosity.veryVerbose)
		} else if (input.hasParameterOption(['-v', '--verbose=1', '--verbose'], true)) {
			output.setVerbosity(Verbosity.verbose)
		}

		// Interaction
		if (true === input.hasParameterOption(['--no-interaction', '-n'], true)) {
			input.setInteractive(false)
		}

		// Ansi
		if (true === input.hasParameterOption(['--ansi'], true)) {
			// output.setDecorated(true)
		} else if (true === input.hasParameterOption(['--no-ansi'], true)) {
			// output.setDecorated(false);
		}
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
			new ErrorHandler(output).render(error)
			return 1
		}

		return 0
	}

	/**
	 * Sets whether to automatically exit after a command execution or not.
	 */
	setAutoExit(bool: boolean) {
		this.autoExit = bool
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
	 * Register a console "starting" bootstrapper.
	 */
	static starting(callback: (application: Application) => void) {
		this.bootstrappers.push(callback)
	}

	/**
	 * Bootstrap the console application.
	 */
	protected bootstrap() {
		Application.bootstrappers.forEach(bootstrapper => {
			bootstrapper(this)
		})
	}

	/**
	 * Gets the Signature related to this Application.
	 */
	getSignature() {
		return new Signature([
			new Argument('command', undefined, 'The command to execute'),
			new Option('--help', '-h', undefined, 'Display this help message'),
			new Option('--quiet', '-q', undefined, 'Do not output any message'),
			new Option('--version', '-V', undefined, 'Display this application version'),
			new Option(
				'--verbose',
				'-v|vv|vvv',
				undefined,
				'Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug'
			),
			// new Option('--ansi', '', undefined, 'Force ANSI output'),
			// new Option('--no-ansi', '', undefined, 'Disable ANSI output'),
			new Option('--no-interaction', '-n', undefined, 'Do not ask any interactive question'),
		])
	}

	/**
	 * Listen for a specific event.
	 */
	listen(event: EventTypes, listener: EventListener) {
		this.events.addListener(event, listener)

		return this
	}
}
