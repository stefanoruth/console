import { Command } from 'kodo-console'

export class TableCommand extends Command {
	name = 'example:table'

	async handle() {
		const rows = [
			{ id: 1, name: 'Foo' },
			{ id: 2, name: 'Bar' },
			{ id: 3, name: 'Baz' },
			{ id: 1020, name: 'Foobar', text: 'A long description here.' },
			{ id: 5 },
		]

		this.output.table(rows)

		this.output.table(rows, undefined, table => {
			table.setStyle('slim')
		})
	}
}
