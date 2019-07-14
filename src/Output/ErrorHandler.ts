import { Output } from './Output'
import { CommandNotFoundException } from '../Exceptions'
import { Registry } from '../Commands/Registry'

export class ErrorHandler {
	constructor(protected output: Output, protected commandRegistry?: Registry) {}

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
