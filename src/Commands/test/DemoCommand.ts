import { Command } from '../Command'
import { Signature, Argument, Option } from '../../Input'

function sleep(time: any) {
	const stop = new Date().getTime()
	while (new Date().getTime() < stop + time) {
		//
	}
}

export class DemoCommand extends Command {
	name = 'demo:test'
	description = 'Display an inspiring quote'
	signature = new Signature([new Argument('demo'), new Option('epic')])

	async handle() {
		console.log(this)

		this.output.success('Success')
		this.output.error('Error')
		this.output.warning('Warning')
		this.output.note('Note')
		this.output.caution('Caution')

		const progress = this.output.progressBar(10)

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		progress.finish()

		// console.log(await this.output.confirm('Are you okay?'))

		console.log('Quote')
	}
}
