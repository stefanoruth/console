import { Command, Argument, Option } from 'valon'

export class InputCommand extends Command {
	protected name = 'example:input'
	protected signature = [
		new Argument('file', 'optional', 'Long Argument description'),
		new Option('A', 'a', 'optional', 'Option A'),
		new Option('B', 'b', 'required', 'Option B'),
		new Option('C', undefined, 'optional', 'Option C', []),
	]

	async handle(args: any) {
		console.log('HERE', args)
	}
}
