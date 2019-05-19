import { Input } from '../Input/Input'
import { Output } from '../Output/Output'

export class CommandFinished {
	constructor(public command: string, public input: Input, public output: Output, public exitCode: number) {}
}
