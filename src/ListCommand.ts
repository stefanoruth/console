import { Command } from './Command'

interface Args {
	commandName: string
}

interface Options {
	version: string
	force: boolean
}

export class ListCommand extends Command<Args, Options> {
	name = 'list'

	handle() {
		console.log('listing')
	}
}
