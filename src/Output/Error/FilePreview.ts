import fs from 'fs'
import { Trace } from './Trace'
import { Output } from '../Output'

export class FilePreview {
	protected beforeLines = 4
	protected afterLines = 3

	constructor(protected output: Output) {}

	view(trace: Trace) {
		if (!trace.file) {
			return []
		}

		const contents = fs.readFileSync(trace.file, 'utf8').split('\r\n')
		const fromLine = trace.line - this.beforeLines
		const toLine = trace.line + this.afterLines

		return contents.slice(fromLine, toLine).map((line, index) => {
			const lineNumber = fromLine + index
			const pointer = lineNumber === trace.line ? this.output.getStyle().error('  > ') : ' '.repeat(4)

			return `${pointer}${lineNumber}| ${line}`
		})
	}
}
