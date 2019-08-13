import fs from 'fs'
import { Output } from '../Output'

export class FilePreview {
	protected beforeLines = 4
	protected afterLines = 3

	constructor(protected output: Output) {}

	/**
	 * Preview a snapshot of a file with a marker of a specefic line.
	 */
	view(file: { path: string; line: number }) {
		const contents = fs.readFileSync(file.path, 'utf8').split('\r\n')
		const fromLine = file.line - this.beforeLines
		const toLine = file.line + this.afterLines

		return contents.slice(fromLine, toLine).map((line, index) => {
			const lineNumber = fromLine + index
			const pointer = lineNumber === file.line ? this.output.getStyle().error('  > ') : ' '.repeat(4)

			return `${pointer}${lineNumber}| ${line}`
		})
	}
}
