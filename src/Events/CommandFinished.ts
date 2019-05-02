import { Input } from '../Input'
import { Output } from '../Output'
import { ExitCode } from '../types'

export class CommandFinished {
	constructor(public command: string, public input: Input, public output: Output, public exitCode: ExitCode) {}
}
