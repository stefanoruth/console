import { InvalidArgumentException } from '../Exceptions'

enum OptionMode {
	none = 1,
	required = 2,
	optional = 4,
	isArray = 8,
}

export class Option<T = any> {
	protected name: string
	protected shortcut: string
	protected mode: OptionMode

	constructor(
		name: string,
		shortcut: string | string[] = '',
		protected description?: string,
		mode?: OptionMode,
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
		this.mode = mode || OptionMode.none
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
