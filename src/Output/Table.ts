import { Output } from './Output'

export class Table {
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
	}

	constructor(protected output: Output) {}

	setHeaders(columns?: object) {
		//
	}

	setRows(rows: object[]) {
		//
	}

	render() {
		//
	}
}
