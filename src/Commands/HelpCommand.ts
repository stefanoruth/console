import { Command } from '../Command/Command'
import { Terminal } from '../Terminal'

export class HelpCommand extends Command {
	name = 'help'

	async handle() {
		const t = new Terminal()

		console.log('stdin', process.stdin)
		console.log('stout', process.stdout)

		console.log(t)
		console.log('Terminal size: ' + t.getWidth() + 'x' + t.getHeight())
	}
}
