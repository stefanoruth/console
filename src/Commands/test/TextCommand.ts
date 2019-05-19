import { Command } from '../Command'

export class TextCommand extends Command {
	name = 'test:text'

	async handle() {
		throw new Error('My Error is shown')
	}
}
