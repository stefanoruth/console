import { Command } from '../Command/Command'

export class ListCommand extends Command {
	name = 'list'

	async handle() {
		throw new Error('der')
		console.log('list')
	}
}
