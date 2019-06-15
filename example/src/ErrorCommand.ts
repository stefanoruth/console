import { Command } from 'kodo-console'

export class ErrorCommand extends Command {
	name = 'test:error'

	async handle() {
		throw new Error('My Error is shown')
	}
}
