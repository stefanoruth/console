import readline from 'readline'

export class Terminal {
	/**
	 * Write a string to the terminal.
	 */
	write(buffer: string | Buffer) {
		process.stdout.write(buffer)
	}

	/**
	 * Write a string to the error output.
	 */
	writeError(buffer: string | Buffer) {
		process.stderr.write(buffer)
	}

	/**
	 * Clear previus line.
	 */
	clearLine(dir: number = -1) {
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
	 * Ask the user a Question.
	 */
	question(question: string): Promise<string> {
		return new Promise(resolve => {
			const r = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			})

			r.question(question, (answer: string) => {
				r.close()
				return resolve(answer)
			})
		})
	}
}
