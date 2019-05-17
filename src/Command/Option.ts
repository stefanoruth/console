import { InvalidArgumentException } from '../Exceptions'

export class Option<T = any> {
	protected name: string
	protected shortcut: string

	constructor(
		name: string,
		shortcut: string | string[] = '',
		protected description?: string,
		protected defaultValue?: T
	) {
		if (name.indexOf('--') === 0) {
			name = name.substr(2)
		}

		if (name.length === 0) {
			throw new InvalidArgumentException('An option name cannot be empty.')
		}

		if (shortcut) {
			if (shortcut instanceof Array) {
				shortcut = shortcut.join('|')
			}

			shortcut = shortcut
				.replace(/^\-/, '')
				.split('{(|)-?}')
				.filter(value => !!value)
				.join('|')

			if (shortcut.length === 0) {
				throw new InvalidArgumentException('An option shortcut cannot be empty.')
			}
		}

		this.name = name
		this.shortcut = shortcut
	}

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

	/**
	 * Returns the option shortcut.
	 */
	getShortcut(): string {
		return this.shortcut
	}

	/**
	 * Returns the option name.
	 */
	getName() {
		return this.name
	}

	/**
	 * Returns the description text.
	 */
	getDescription() {
		return this.description || ''
	}
}
