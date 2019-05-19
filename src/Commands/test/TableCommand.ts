import { Command } from '../Command'

export class TableCommand extends Command {
	name = 'test:table'

	async handle() {
		throw new Error('My Error is shown')
	}
}
