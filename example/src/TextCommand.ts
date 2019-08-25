import { Command } from 'valon'

export class TextCommand extends Command {
	name = 'example:text'

	async handle() {
		this.output.success('Success')
		this.output.error('Error')
		this.output.warning('Warning')
		this.output.note('Note')
		this.output.caution('Caution')
	}
}
