import { Command } from '../Command'
import { WriteStream } from 'tty'
import { Writable } from 'stream'
import readline from 'readline'

function sleep(time: any) {
	const stop = new Date().getTime()
	while (new Date().getTime() < stop + time) {
		//
	}
}

class ProgressBar {
	total: number = 100
	current: number = 0
	bar_length: number
	constructor() {
		this.bar_length = process!.stdout!.columns! - 30
	}

	init(total: number) {
		this.total = total
		this.current = 0
		this.update(this.current)
	}

	update(current: number) {
		this.current = current
		const current_progress = this.current / this.total
		this.draw(current_progress)
	}

	draw(current_progress: number) {
		const filled_bar_length = Number((current_progress * this.bar_length).toFixed(0))
		const empty_bar_length = this.bar_length - filled_bar_length

		const filled_bar = this.get_bar(filled_bar_length, '#')
		const empty_bar = this.get_bar(empty_bar_length, '-')
		const percentage_progress = (current_progress * 100).toFixed(2)

		readline.clearLine(process.stdout, -1)
		readline.cursorTo(process.stdout, 0)
		process.stdout.write(`Current progress: [${filled_bar}${empty_bar}] | ${percentage_progress}%`)
	}

	get_bar(length: number, char: string) {
		let str = ''
		for (let i = 0; i < length; i++) {
			str += char
		}
		return str
	}
}

export class ProgressBarCommand extends Command {
	name = 'test:bar'

	async handle() {
		const bar = new ProgressBar()
		bar.init(100)

		let i = 0
		while (i <= 100) {
			bar.update(i)

			sleep(10)

			i++
		}
	}
}
