import { BufferedOutput } from './BufferedOutput'
import { OutputFormatter } from './OutputFormatter'
import { Terminal } from './Terminal'
import { Verbosity } from './Verbosity'

export class Writer {
	protected verbosity: Verbosity = Verbosity.normal
	protected bufferedOutput: BufferedOutput = new BufferedOutput()

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

	/**
	 * Formats a message as a block of text.
	 *
	 * messages The message to write in the block
	 * level of indentation
	 */
	block(messages: string | string[], indentationLevel: number = 0) {
		if (!(messages instanceof Array)) {
			messages = [messages]
		}

		this.newLine(2)

		let indentation: string = ''
		let lines: string[] = []

		if (indentationLevel) {
			indentation = ' '.repeat(indentationLevel)
		}

		// wrap and add newlines for each element
		messages.forEach((message, key) => {
			if (escape) {
				message = OutputFormatter.escape(message)
			}
			lines = lines.concat() //     $lines = array_merge($lines, explode(PHP_EOL, wordwrap($message, $this -> lineLength - $prefixLength - $indentLength, PHP_EOL, true)));

			if (messages.length > 1 && key < messages.length - 1) {
				lines.push('')
			}

			lines.push(indentation + message)
		})

		this.writeln(messages)
		this.newLine()
	}
}
