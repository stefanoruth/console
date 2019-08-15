import { Command, CommandRegistry, CommandLoader } from './Commands'
import { Input, Signature, Option, Argument } from './Input'
import { Output, ErrorHandler, Terminal, Verbosity } from './Output'
import { CommandNotFoundException } from './Exceptions'
import {
	EventDispatcher,
	ApplicationStarting,
	CommandStarting,
	CommandFinished,
	EventListener,
	EventName,
} from './Events'
const packageJson: { name: string; version: string } = require('../package.json')

export type Bootstrap = (application: Application) => void

export class Application {
	protected autoExit: boolean = true
	protected events: EventDispatcher = new EventDispatcher()
	protected static bootstrappers: Bootstrap[] = []
	protected commandRegistry: CommandRegistry = new CommandRegistry(this)
	protected commandLoader: CommandLoader = new CommandLoader()
	protected initialized: boolean = false
	protected autoloadCommandsFrom: string[] = []

	/**
	 * Build Console Application.
	 */
	constructor(protected appInfo?: { name: string; version: string }) {
		this.bootstrap()
		this.events.dispatch(new ApplicationStarting())
	}

	/**
	 * Register a new Command.
	 */
	register(commands: Command[]): this {
		this.commandRegistry.registerCommands(commands)

		return this
	}

	/**
	 * Load a set of commands from a directory.
	 */
	loadDirectory(...dirs: string[]) {
		this.autoloadCommandsFrom.push(...dirs)

		return this
	}

	/**
	 * Autoload commands from custom directories.
	 */
	async autoLoadCommands() {
		for (const dir of this.autoloadCommandsFrom) {
			this.commandRegistry.registerCommands(await this.commandLoader.load(dir))
		}
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
	async run(input?: Input, output?: Output): Promise<number> {
		let exitCode: number = 0

		if (!input) {
			/* istanbul ignore next */
			input = new Input()
		}

		if (!output) {
			/* istanbul ignore next */
			output = new Output(new Terminal())
		}

		const errorHandler = new ErrorHandler(output)

		this.configureIO(input, output)

		try {
			exitCode = await this.doRun(input, output, errorHandler)
		} catch (error) {
			errorHandler.report(error)

			exitCode = 1
		}

		if (this.autoExit) {
			output.getTerminal().exit(exitCode)
		}

		return exitCode
	}

	/**
	 * Runs the current application.
	 * int 0 if everything went fine, or an error code
	 */
	protected async doRun(input: Input, output: Output, errorHandler: ErrorHandler): Promise<number> {
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

		// User set custom dir from CLI.
		if (input.hasParameterOption(['--command-dir'], true)) {
			this.loadDirectory(input.getParameterOption(['--command-dir'])!)
		}

		// Autoload commands from directories.
		await this.autoLoadCommands()

		const name = this.commandRegistry.getCommandName(input)

		try {
			command = this.commandRegistry.find(name)
		} catch (error) {
			if (!(error instanceof CommandNotFoundException)) {
				throw error
			}

			errorHandler.report(error)

			// Find alternatives

			return 1
		}

		this.events.dispatch(new CommandStarting(command.getName(), input, output))

		const exitCode = await this.doRunCommand(command, input, output, errorHandler)

		this.events.dispatch(new CommandFinished(command.getName(), input, output, exitCode))

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
		return `${this.getName()} ${this.getVersion()}`
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
	protected async doRunCommand(command: Command, input: Input, output: Output, errorHandler: ErrorHandler) {
		// bind before the console.command event, so the listeners have access to input options/arguments
		try {
			command.getSignature().addOptions(this.getSignature().getOptions())

			const currentArguments = command.getSignature().getArguments()
			command.getSignature().setArguments(this.getSignature().getArguments())
			command.getSignature().addArguments(currentArguments)

			input.bind(command.getSignature())
		} catch (error) {
			// ignore invalid options/arguments for now, to allow the event listeners to customize the InputDefinition
		}

		// Execute console command.
		try {
			await command.execute(input, output)
		} catch (error) {
			// Error happened in execution.
			errorHandler.report(error)

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
	getName(): string {
		if (this.appInfo) {
			return this.appInfo.name
		}

		return packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1)
	}

	/**
	 * Gets the version of the application.
	 */
	getVersion(): string {
		if (this.appInfo) {
			return this.appInfo.version
		}

		return packageJson.version
	}

	/**
	 * Register a console "starting" bootstrapper.
	 */
	static starting(callback: Bootstrap) {
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
			new Option('--command-dir', undefined, undefined, 'Load commands dynamically from folder'),
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
	listen(event: EventName, listener: EventListener) {
		this.events.addListener(event, listener)

		return this
	}
}
