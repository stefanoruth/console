import { Input } from '../Input/Input'
import { Output } from '../Output/Output'
import { ExitCode } from '../types'

export class CommandFinished {
	constructor(public command: string, public input: Input, public output: Output, public exitCode: ExitCode) {}
}
