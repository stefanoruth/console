import { Command, HelpCommand, ListCommand, InspireCommand } from './Commands'
import { Application } from './Application'
import { CommandNotFoundException } from './Exceptions'
import { Input } from './Input'

export class CommandRegistry {
	protected commands: { [key: string]: Command } = {}
	protected wantHelps: boolean = false
	protected defaultCommand: string = 'list'
	protected singleCommand: boolean = false
	protected initialized: boolean = false

	/**
	 * Initialize the command registry.
	 */
	constructor(protected application: Application) {}

	/**
	 * Adds a command object.
	 *
	 * If a command with the same name already exists, it will be overridden.
	 * If the command is not enabled it will not be added.
	 */
	addCommand(command: Command) {
		command.setApplication(this.application)

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
	 * Add base commands to the list of commands.
	 */
	protected init() {
		if (this.initialized) {
			return
		}

		this.initialized = true

		this.getDefaultCommands().forEach(command => {
			this.addCommand(command)
		})
	}

	/**
	 * Gets the name of the command based on input.
	 */
	getCommandName(input: Input): string {
		let name = this.singleCommand ? this.defaultCommand : input.getFirstArgument()

		if (true === input.hasParameterOption(['--help', '-h'], true)) {
			this.wantHelps = true
		}

		if (typeof name === 'undefined') {
			name = this.defaultCommand
		}

		return name
	}
}
