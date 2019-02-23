import rl from 'readline'

const colorList = {
	reset: '\x1b[0m',
	cyan: '\x1b[36m',
	yellow: '\x1b[33m',
}

type Colors = keyof typeof colorList

export class Output {
	/**
	 * Write a line to the console.
	 */
	line(message: string, newLine: boolean = false, color: Colors = 'reset'): void {
		process.stdout.write(color + '%s' + colorList.reset, message)

		if (newLine) {
			this.newLine()
		}
	}

	/**
	 * Display a table on the console.
	 */
	table(...args: any[]): void {
		console.table(args)
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
