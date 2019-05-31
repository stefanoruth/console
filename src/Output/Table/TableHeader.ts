import { TableStyle } from './TableStyle'

export class TableHeader {
	constructor(protected headers: string[] = [], protected columnWidths: number[], protected style: TableStyle) {}

	render(): string[] {
		return [this.renderStart(), this.renderRow(), this.renderEnd()]
	}

	renderStart(): string {
		let line = ''

		this.columnWidths.forEach((width, key) => {
			line += this.style.getStyle().horizontalOutsideBorderChar.repeat(width)

			if (key + 1 !== this.columnWidths.length) {
				line += this.style.getStyle().crossingTopMidChar
			}
		})

		return this.style.getStyle().crossingTopLeftChar + line + this.style.getStyle().crossingTopRightChar + '\n'
	}

	renderRow(): string {
		let line = ''

		this.columnWidths.forEach((width, key) => {
			if (this.headers[key]) {
				line += ' ' + this.headers[key] + ' '.repeat(width - this.headers[key].length - 2) + ' '
			} else {
				line += ' '.repeat(width)
			}

			if (key + 1 !== this.columnWidths.length) {
				line += this.style.getStyle().verticalInsideBorderChar
			}
		})

		return (
			this.style.getStyle().verticalOutsideBorderChar + line + this.style.getStyle().verticalOutsideBorderChar + '\n'
		)
	}

	renderEnd(): string {
		let line = ''

		this.columnWidths.forEach((width, key) => {
			line += this.style.getStyle().horizontalInsideBorderChar.repeat(width)

			if (key + 1 !== this.columnWidths.length) {
				line += this.style.getStyle().crossingTopMidBottomChar
			}
		})

		return (
			this.style.getStyle().crossingTopLeftBottomChar + line + this.style.getStyle().crossingTopRightBottomChar + '\n'
		)
	}
}
