import { Input } from '../Input/Input'
import { Output } from '../Output/Output'
import { ConsoleEvent } from './ConsoleEvent'

export class CommandStarting extends ConsoleEvent {
	constructor(public command: string, public input: Input, public output: Output) {
		super()
	}
}
