import readline from 'readline'
import { Direction } from 'readline'

export class Terminal {
	/**
	 * Write a string to the terminal.
	 */
	write(buffer: string) {
		process.stdout.write(buffer)
	}

	/**
	 * Write a string to the error output.
	 */
	writeError(buffer: string) {
		process.stderr.write(buffer)
	}

	/**
	 * Clear previus line.
	 */
	clearLine(dir: Direction = -1) {
		readline.clearLine(process.stdout, dir)
	}

	/**
	 * Clears the terminal for all text.
	 */
	clear() {
		console.clear()
	}

	/**
	 * Reset cursor to start of current line.
	 */
	cursorReset() {
		// Works without 3 argument.
		// Just moving the cursor to the start of the current line.
		// @ts-ignore
		readline.cursorTo(process.stdout, 0)
	}

	/**
	 * Calculate the number of columns in the console.
	 */
	width() {
		return process.stdout.columns
	}

	/**
	 * Calculate the number of rows in the console.
	 */
	height() {
		return process.stdout.rows
	}

	/**
	 * Exit the current process.
	 */
	exit(code?: number) {
		process.exit(code)
	}

	/**
	 * Get mode/environment for the application.
	 */
	mode() {
		return process.env.NODE_ENV
	}

	/**
	 * Ask the user a hidden Question.
	 */
	hiddenQuestion(question: string, newLine: boolean = true): Promise<string> {
		return new Promise(resolve => {
			const ogWrite = process.stdout.write
			// tslint:disable-next-line:no-empty
			const noop: any = () => {}

			const r = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			})

			this.write(question + (newLine && '\n'))

			// Mute
			process.stdout.write = noop

			r.question('', (answer: string) => {
				r.close()

				// Unmute
				process.stdout.write = ogWrite

				return resolve(answer)
			})
		})
	}

	/**
	 * Ask the user a Question.
	 */
	question(question: string, newLine: boolean = true): Promise<string> {
		return new Promise(resolve => {
			const r = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			})

			r.question(question + (newLine && '\n'), (answer: string) => {
				r.close()
				return resolve(answer)
			})
		})
	}
}
