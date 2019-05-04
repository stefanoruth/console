export class Option<T = boolean> {
	constructor(
		protected name: string,
		protected shortcut?: string,
		protected description?: string,
		protected defaultValue?: T
	) {}

	/**
	 * Set description.
	 */
	setDescription(value: string) {
		this.description = value

		return this
	}

	/**
	 * Set default value
	 */
	setDefault(value: T) {
		this.defaultValue = value

		return this
	}
}
