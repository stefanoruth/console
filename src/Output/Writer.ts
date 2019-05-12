export class Writer {
	static VERBOSITY_QUIET = 16
	static VERBOSITY_NORMAL = 32
	static VERBOSITY_VERBOSE = 64
	static VERBOSITY_VERY_VERBOSE = 128
	static VERBOSITY_DEBUG = 256

	static OUTPUT_NORMAL = 1
	static OUTPUT_RAW = 2
	static OUTPUT_PLAIN = 4

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
		// $messages = \is_array($messages) ? array_values($messages) : [$messages];
		// $this -> autoPrependBlock();
		// $this -> writeln($this -> createBlock($messages, $type, $style, $prefix, $padding, $escape));
		// $this -> newLine();

		// this.writeln
		this.newLine()
	}

	/**
	 * Display a set of new lines.
	 */
	newLine(count: number = 1) {
		this.write('\n'.repeat(count))
	}
}
