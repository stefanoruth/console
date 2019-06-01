import { TableStyle } from './TableStyle'

type TableDividerType = 'headerTop' | 'headerBottom' | 'row' | 'footer'

interface RowStyle {
	left: string
	mid: string
	right: string
	fill: string
}

export class TableDivider {
	protected headerTop: RowStyle
	protected headerBottom: RowStyle
	protected row: RowStyle
	protected footer: RowStyle

	constructor(protected type: TableDividerType, protected columnWidths: number[], protected style: TableStyle) {
		const styles = style

		this.headerTop = {
			left: styles.crossingTopLeftChar,
			mid: styles.crossingTopMidBottomChar,
			right: styles.crossingTopRightChar,
			fill: styles.horizontalInsideBorderChar,
		}

		this.headerBottom = {
			left: styles.crossingTopLeftBottomChar,
			mid: styles.crossingTopMidBottomChar,
			right: styles.crossingTopRightBottomChar,
			fill: styles.horizontalInsideBorderChar,
		}

		this.row = {
			left: styles.crossingMidLeftChar,
			mid: styles.crossingChar,
			right: styles.crossingMidRightChar,
			fill: styles.horizontalInsideBorderChar,
		}

		this.footer = {
			left: styles.crossingBottomLeftChar,
			mid: styles.crossingBottomMidChar,
			right: styles.crossingBottomRightChar,
			fill: styles.horizontalInsideBorderChar,
		}
	}

	render(): string {
		const style = this[this.type]
		let line = ''

		this.columnWidths.forEach((width, key) => {
			line += style.fill.repeat(width)

			if (key + 1 !== this.columnWidths.length) {
				// Column divider.
				line += style.mid
			}
		})

		return style.left + line + style.right
	}
}
