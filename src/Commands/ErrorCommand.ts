import { Command } from './Command'

export class ErrorCommand extends Command {
	name = 'show:error'

	async handle() {
		throw new Error('My Error is shown')
	}
}
