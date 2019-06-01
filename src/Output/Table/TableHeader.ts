import { TableStyle } from './TableStyle'
import { TableDivider } from './TableDivider'

export class TableHeader {
	constructor(protected headers: string[] = [], protected columnWidths: number[], protected style: TableStyle) {}

	render(): string[] {
		return [
			new TableDivider('headerTop', this.columnWidths, this.style).render(),
			this.renderRow(),
			new TableDivider('headerBottom', this.columnWidths, this.style).render(),
		].map(line => line + '\n')
	}

	renderRow(): string {
		let line = ''

		this.columnWidths.forEach((width, key) => {
			if (this.headers[key]) {
				line += this.style.pad(this.headers[key], width)
			} else {
				line += this.style.fillEmpty(width)
			}

			line += this.style.columnDivider(key + 1 !== this.columnWidths.length)
		})

		return this.style.verticalOutsideBorderChar + line + this.style.verticalOutsideBorderChar
	}
}
