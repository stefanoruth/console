import { TableStyle } from './TableStyle'
import { TableDivider } from './TableDivider'
import { Color } from '../Style/Color'

export class TableHeader {
	constructor(
		protected headers: string[],
		protected columnWidths: number[] = [],
		protected style: TableStyle,
		protected color: Color
	) {
		if (this.columnWidths.length === 0) {
			this.headers.forEach(h => {
				this.columnWidths.push(h.length)
			})
		}
	}

	render(): string[] {
		return [
			new TableDivider('headerTop', this.columnWidths, this.style).render(),
			this.renderRow(),
			new TableDivider('headerBottom', this.columnWidths, this.style).render(),
		]
	}

	renderRow(): string {
		let line = ''

		this.columnWidths.forEach((width, key) => {
			if (this.headers[key]) {
				line += this.color.apply(this.style.pad(this.headers[key].toString(), width), { text: 'blue' })
			} else {
				line += this.style.fillEmpty(width)
			}

			line += this.style.columnDivider(key + 1 !== this.columnWidths.length)
		})

		return this.style.wrapRow(line)
	}
}
