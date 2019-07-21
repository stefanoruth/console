import { BufferedOutput } from './BufferedOutput'
import { OutputFormatter } from './OutputFormatter'
import { Terminal } from './Terminal'

export class Writer {
	protected bufferedOutput: BufferedOutput = new BufferedOutput()

	constructor(protected terminal: Terminal) {}

	/**
	 * Writes a message to the output.
	 */
	write(messages: string | string[], newline: boolean = false) {
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
		if (!(messages instanceof Array)) {
			messages = [messages]
		}

		this.autoPrependBlock()
		this.writeln(this.createBlock(messages, type, style, prefix, padding, escape))
		this.newLine()
	}

	/**
	 * Display a set of new lines.
	 */
	newLine(count: number = 1) {
		return this.write('\n'.repeat(count))
	}

	protected autoPrependBlock() {
		this.newLine(2)
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
		// let prefixLength = strlen(prefix)

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

		// lines.forEach((line, i) => {
		// 	if (type !== null) {
		// 		line = firstLineIndex === i ? type + line : lineIndentation + line
		// 	}
		// 	line = prefix + line
		// 	line += ' '.repeat(this.lineLength - strlen(line))

		// 	if (style) {
		// 		// line =
		// 	}
		// })

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
