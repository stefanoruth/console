import { Command, Terminal } from 'kodo-console'

export class TextCommand extends Command {
	name = 'test:text'

	async handle() {
		// this.output.success('Success')
		// this.output.error('Error')
		// this.output.warning('Warning')
		// this.output.note('Note')
		// this.output.caution('Caution')

		const t = new Terminal()

		console.log('User:', await t.question('hi?'))
	}
}
