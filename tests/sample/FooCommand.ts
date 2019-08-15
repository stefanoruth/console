import { Command } from '../../src/Commands'

export interface NotACommand {
	name: string
}

export class FooCommand extends Command {
	protected name = 'foo'

	async handle() {
		//
	}
}

export class BarCommand extends Command {
	protected name = 'bar'

	async handle() {
		//
	}
}
