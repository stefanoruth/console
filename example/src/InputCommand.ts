import { Command, Signature, Argument, Option } from 'kodo-console'

export class InputCommand extends Command {
	protected name = 'example:input'
	protected signature = new Signature([
		new Argument('file', 'optional', 'Long Argument description', 'nop'),
		new Option('A', 'a', 'optional', 'Option A'),
		new Option('B', 'b', 'required', 'Option B'),
		new Option('C', undefined, 'optional', 'Option C', []),
	])

	async handle() {
		//
	}
}
