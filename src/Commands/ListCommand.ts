import { Command } from '../Command/Command'

export class ListCommand extends Command {
	name = 'list'

	async handle() {
		this.output.writeln('## Commands ##')
		// throw new Error('der')

		const commands = this.getApplication().getCommands()

		commands.forEach(command => {
			this.output.writeln(command.getName())
		})
	}
}
