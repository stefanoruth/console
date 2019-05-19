import { Input } from '../Input/Input'
import { Output } from '../Output/Output'
import { ConsoleEvent } from './ConsoleEvent'

export class CommandFinished extends ConsoleEvent {
	constructor(public command: string, public input: Input, public output: Output, public exitCode: number) {
		super()
	}
}
