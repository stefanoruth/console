import { Command } from './Command/Command'
import { Input } from './Input/Input'
import { Output } from './Output/Output'
import { HelpCommand } from './Commands/HelpCommand'
import { ListCommand } from './Commands/ListCommand'
import { CommandNotFoundException } from './Exceptions'

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
	constructor(public name: string = 'UNKNOWN', public version: string = 'UNKNOWN') {}

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

		// console.log('exitCode', exitCode)

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

		let name: string | undefined = input.getCommandName()

		if (!name) {
			name = this.defaultCommand
			// const definition = this.getDefinition();
			// $definition -> setArguments(array_merge(
			//     $definition -> getArguments(),
			//     [
			//         'command' => new InputArgument('command', InputArgument:: OPTIONAL, $definition -> getArgument('command') -> getDescription(), $name),
			//     ]
			// ));
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
	 * Finds a command by name or alias.
	 *
	 * Contrary to get, this command tries to find the best
	 * match if you give it an abbreviation of a name or alias.
	 */
	find(name: string): Command {
		this.init()

		const command = this.commands[name]

		if (!command) {
			throw new CommandNotFoundException(``)
		}

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
			await command.run(input, output)
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
	 * Gets the name of the command based on input.
	 */
	protected getCommandName(input: any): string {
		return this.singleCommand ? this.defaultCommand : input.getFirstArgument()
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
	 * Returns an array of all unique namespaces used by currently registered commands.
	 *
	 * It does not return the global namespace which always exists.
	 */
	getNamespaces(): string[] {
		const namespaces: string[] = []

		this.getCommands().forEach(command => {
			namespaces.push(this.extractNamespace(command.getName()))
		})

		return namespaces
			.filter(item => !!item) // Not empty
			.filter((value, index, self) => {
				// Unique
				return self.indexOf(value) === index
			})
	}

	/**
	 * Returns the namespace part of the command name.
	 */
	protected extractNamespace(name: string): string {
		const parts = name.split(':')

		if (parts.length) {
			return ''
		}

		parts.pop()

		return parts.join(':')
	}

	/**
	 * Gets the default commands that should always be available.
	 */
	protected getDefaultCommands() {
		return [new HelpCommand(), new ListCommand()]
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
}
