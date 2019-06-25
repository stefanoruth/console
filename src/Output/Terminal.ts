import rl from 'readline'

export class Terminal {
	constructor(
		protected stdin: NodeJS.ReadStream = process.stdin,
		protected stdout: NodeJS.WriteStream = process.stdout,
		protected stderr: NodeJS.WriteStream = process.stderr,
		protected readline: typeof rl = rl
	) {}

	/**
	 * Write a string to the terminal.
	 */
	write(buffer: string | Buffer) {
		this.stdout.write(buffer)
	}

	/**
	 * Write a string to the error output.
	 */
	writeError(buffer: string | Buffer) {
		this.stderr.write(buffer)
	}

	/**
	 * Clear previus line.
	 */
	clearLine(dir: number = -1) {
		this.readline.clearLine(this.stdout, dir)
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
		this.readline.cursorTo(this.stdout, 0)
	}

	/**
	 * Calculate the number of columns in the console.
	 */
	width() {
		return this.stdout.columns
	}

	/**
	 * Calculate the number of rows in the console.
	 */
	height() {
		return this.stdout.rows
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
			const r = this.readline.createInterface({
				input: this.stdin,
				output: this.stdout,
			})

			r.question(question, (answer: string) => {
				r.close()
				return resolve(answer)
			})
		})
	}
}
