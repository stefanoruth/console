import { Output } from './Output'
import { CommandNotFoundException } from '../Exceptions'
import { Registry } from '../Commands/Registry'
import { Command } from '../Commands'
import { FilePreview } from './Error/FilePreview'
import { Stack } from './Error/Stack'

export class ErrorHandler {
	constructor(
		protected output: Output,
		protected filePreview: FilePreview = new FilePreview(output),
		protected stackRender: Stack = new Stack()
	) {}

	render(e: Error) {
		// console.log(e)

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

	protected formatFile(file: string) {
		return file
	}

	protected getErrorStack(error: Error) {
		const style = this.output.getStyle()
		const render: string[] = []

		const tracing = this.stackRender.build(error)

		const entry = tracing.shift()!

		render.push(`  at ${style.success(`${this.formatFile(entry.file)}:${entry.line}:${entry.column}`)}`)
		render.push(...this.filePreview.view(entry))
		render.push('')

		render.push(`  ${style.info('Exception trace:')}\n`)

		tracing.forEach((trace, index) => {
			render.push(`  ${style.format(String(index), { text: 'blue' })}   ${style.info(this.formatFile(trace.method))}`)
			if (trace.file) {
				render.push(`${' '.repeat(6)}${style.success(`${this.formatFile(trace.file)}:${trace.line}:${trace.column}`)}`)
			}
			render.push('')
		})

		return render.map(item => item + '\n')
	}
}
