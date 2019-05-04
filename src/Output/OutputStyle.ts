import rl from 'readline'
import { Colors, ColorCodes } from './Colors'

export class OutputStyle {
	/**
	 * Write a line to the console.
	 */
	line(message: string, newLine: boolean = false, color: Colors = 'reset') {
		process.stdout.write(color + message + ColorCodes.reset)

		if (newLine) {
			this.newLine()
		}
	}

	/**
	 * Display a table on the console.
	 */
	table(rows: object[], columns?: object) {
		console.table(rows, columns)
	}

	/**
	 * Display a set of new lines.
	 */
	newLine(count: number = 1) {
		process.stdout.write('\n'.repeat(count))
	}

	/**
	 * Ask the user for a question.
	 */
	ask(question: string): Promise<string> {
		return new Promise(resolve => {
			const r = rl.createInterface({
				input: process.stdin,
				output: process.stdout,
			})

			r.question(question + '\n', (answer: string) => {
				r.close()
				resolve(answer)
			})
		})
	}

	/**
	 * Ask the user if they really wanna do it.
	 */
	confirm(question: string, defaultValue: boolean = true): Promise<boolean> {
		return new Promise(resolve => {
			const r = rl.createInterface({
				input: process.stdin,
				output: process.stdout,
			})

			r.question(question + '\n', (answer: string) => {
				r.close()
				resolve(answer === 'Y')
			})
		})
	}
}
