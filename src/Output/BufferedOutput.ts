export class BufferedOutput {
	protected buffer = ''

	/**
	 * Empties buffer and returns its content.
	 */
	fetch(): string {
		const content = this.buffer
		this.buffer = ''

		return content
	}

	/**
	 * Writes a message to the buffer.
	 */
	protected write(message: string, newline: boolean = false) {
		this.buffer += message

		if (newline) {
			this.buffer += '\n'
		}
	}
}
