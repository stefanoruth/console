export class Terminal {
	protected width?: number
	protected height?: number

	constructor() {
		this.width = process.stdout.columns
		this.height = process.stdout.rows
	}

	/**
	 * Gets the terminal width.
	 */
	getWidth() {
		return this.width
		// $width = getenv('COLUMNS');
		// if (false !== $width) {
		//     return (int) trim($width);
		// }
		// if (null === self:: $width) {
		//     self:: initDimensions();
		// }
		// return self:: $width ?: 80;
	}

	/**
	 * Gets the terminal height.
	 */
	getHeight() {
		return this.height
		// $height = getenv('LINES');
		// if (false !== $height) {
		//     return (int) trim($height);
		// }
		// if (null === self:: $height) {
		//     self:: initDimensions();
		// }
		// return self:: $height ?: 50;
	}
}
