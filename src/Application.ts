import { Command, HelpCommand, ListCommand, InspireCommand } from './Commands'
import { Input, Signature, Option, Argument } from './Input'
import { CommandNotFoundException } from './Exceptions'
import { Output, ErrorHandler } from './Output'
import {
	EventDispatcher,
	ApplicationStarting,
	CommandStarting,
	CommandFinished,
	EventListener,
	EventTypes,
} from './Events'

export type Bootstrap = (application: Application) => void

export class Application {
	protected commands: { [key: string]: Command } = {}
	protected wantHelps: boolean = false
	protected runningCommand: Command | null = null
	protected catchExceptions: boolean = true
	protected autoExit: boolean = true
	protected defaultCommand: string = 'list'
	protected singleCommand: boolean = false
	protected help?: string
	protected initialized: boolean = false
	protected events: EventDispatcher = new EventDispatcher()
	protected static bootstrappers: Bootstrap[] = []

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

		const commandName: string | undefined = this.getCommandName(input)

		this.events.dispatch(new CommandStarting(commandName, input, output))

		try {
			exitCode = await this.doRun(input, output)
		} catch (error) {
			if (!this.catchExceptions) {
				throw error
			}

			this.renderException(error, output)

			exitCode = 1 // error.getCode()
		}

		this.events.dispatch(new CommandFinished(commandName, input, output, exitCode))

		if (this.autoExit) {
			process.exit(exitCode)
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

		let name: string | undefined = this.getCommandName(input)

		if (true === input.hasParameterOption(['--help', '-h'], true)) {
			this.wantHelps = true
		}

		if (typeof name === 'undefined') {
			name = this.defaultCommand
		}

		try {
			this.runningCommand = null

			command = this.find(name)
		} catch (error) {
			if (!(error instanceof CommandNotFoundException)) {
				throw error
			}

			console.error(error)

			// Find alternatives

			return 1
		}

		this.runningCommand = command
		const exitCode = await this.doRunCommand(command, input, output)
		this.runningCommand = null

		return exitCode
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
	 * Returns a registered command by name or alias.
	 */
	protected get(name: string): Command {
		this.init()

		if (!this.has(name)) {
			throw new CommandNotFoundException(`The command "${name}" does not exist.`)
		}

		const command = this.commands[name]

		if (this.wantHelps) {
			this.wantHelps = false
			const helpCommand: HelpCommand = this.get('help') as any
			helpCommand.setCommand(command)
			return helpCommand
		}

		return command
	}

	/**
	 * Returns true if the command exists, false otherwise.
	 */
	protected has(name: string) {
		this.init()

		if (typeof this.commands[name] !== 'undefined') {
			return true
		}

		// ($this -> commandLoader && $this -> commandLoader -> has($name) && $this -> add($this -> commandLoader -> get($name))
		// if () {
		//     return true
		// }

		return false
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

		if (this.has(name)) {
			return this.get(name)
		}

		throw new Error('Not yet implmeneted this part.')
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
	 * Renders a caught exception.
	 */
	renderException(e: Error, output: Output) {
		output.newLine()

		new ErrorHandler(output).render(e)

		if (this.runningCommand !== null) {
			output.line(this.runningCommand.getSynopsis() + this.getName())
			output.newLine()
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
	 * Gets the name of the command based on input.
	 */
	protected getCommandName(input: Input): string | undefined {
		return this.singleCommand ? this.defaultCommand : input.getFirstArgument()
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
			// new Option(
			// 	'--verbose',
			// 	'-v|vv|vvv',
			// 	undefined,
			// 	'Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug'
			// ),
			// new Option('--ansi', '', undefined, 'Force ANSI output'),
			// new Option('--no-ansi', '', undefined, 'Disable ANSI output'),
			// new Option('--no-interaction', '-n', undefined, 'Do not ask any interactive question'),
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
