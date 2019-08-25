import { Output } from '../Output'
import { Terminal } from '../Terminal'
import { Table } from './Table'

export class TableStream {
	protected table?: Table

	constructor(protected output: Output, protected terminal: Terminal) {}

	start(configure: (table: Table) => void) {
		//
	}

	render(rows: object[]) {
		//
	}

	finish() {
		//
	}
}
