export interface CellOptions {
	rowspan: number
	colspan: number
}

export class TableCell {
	protected options: CellOptions

	/**
	 * Initialize.
	 */
	constructor(protected value: string = '', options?: CellOptions) {
		if (typeof options === 'undefined') {
			this.options = { rowspan: 1, colspan: 1 }
		} else {
			this.options = options
		}
	}

	/**
	 * Returns the cell value.
	 */
	toString() {
		return this.value
	}

	/**
	 * Gets number of colspan.
	 */
	getColspan() {
		return this.options.colspan
	}

	/**
	 * Gets number of rowspan.
	 */
	getRowspan() {
		return this.options.rowspan
	}
}
