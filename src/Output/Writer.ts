import { BufferedOutput } from './BufferedOutput'
import { OutputFormatter } from './OutputFormatter'

export class Writer {
	static VERBOSITY_QUIET = 16
	static VERBOSITY_NORMAL = 32
	static VERBOSITY_VERBOSE = 64
	static VERBOSITY_VERY_VERBOSE = 128
	static VERBOSITY_DEBUG = 256

	static OUTPUT_NORMAL = 1
	static OUTPUT_RAW = 2
	static OUTPUT_PLAIN = 4

	protected bufferedOutput: BufferedOutput

	constructor() {
		//
		this.bufferedOutput = new BufferedOutput()
	}

	/**
	 * Writes a message to the output.
	 */
	write(messages: string | string[], newline: boolean = false) {
		if (!(messages instanceof Array)) {
			messages = [messages]
		}

		for (const message of messages) {
			process.stdout.write(message)

			if (newline) {
				process.stdout.write('\n')
			}
		}
	}

	/**
	 * Writes a message to the output and adds a newline at the end.
	 */
	writeln(messages: string | string[]) {
		this.write(messages, true)
	}

	/**
	 * Formats a message as a block of text.
	 *
	 * messages The message to write in the block
	 * type     The block type (added in [] on first line)
	 * style    The style to apply to the whole block
	 * prefix   The prefix for the block
	 * padding  Whether to add vertical padding
	 * escape   Whether to escape the message
	 */
	block(
		messages: string | string[],
		type?: string,
		style?: string,
		prefix: string = ' ',
		padding: boolean = false,
		escape: boolean = true
	) {
		messages = messages instanceof Array ? messages : [messages]

		this.autoPrependBlock()
		this.writeln(this.createBlock(messages, type, style, prefix, padding, escape))
		this.newLine()
	}

	/**
	 * Display a set of new lines.
	 */
	newLine(count: number = 1) {
		this.write('\n'.repeat(count))
	}

	protected autoPrependBlock() {
		const chars = this.bufferedOutput.fetch().substr(-2)

		if (!chars[0]) {
			this.newLine() // Empty history, so we should start with a new line.
			return
		}

		// Prepend new line for each non LF chars (This means no blank line was output before)
		this.newLine(2 - chars.split('\n').length)
	}

	protected createBlock(
		messages: string[],
		type?: string,
		style?: string,
		prefix: string = ' ',
		padding: boolean = false,
		escape: boolean = false
	) {
		let indentLength: number = 0
		let lineIndentation: string = ''
		// $prefixLength = Helper:: strlenWithoutDecoration($this -> getFormatter(), $prefix);
		let lines: string[] = []
		if (type) {
			type = `[${type}]`
			indentLength = type.length
			lineIndentation = ' '.repeat(indentLength)
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
		})

		// let firstLineIndex = 0

		// if (padding && this.isDecorated()) {
		// 	firstLineIndex = 1
		// 	lines.unshift('')
		// 	lines.push('')
		// }

		// foreach($lines as $i => & $line) {
		//     if (null !== $type) {
		//         $line = $firstLineIndex === $i ? $type.$line : $lineIndentation.$line;
		//     }
		//     $line = $prefix.$line;
		//     $line.= str_repeat(' ', $this -> lineLength - Helper:: strlenWithoutDecoration($this -> getFormatter(), $line));
		//     if ($style) {
		//         $line = sprintf('<%s>%s</>', $style, $line);
		//     }
		// }
		return lines
	}
}
