import { TableStyle } from './TableStyle'

export class TableRow {
	protected space: string
	protected line: string = ''
	constructor(protected row: object, protected columnsWidth: number[], protected style: TableStyle) {
		this.space = style.paddingChar
	}

	render() {
		const keys = Object.keys(this.row)

		this.columnsWidth.forEach((width, key) => {
			if (!keys[key]) {
				this.line += this.style.fillEmpty(width)
				this.divide(key)
				return
			}

			const objectKey = keys[key]

			if (!(this.row as any)[objectKey]) {
				this.line += this.style.fillEmpty(width)
				this.divide(key)
				return
			}

			const text: string = String((this.row as any)[objectKey])

			this.line += this.style.pad(text, width)
			this.divide(key)
		})

		return this.style.verticalOutsideBorderChar + this.line + this.style.verticalOutsideBorderChar
	}

	protected divide(key: number) {
		if (key + 1 !== this.columnsWidth.length) {
			this.line += this.style.verticalInsideBorderChar
		}
	}
}
