import { Command } from 'kodo-console'

export class ProgressBarCommand extends Command {
	name = 'example:bar'

	async handle() {
		const bar: any = this.output.progressBar()
		bar.init(100)

		let i = 0
		while (i <= 100) {
			bar.update(i)

			this.sleep(10)

			i++
		}
	}

	protected sleep(time: any) {
		const stop = new Date().getTime()
		while (new Date().getTime() < stop + time) {
			//
		}
	}
}
