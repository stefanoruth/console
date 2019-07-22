import { OutputFormatter } from './OutputFormatter'
import { Terminal } from './Terminal'
import { Verbosity } from './Verbosity'

export class Writer {
	protected verbosity: Verbosity = Verbosity.normal

	constructor(protected terminal: Terminal) {}

	/**
	 * Sets the verbosity of the output.
	 */
	setVerbosity(level: Verbosity) {
		this.verbosity = level

		return this
	}

	/**
	 * Check if it should skip output.
	 */
	isQuiet() {
		return this.verbosity === Verbosity.quiet
	}

	/**
	 * Writes a message to the output.
	 */
	write(messages: string | string[], newline: boolean = false) {
		if (this.isQuiet()) {
			return
		}

		if (!(messages instanceof Array)) {
			messages = [messages]
		}

		for (const message of messages) {
			this.terminal.write(message)
		}

		if (newline) {
			this.terminal.write('\n')
		}
	}

	/**
	 * Writes a message to the output and adds a newline at the end.
	 */
	writeln(messages: string | string[]) {
		return this.write(messages, true)
	}

	/**
	 * Display a set of new lines.
	 */
	newLine(count: number = 1) {
		return this.write('\n'.repeat(count))
	}
}
