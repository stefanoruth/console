import { Command } from '../Command/Command'
import { Descriptor } from '../Output/Descriptor'

export class ListCommand extends Command {
	name = 'list'
	description = 'Lists commands'

	async handle() {
		console.clear()
		new Descriptor().describe(this.output, this.getApplication())
	}
}
