export interface TraceItem {
	method: string
	file: string
	line: number
	column: number
}

export class StackTrace {
	static readonly fileRegex = /(.+) (?:\((.+):(\d+):(\d+)\))?/i
	protected stack: TraceItem[] = []

	constructor(error: Error) {
		//
	}

	protected matchFile(item: string): string[] {
		const matches = new RegExp(StackTrace.fileRegex).exec(item)

		if (!matches) {
			// throw new Error(`Count not find file in stack ${item}`)
			return [item, '', '', '']
		}

		matches.shift()

		return matches
	}

	build(error: Error): TraceItem[] {
		const tracing: TraceItem[] = []
		let stack = (error.stack && error.stack.split('\n')) || []

		if (stack.length) {
			stack.shift()
			stack = stack.map(item => item.trim().replace('at ', ''))

			stack.forEach((item, index, arr) => {
				let [method, file, line, column]: string[] = []

				if (item.includes('(<anonymous>)')) {
					const filePath = arr[index + 1]

					if (typeof filePath !== 'undefined') {
						if (filePath.includes('(')) {
							item = `${item} ${filePath}`
						} else {
							item = `${item} (${filePath})`
						}

						arr.splice(index, 1)
					}
				}

				;[method, file, line, column] = this.matchFile(item)

				tracing.push({
					method,
					file,
					line: parseInt(line, 10),
					column: parseInt(column, 10),
				})
			})
		}

		return tracing
	}
}
