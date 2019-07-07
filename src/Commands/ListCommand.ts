import { Command } from './Command'
import { Descriptor } from '../Output/Descriptor'

export class ListCommand extends Command {
	protected name = 'list'
	protected description = 'Lists commands'

	/**
	 * Descripe the application it self.
	 */
	async handle() {
		new Descriptor(this.output).describe(this.getApplication())
	}
}
