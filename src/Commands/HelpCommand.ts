import { Command } from '../Command/Command'
import { Terminal } from '../Terminal'

export class HelpCommand extends Command {
	name = 'help'
	description = 'Displays help for a command'

	async handle() {
		console.log(this.input)
		// const t = new Terminal()

		// console.log('stdin', process.stdin)
		// console.log('stout', process.stdout)

		// console.log(t)
		// console.log('Terminal size: ' + t.getWidth() + 'x' + t.getHeight())
	}
}
