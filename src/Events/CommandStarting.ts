import { Input } from '../Input/Input'
import { Output } from '../Output/Output'

export class CommandStarting {
	constructor(public command: string, public input: Input, public output: Output) {}
}
