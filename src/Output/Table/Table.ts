import { Output } from '../Output'
import { TableStyle } from './TableStyle'
import { TableCell } from './TableCell'
import { TableRow } from './TableRow'
import { TableDivider } from './TableDivider'
import { TableHeader } from './TableHeader'

export class Table {
	/**
	 * Table headers.
	 */
	protected headers: string[] = []

	/**
	 * Table rows.
	 */
	protected rows: object[] = []

	/**
	 * Number of columns cache.
	 */
	protected numberOfColumns?: number

	/**
	 * Table styles.
	 */
	protected style: TableStyle = new TableStyle()

	/**
	 * User set column widths.
	 */
	protected columnWidths: number[] = []

	/**
	 * Construct the table builder.
	 */
	constructor(protected output: Output) {}

	/**
	 * Renders table to output.
	 *
	 * Example:
	 *
	 *     +---------------+-----------------------+------------------+
	 *     | ISBN          | Title                 | Author           |
	 *     +---------------+-----------------------+------------------+
	 *     | 99921-58-10-7 | Divine Comedy         | Dante Alighieri  |
	 *     | 9971-5-0210-0 | A Tale of Two Cities  | Charles Dickens  |
	 *     | 960-425-059-0 | The Lord of the Rings | J. R. R. Tolkien |
	 *     +---------------+-----------------------+------------------+
	 */
	render() {
		const renderTable: string[] = new TableHeader(this.headers, [10, 12, 8], this.style).render()

		this.output.writer.write(renderTable)
	}

	setHeaders(headers?: string[]) {
		if (headers) {
			this.headers = headers
		}

		return this
	}

	setRows(rows: object[]) {
		this.rows = rows

		return this
	}
}
