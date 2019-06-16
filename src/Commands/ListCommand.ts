import { Command } from './Command'
import { Descriptor } from '../Output/Descriptor'

export class ListCommand extends Command {
	protected name = 'list'
	protected description = 'Lists commands'

	/**
	 * Inject this so it simpler to test.
	 */
	constructor(protected descriptor: Descriptor = new Descriptor()) {
		super()
	}

	/**
	 * Descripe the application it self.
	 */
	async handle() {
		this.descriptor.describe(this.output, this.getApplication())
	}
}
