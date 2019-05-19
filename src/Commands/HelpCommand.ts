import { Command } from './Command'
import { Terminal } from '../Terminal'
import { Descriptor } from '../Output/Descriptor'

export class HelpCommand extends Command {
	name = 'help'
	description = 'Displays help for a command'
	protected command: Command | null = null

	async handle() {
		if (this.command === null) {
			// this.command = this.getApplication().find(this.input.getArgument('command_name'))
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
