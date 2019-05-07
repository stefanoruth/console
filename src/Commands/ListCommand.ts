import { Command } from '../Command/Command'

export class ListCommand extends Command {
	name = 'list'

	async handle() {
		const commands = this.getApplication().getCommands()

		this.output.writeln(this.getApplication().name + ' ' + this.getApplication().version)
		this.output.newLine()

		this.output.note('Usage:')
		this.output.line('  command [options] [arguments]')
		this.output.newLine()

		this.output.note('Options:')
		this.output.newLine()

		this.output.note('Available commands:')

		commands.forEach(command => {
			this.output.success(command.getName())
		})

		this.output.newLine()
	}
}
