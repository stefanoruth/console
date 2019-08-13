import fs from 'fs'
import { Output } from '../Output'

export class FilePreview {
	protected beforeLines = 4
	protected afterLines = 3

	constructor(protected output: Output) {}

	/**
	 * Preview a snapshot of a file with a marker of a specefic line.
	 */
	render(file: { path: string; line: number }) {
		// Read file.
		const data = fs.readFileSync(file.path, 'utf8')

		// Find split type.
		const splitRN = data.split('\r\n')
		const splitN = data.split('\n')
		const contents = splitRN.length > splitN.length ? splitRN : splitN

		// Preview offset.
		const fromLine = file.line - this.beforeLines
		const toLine = file.line + this.afterLines

		return contents.slice(fromLine, toLine).map((line, index) => {
			const lineNumber = fromLine + index
			const pointer = lineNumber === file.line ? this.output.getStyle().error('  > ') : ' '.repeat(4)

			return `${pointer}${lineNumber}| ${line}`
		})
	}
}
