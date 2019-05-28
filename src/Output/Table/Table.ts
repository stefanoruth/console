import { Output } from '../Output'
import { TableStyle } from './TableStyle'
import { TableSeparator } from './TableSeparator'
import { TableCell } from './TableCell'

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
	protected columnMaxWidths: number[] = []

	/**
	 * Construct the table builder.
	 */
	constructor(protected output: Output) {}

	/**
	 * Sets the minimum width of a column.
	 */
	setColumnWidth(columnIndex: number, width: number): this {
		this.columnWidths[columnIndex] = width
		return this
	}

	/**
	 * Sets the minimum width of all columns.
	 */
	setColumnWidths(widths: number[]) {
		this.columnWidths = []

		widths.forEach((width, index) => {
			this.setColumnWidth(index, width)
		})

		return this
	}

	/**
	 * Sets the maximum width of a column.
	 *
	 * Any cell within this column which contents exceeds the specified width will be wrapped into multiple lines, while
	 * formatted strings are preserved.
	 */
	setColumnMaxWidth(columnIndex: number, width: number): this {
		// if (!this.output.getFormatter() instanceof WrappableOutputFormatterInterface) {
		//     throw new \LogicException(sprintf('Setting a maximum column width is only supported when using a "%s" formatter, got "%s".', WrappableOutputFormatterInterface:: class, \get_class($this -> output -> getFormatter())));
		// }

		this.columnMaxWidths[columnIndex] = width

		return this
	}

	setHeaders(headers: string[]) {
		this.headers = headers

		return this
	}

	setRows(rows: object[]) {
		this.rows = []

		return this.addRows(rows)
	}

	addRows(rows: object[]) {
		rows.forEach(row => this.addRow(row))

		return this
	}

	addRow(row: object) {
		if (row instanceof TableSeparator) {
			this.rows.push(row)

			return this
		}

		this.rows.push(row)

		return this
	}

	setRow(column: number, row: object) {
		this.rows[column] = row

		return this
	}

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
		const divider = new TableSeparator()

		const rows: any[] = [...this.headers, divider, ...this.rows]
		this.calculateNumberOfColumns(rows)
		//
	}

	/**
	 * Renders horizontal header separator.
	 *
	 * Example:
	 *
	 *     +-----+-----------+-------+
	 */
	renderRowSeparator() {
		//
	}

	/**
	 * Calculate number of columns for this table.
	 */
	protected calculateNumberOfColumns(rows: any[]) {
		const columns = [0]

		rows.forEach(row => {
			if (row instanceof TableSeparator) {
				return
			}
			columns.push(this.getNumberOfColumns(row))
		})

		this.numberOfColumns = Math.max.apply(null, columns)
	}

	/**
	 * Gets number of columns by row.
	 */
	protected getNumberOfColumns(row: object): number {
		let columns: number = Object.keys(row).length

		Object.keys(row).forEach(column => {
			const cell = (row as any)[column]

			columns += cell instanceof TableCell ? cell.getColspan() - 1 : 0
		})

		return columns
	}
}
