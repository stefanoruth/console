import { isRunningTestMode } from '../../helpers'
import { Output } from '../Output'
import { FilePreview } from './FilePreview'
import { StackTrace } from './StackTrace'

export class ErrorHandler {
	protected stackTrace: StackTrace = new StackTrace()
	protected filePreview: FilePreview = new FilePreview(this.output)

	constructor(
		protected output: Output,
		protected fileNameFormatter?: (file: string) => string,
		protected captureTestMode: boolean = true
	) {}

	/**
	 * Render errors to the user cli when ever reported.
	 */
	report(e: Error): string {
		// By default we throw errors whenever an errors occur in test mode.
		// This can be turned of by setting the captureTestMode to false.
		if (this.captureTestMode && isRunningTestMode()) {
			throw e
		}

		const stackTrace = this.stackTrace.render(e)
		const style = this.output.getStyle()
		const entry = stackTrace.shift()!
		const render: string[] = []
		const filePath = (file: string) => (this.fileNameFormatter ? this.fileNameFormatter(file) : file)

		// TODO Rework string build part.
		render.push(`\n  ${style.error(` ${e.name} `)} :  ${style.note(e.message)}\n`)
		render.push(`  at ${style.success(`${filePath(entry.file)}:${entry.line}:${entry.column}`)}`)
		render.push(...this.filePreview.render({ path: entry.file, line: entry.line }))

		render.push(`\n  ${style.info('Exception trace:')}\n`)

		stackTrace.forEach((trace, index) => {
			render.push(
				`  ${style.format(index + '', {
					text: 'blue',
				})}   ${style.info(trace.method || '')}`
			)
			if (trace.file) {
				render.push(`${' '.repeat(6)}${style.success(`${filePath(trace.file)}:${trace.line}:${trace.column}`)}`)
			}
			render.push('')
		})

		const errorMsg = render.join('\n')

		this.output.raw(errorMsg)

		return errorMsg
	}
}
