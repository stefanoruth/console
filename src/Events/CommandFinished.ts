import { Input } from '../Input'
import { Output } from '../Output'

export class CommandFinished {
	constructor(
		public command: string | undefined,
		public input: Input,
		public output: Output,
		public exitCode: number
	) {}
}
