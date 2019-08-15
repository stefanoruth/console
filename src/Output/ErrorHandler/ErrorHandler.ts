import { isRunningTestMode } from '../../helpers'
import { Output } from '../Output'
import { FilePreview } from './FilePreview'
import { StackTrace } from './StackTrace'

export class ErrorHandler {
	constructor(protected output: Output, protected captureTestMode: boolean = true) {}

	/**
	 * Render errors to the user cli when ever reported.
	 */
	report(e: Error): string {
		// By default we throw errors whenever an errors occur in test mode.
		// This can be turned of by setting the captureTestMode to false.
		if (this.captureTestMode && isRunningTestMode()) {
			throw e
		}

		const preview = new FilePreview(this.output)
		const stackTrace = new StackTrace().render(e)
		const style = this.output.getStyle()
		const entry = stackTrace.shift()!
		const render: string[] = []

		// TODO Rework string build part.
		render.push(`\n  ${style.error(` ${e.name} `)} :  ${style.note(e.message)}\n`)
		render.push(`  at ${style.success(`${entry.file}:${entry.line}:${entry.column}`)}`)
		render.push(...preview.render({ path: entry.file, line: entry.line }))

		render.push(`\n  ${style.info('Exception trace:')}\n`)

		stackTrace.forEach((trace, index) => {
			render.push(
				`  ${style.format(index + '', {
					text: 'blue',
				})}   ${style.info(trace.method || '')}`
			)
			if (trace.file) {
				render.push(`${' '.repeat(6)}${style.success(`${trace.file}:${trace.line}:${trace.column}`)}`)
			}
			render.push('')
		})

		const errorMsg = render.join('\n')

		this.output.raw(errorMsg)

		return errorMsg
	}
}
