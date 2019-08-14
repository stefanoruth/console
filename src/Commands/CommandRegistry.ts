import { Application } from '../Application'
import { CommandNotFoundException, InvalidArgumentException } from '../Exceptions'
import { Input } from '../Input'
import { Command } from './Command'
import { HelpCommand } from './HelpCommand'
import { ListCommand } from './ListCommand'
import { InspireCommand } from './InspireCommand'

export class CommandRegistry {
	protected commands: { [key: string]: Command } = {}
	protected wantHelps: boolean = false
	protected defaultCommand: string = 'list'
	protected singleCommand: boolean = false

	/**
	 * Initialize the command registry.
	 */
	constructor(protected application: Application, defaultCommands?: Command[]) {
		if (typeof defaultCommands === 'undefined') {
			defaultCommands = [new HelpCommand(), new ListCommand(), new InspireCommand()]
		}

		defaultCommands.forEach(command => {
			this.addCommand(command)
		})
	}

	/**
	 * Adds a command object.
	 *
	 * If a command with the same name already exists, it will be overridden.
	 * If the command is not enabled it will not be added.
	 */
	addCommand(command: Command) {
		this.validateName(command.getName())

		command.setApplication(this.application)

		this.commands[command.getName()] = command

		return command
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
		if (!this.has(name)) {
			throw new CommandNotFoundException(`Command "${name}" is not defined.`)
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
		if (typeof this.commands[name] !== 'undefined') {
			return true
		}

		return false
	}

	/**
	 * Finds a command by name or alias.
	 *
	 * Contrary to get, this command tries to find the best
	 * match if you give it an abbreviation of a name or alias.
	 */
	find(name: string): Command {
		if (!this.has(name)) {
			throw new CommandNotFoundException(`Command "${name}" is not defined.`)
		}

		return this.get(name)
	}

	/**
	 * Gets the name of the command based on input.
	 */
	getCommandName(input: Input): string {
		let name = input.getFirstArgument()

		if (true === input.hasParameterOption(['--help', '-h'], true)) {
			this.wantHelps = true
		}

		if (typeof name === 'undefined') {
			name = this.defaultCommand
		}

		return name
	}

	/**
	 * Validate a command name
	 */
	protected validateName(name: string) {
		if (!/^[^\:]+(\:[^\:]+)*$/gi.test(name)) {
			throw new InvalidArgumentException(`Command name "${name}" is invalid.`)
		}
	}
}
