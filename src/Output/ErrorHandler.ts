import { Output } from './Output'
import { CommandNotFoundException } from '../Exceptions'
import { CommandRegistry } from '../CommandRegistry'

export class ErrorHandler {
	constructor(protected output: Output, protected commandRegistry?: CommandRegistry) {}

	render(e: Error) {
		if (e instanceof CommandNotFoundException) {
			return this.unknownCommand(e)
		}
		console.log(e)
	}

	unknownCommand(e: CommandNotFoundException) {
		this.output.error(e.message)
	}

	suggestOtherCommands() {
		//
	}
}
