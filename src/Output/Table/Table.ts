import { Output } from '../Output'
import { TableStyle } from './TableStyle'
import { TableRow } from './TableRow'
import { TableDivider } from './TableDivider'
import { TableHeader } from './TableHeader'
import { Color } from '../Style/Color'

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
	 * Table styles.
	 */
	protected style: TableStyle

	/**
	 * User set column widths.
	 */
	protected columnWidths: number[] = []

	/**
	 * Render text to console.
	 */
	protected output: Output

	/**
	 * Append colors to the table.
	 */
	protected color: Color

	/**
	 * Construct the table builder.
	 */
	constructor(output: Output, color: Color, style: TableStyle = new TableStyle()) {
		this.output = output
		this.color = color
		this.style = style
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
		this.setSlimStyle()
		this.calcWidths()

		let headers = this.headers

		if (headers.length === 0) {
			headers = Object.keys(this.rows[0])
		}

		const table: string[] = new TableHeader(headers, this.columnWidths, this.style, this.color).render()

		this.rows.forEach(row => {
			table.push(new TableRow(row, this.columnWidths, this.style).render() + '\n')
		})

		table.push(new TableDivider('footer', this.columnWidths, this.style).render() + '\n')

		this.output.raw(table)
	}

	/**
	 * Set contents for the table header.
	 */
	setHeaders(headers?: string[]) {
		if (headers) {
			this.headers = headers
		}

		return this
	}

	/**
	 * Set row contents.
	 */
	setRows(rows: object[]) {
		this.rows = rows

		return this
	}

	/**
	 * Calculate the max witdh of each row
	 */
	protected calcWidths(): number {
		const rows = [...this.rows, this.headers]

		rows.forEach(row => {
			Object.keys(row).forEach((field, key) => {
				const width: number = (row as any)[field].toString().length

				this.columnWidths[key] = Math.max.apply(null, [this.columnWidths[key] || 0, width])
			})
		})

		return this.columnWidths.length
	}

	setDefaultStyle() {
		this.style = new TableStyle()

		return this
	}

	setSlimStyle() {
		this.style = new TableStyle({
			horizontalOutsideBorderChar: '─',
			horizontalInsideBorderChar: '─',
			verticalOutsideBorderChar: '│',
			verticalInsideBorderChar: '│',
			crossingChar: '┼',
			crossingTopRightChar: '┐',
			crossingTopMidChar: '┬',
			crossingTopLeftChar: '┌',
			crossingMidRightChar: '┤',
			crossingBottomRightChar: '┘',
			crossingBottomMidChar: '┴',
			crossingBottomLeftChar: '└',
			crossingMidLeftChar: '├',
			crossingTopLeftBottomChar: '├',
			crossingTopMidBottomChar: '┼',
			crossingTopRightBottomChar: '┤',
		})

		return this
	}
}
