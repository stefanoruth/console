import { Output } from './Output'
import { CommandNotFoundException } from '../Exceptions'
import { Registry } from '../Commands/Registry'
import { Command } from '../Commands'
import fs from 'fs'

interface Trace {
	method: string
	file: string
	line: [number, number]
}

export class ErrorHandler {
	constructor(protected output: Output) {}

	render(e: Error) {
		if (e instanceof CommandNotFoundException) {
			return this.unknownCommand(e)
		}

		const style = this.output.getStyle()

		const error: string[] = []

		error.push(`\n  ${style.error(` ${e.name} `)} :  ${style.note(e.message)}\n\n`)

		error.push(...this.getErrorStack(e))

		this.output.raw(error)
	}

	runningCommand(e: Error, c: Command, applicationName: string) {
		this.output.newLine()
		this.output.info(c.getSignature().getSynopsis() + applicationName)

		this.render(e)

		this.output.newLine()
	}

	unknownCommand(e: CommandNotFoundException) {
		this.output.error(e.message)
	}

	suggestOtherCommands() {
		//
	}

	protected getErrorStack(error: Error) {
		const findRegex = (item: string, exp: RegExp): string[] => {
			const matches = new RegExp(exp).exec(item)

			if (!matches) {
				throw new Error(`Count not find file in stack ${item}`)
			}

			matches.shift()

			return matches
		}

		const tracing: Trace[] = []
		let stack = (error.stack && error.stack.split('\n')) || []

		if (stack.length) {
			stack.shift()
			stack = stack.map(item => item.trim().replace('at ', ''))

			// console.log('STACK', stack)

			stack.forEach((item, index, arr) => {
				// console.log(index, item)
				let [method, file, lineStart, lineEnd]: string[] = []

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

				;[method, file, lineStart, lineEnd] = findRegex(item, /(.+) (?:\((.+):(\d+):(\d+)\))?/i)

				// 	// console.log(method, file, line)
				tracing.push({
					method,
					file,
					line: [parseInt(lineStart, 10), parseInt(lineEnd, 10)],
				})
			})
		}

		const style = this.output.getStyle()
		const render: string[] = []

		const entry = tracing.shift()!

		render.push(`  at ${style.success(entry.file)}:${style.success(entry.line.join('-'))}`)
		render.push(...this.previewFile(entry))
		render.push()

		render.push(`\n  ${style.info('Exception trace:')}\n`)

		tracing.forEach((trace, index) => {
			render.push(`  ${style.format(String(index), { text: 'blue' })}   ${style.info(trace.method)}`)
			if (trace.file) {
				render.push(`${' '.repeat(6)}${style.success(trace.file)}:${style.success(trace.line.join('-'))}`)
			}
			render.push('')
		})

		return render.map(item => item + '\n')
	}

	previewFile(trace: Trace): string[] {
		const [beforeLines, afterLines] = [4, 3]
		const contents = fs.readFileSync(trace.file, 'utf8').split('\r\n')
		const style = this.output.getStyle()
		// console.log(contents)

		const lines: string[] = []

		contents.forEach((line, lineNumber) => {
			if (lineNumber >= trace.line[0] - beforeLines && lineNumber < trace.line[0]) {
				// Before
				lines.push(`${' '.repeat(4)}${lineNumber}| ${line}`)
			} else if (lineNumber >= trace.line[0] && lineNumber <= trace.line[1]) {
				// Match
				lines.push(`${style.error('  > ')}${lineNumber}| ${line}`)
			} else if (lineNumber <= trace.line[1] + afterLines && lineNumber > trace.line[1]) {
				// After
				lines.push(`${' '.repeat(4)}${lineNumber}| ${line}`)
			} else {
				return
			}
		})

		return lines
	}
}
