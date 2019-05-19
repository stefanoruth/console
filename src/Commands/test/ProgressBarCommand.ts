import { Command } from '../Command'

export class ProgressBarCommand extends Command {
	name = 'test:progressbar'

	async handle() {
		throw new Error('My Error is shown')
	}
}
