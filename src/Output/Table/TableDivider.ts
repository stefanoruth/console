import { TableStyle } from './TableStyle'

export class TableDivider {
	constructor(protected numberOfColumns: number, protected columnWidths: number[], protected style: TableStyle) {}

	render(): string {
		let line = ''

		this.columnWidths.forEach((width, key) => {
			if (key === 0) {
				// Row start character.
				line += this.style.getStyle().verticalOutsideBorderChar
			}

			line += this.style.getStyle().horizontalInsideBorderChar.repeat(width)

			if (key + 1 === this.columnWidths.length) {
				// Row end character.
				line += this.style.getStyle().verticalOutsideBorderChar
			} else {
				// Column divider.
				line += this.style.getStyle().verticalInsideBorderChar
			}
		})

		return line
	}
}
