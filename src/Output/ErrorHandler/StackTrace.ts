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
export function splitStackTraceEntry(text: string) {
	const matches = new RegExp(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/i).exec(text)

	if (!matches) {
		throw new Error(`Unable to match stacktrace entry line: ${text}`)
	}

	matches.shift()

	return matches
}

export class StackTrace {
	/**
	 * Converts a stacktrace into an array of stack elements.
	 */
	render(error: Error): StackItem[] {
		const tracing: StackItem[] = []
		const stack = (error.stack && error.stack.split('\n')) || []

		if (stack.length) {
			stack.shift()

			stack.forEach(item => {
				const [message, file, line, column, extra] = splitStackTraceEntry(item)

				tracing.push({
					method: extra ? `${message} (${extra})` : message,
					file,
					line: parseInt(line, 10),
					column: parseInt(column, 10),
				})
			})
		}

		return tracing
	}
}
