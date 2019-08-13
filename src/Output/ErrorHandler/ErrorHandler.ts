import { Command } from '../../Commands'
import { isRunningTestMode } from '../../helpers'
import { Output } from '../Output'

export interface ErrorHandlerContract {
	report: (error: Error) => void
}

export class ErrorHandler {
	constructor(protected output: Output) {}

	report(e: Error) {
		if (isRunningTestMode()) {
			throw e
		}
		console.log(e)
	}

	runningCommand(e: Error, c: Command, applicationName: string) {
		this.output.newLine()
		this.output.info(c.getSignature().getSynopsis() + applicationName)

		this.report(e)

		this.output.newLine()
	}
}
