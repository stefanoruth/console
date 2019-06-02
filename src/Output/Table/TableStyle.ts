interface TableStyleOptions {
	paddingChar?: string
	horizontalOutsideBorderChar?: string
	horizontalInsideBorderChar?: string
	verticalOutsideBorderChar?: string
	verticalInsideBorderChar?: string
	crossingChar?: string
	crossingTopRightChar?: string
	crossingTopMidChar?: string
	crossingTopLeftChar?: string
	crossingMidRightChar?: string
	crossingBottomRightChar?: string
	crossingBottomMidChar?: string
	crossingBottomLeftChar?: string
	crossingMidLeftChar?: string
	crossingTopLeftBottomChar?: string
	crossingTopMidBottomChar?: string
	crossingTopRightBottomChar?: string
}

export class TableStyle implements TableStyleOptions {
	/**
	 * Table design.
	 */
	public readonly paddingChar = ' '
	public readonly horizontalOutsideBorderChar = '-'
	public readonly horizontalInsideBorderChar = '-'
	public readonly verticalOutsideBorderChar = '|'
	public readonly verticalInsideBorderChar = '|'
	public readonly crossingChar = '+'
	public readonly crossingTopRightChar = '+'
	public readonly crossingTopMidChar = '+'
	public readonly crossingTopLeftChar = '+'
	public readonly crossingMidRightChar = '+'
	public readonly crossingBottomRightChar = '+'
	public readonly crossingBottomMidChar = '+'
	public readonly crossingBottomLeftChar = '+'
	public readonly crossingMidLeftChar = '+'
	public readonly crossingTopLeftBottomChar = '+'
	public readonly crossingTopMidBottomChar = '+'
	public readonly crossingTopRightBottomChar = '+'

	/**
	 * Override any styles needed.
	 */
	constructor(styles?: TableStyleOptions) {
		if (styles) {
			Object.keys(styles).forEach(key => {
				;(this as any)[key] = (styles as any)[key]
			})
		}
	}

	/**
	 * Pad a text to fill the required space
	 */
	pad(value: string, width: number): string {
		const padLength = width - value.length
		value = this.paddingChar + value + this.paddingChar

		if (padLength > 0) {
			return value + this.paddingChar.repeat(padLength)
		}

		return value
	}

	/**
	 * Wrap the entire row in a outside table set.
	 */
	wrapRow(value: string) {
		return this.verticalOutsideBorderChar + value + this.verticalOutsideBorderChar
	}

	/**
	 * Fill a void with spaces
	 */
	fillEmpty(width: number): string {
		return this.paddingChar.repeat(width + 2)
	}

	/**
	 * Check if there should be placed a column divider in the output.
	 */
	columnDivider(show: boolean): string {
		return show ? this.verticalInsideBorderChar : ''
	}
}
