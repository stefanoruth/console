export interface StackItem {
	method: string
	file: string
	line: number
	column: number
}

/**
 * Split a single stacktrace item into sperate bits.
 * @author https://github.com/felixge/node-stack-trace/blob/master/lib/stack-trace.js#L42
 */
function matchRegex(text: string) {
	const matches = new RegExp(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/i).exec(text)

	if (!matches) {
		return []
	}

	matches.shift()

	return matches
}

export class StackTrace {
	constructor(protected filePathHook?: (file: string) => string) {}

	/**
	 * Converts a stacktrace into an array of stack elements.
	 */
	render(error: Error): StackItem[] {
		const tracing: StackItem[] = []
		const stack = (error.stack && error.stack.split('\n')) || []

		if (stack.length) {
			stack.shift()

			stack.forEach(item => {
				const [message, file, line, column, extra] = matchRegex(item)

				tracing.push({
					method: extra ? `${message} (${extra})` : message,
					file: this.filePathHook && file ? this.filePathHook(file) : file,
					line: parseInt(line, 10),
					column: parseInt(column, 10),
				})
			})
		}

		return tracing
	}
}
