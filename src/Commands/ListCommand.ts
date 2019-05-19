import { Command } from './Command'
import { Descriptor } from '../Output/Descriptor'

export class ListCommand extends Command {
	protected name = 'list'
	protected description = 'Lists commands'

	async handle() {
		console.clear()
		new Descriptor().describe(this.output, this.getApplication())
	}
}
