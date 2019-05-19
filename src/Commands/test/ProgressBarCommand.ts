import { Command } from '../Command'

function sleep(time: any) {
	const stop = new Date().getTime()
	while (new Date().getTime() < stop + time) {
		//
	}
}

export class ProgressBarCommand extends Command {
	name = 'test:progressbar'

	async handle() {
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
	}
}
