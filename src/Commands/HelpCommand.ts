import { Command } from './Command'
import { Descriptor } from '../Output'
import { Argument, ArgumentMode } from '../Input'

export class HelpCommand extends Command {
	protected name = 'help'
	protected description = 'Displays help for a command'
	protected command: Command | null = null
	protected signature = [new Argument('command_name', ArgumentMode.optional, 'The command name', 'help')]

	/**
	 * Help users learn more about the current command.
	 */
	async handle() {
		const descriptor = new Descriptor(this.output)

		if (this.command === null) {
			this.command = this.getApplication().find(this.input.raw().getArgument('command_name'))
		}

		descriptor.describe(this.command)
	}

	/**
	 * Set command to show help for.
	 */
	setCommand(command: Command) {
		this.command = command
	}
}
