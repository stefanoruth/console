export enum PaddingType {
	right,
	left,
	both,
}

export class TableStyle {
	/**
	 * Table design.
	 */
	protected style = {
		paddingChar: ' ',
		horizontalOutsideBorderChar: '-',
		horizontalInsideBorderChar: '-',
		verticalOutsideBorderChar: '|',
		verticalInsideBorderChar: '|',
		crossingChar: '+',
		crossingTopRightChar: '+',
		crossingTopMidChar: '+',
		crossingTopLeftChar: '+',
		crossingMidRightChar: '+',
		crossingBottomRightChar: '+',
		crossingBottomMidChar: '+',
		crossingBottomLeftChar: '+',
		crossingMidLeftChar: '+',
		crossingTopLeftBottomChar: '+',
		crossingTopMidBottomChar: '+',
		crossingTopRightBottomChar: '+',
		headerTitleFormat: '<fg:black;bg:white;options:bold> %s </>',
		footerTitleFormat: '<fg:black;bg:white;options:bold> %s </>',
		cellHeaderFormat: '<info>%s</info>',
		cellRowFormat: '%s',
		cellRowContentFormat: ' %s ',
		borderFormat: '%s',
		padType: PaddingType.right,
	}

	getStyle() {
		return this.style
	}

	pad(str: string, amount: number): string {
		return ''
	}
}
