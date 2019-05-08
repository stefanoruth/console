import { Command } from '../Command/Command'

export class ListCommand extends Command {
	name = 'list'

	async handle() {
		const app = this.getApplication()
		const commands = app.getCommands()

		this.output.writeln(`${app.name} ${app.version}`)
		this.output.newLine()

		this.output.note('Usage:')
		this.output.line('  command [options] [arguments]')
		this.output.newLine()

		this.output.note('Options:')
		this.output.writeln(['  help', '  v'])
		this.output.newLine()

		this.output.note('Available commands:')

		commands.forEach(command => {
			this.output.success('  ' + command.getName())
		})

		this.output.newLine()
	}
}
