import { Command } from '../Command/Command'

export class HelpCommand extends Command {
	name = 'help'

	async handle() {
		console.log('help')
	}
}
