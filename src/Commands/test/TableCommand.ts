import { Command } from '../Command'
import { Table } from '../../Output/Table/Table'

export class TableCommand extends Command {
	name = 'test:table'

	async handle() {
		const rows = [
			{ id: 1, name: 'Foo' },
			{ id: 2, name: 'Bar' },
			{ id: 3, name: 'Baz' },
			{ id: 4, name: 'Foobar' },
			{ id: 5 },
		]

		this.output.table(rows, ['#', 'MyName'])
	}
}
