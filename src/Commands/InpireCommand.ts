import { Command } from '../Command/Command'

export class InspireCommand extends Command {
	name = 'inspire'

	async handle() {
		console.log('Quote')
	}
}
