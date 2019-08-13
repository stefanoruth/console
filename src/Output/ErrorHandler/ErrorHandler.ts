import { isRunningTestMode } from '../../helpers'
import { Output } from '../Output'
import { FilePreview } from './FilePreview'
import { StackTrace } from './StackTrace'

export interface ErrorHandlerContract {
	report: (error: Error) => void
}

export class ErrorHandler {
	constructor(protected output: Output) {}

	report(e: Error): string {
		if (isRunningTestMode()) {
			console.log('Running in test with error')
			// throw e
		}

		const preview = new FilePreview(this.output)
		const stackTrace = new StackTrace().render(e)
		const style = this.output.getStyle()

		const render: string[] = []

		render.push(`\n  ${style.error(` ${e.name} `)} :  ${style.note(e.message)}\n`)

		const entry = stackTrace.shift()!

		render.push(`  at ${style.success(`${entry.file}:${entry.line}:${entry.column}`)}`)
		render.push(...preview.render({ path: entry.file, line: entry.line }))
		render.push('')

		render.push(`  ${style.info('Exception trace:')}\n`)

		stackTrace.forEach((trace, index) => {
			render.push(`  ${style.format(index + '', { text: 'blue' })}   ${style.info(trace.method || '')}`)
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
