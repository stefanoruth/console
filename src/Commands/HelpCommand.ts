import { Command } from './Command'
import { Descriptor } from '../Output/Descriptor'
import { Signature, Argument, ArgumentMode } from '../Input'

export class HelpCommand extends Command {
	protected name = 'help'
	protected description = 'Displays help for a command'
	protected command: Command | null = null
	protected signature = new Signature([new Argument('command_name', 'The command name', 'help', ArgumentMode.optional)])

	async handle() {
		if (this.command === null) {
			this.command = this.getApplication().find(this.input.getArgument('command_name'))
			return
		}

		const helper = new Descriptor()
		helper.describe(this.output, this.command)
		this.command = null
	}

	/**
	 * Set command to show help for.
	 */
	setCommand(command: Command) {
		this.command = command
	}
}
