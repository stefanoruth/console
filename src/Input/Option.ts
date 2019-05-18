import { InvalidArgumentException, LogicException } from '../Exceptions'

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
	 * Returns true if the option accepts a value.
	 */
	acceptValue(): boolean {
		return this.isValueRequired() || this.isValueOptional()
	}

	/**
	 * Returns true if the option requires a value.
	 */
	isValueRequired(): boolean {
		return OptionMode.required === (OptionMode.required & this.mode)
	}

	/**
	 * Returns true if the option takes an optional value.
	 */
	isValueOptional(): boolean {
		return OptionMode.optional === (OptionMode.optional & this.mode)
	}

	/**
	 * Returns true if the option can take multiple values.
	 */
	isArray(): boolean {
		return OptionMode.isArray === (OptionMode.isArray & this.mode)
	}

	/**
	 * Sets the default value.
	 */
	setDefault(defaultValue: T) {
		if (OptionMode.none === (OptionMode.none & this.mode) && defaultValue) {
			throw new LogicException('Cannot set a default value when using OptionMode.none mode.')
		}

		if (this.isArray()) {
			if (defaultValue) {
				// defaultValue = []
			} else if (!(defaultValue instanceof Array)) {
				throw new LogicException('A default value for an array option must be an array.')
			}
		}

		this.defaultValue = this.acceptValue() ? defaultValue : undefined
	}

	/**
	 * Returns the default value.
	 */
	getDefault(): T | undefined {
		return this.defaultValue
	}

	/**
	 * Returns the description text.
	 */
	getDescription() {
		return this.description || ''
	}

	/**
	 * Checks whether the given option equals this one.
	 */
	equals(option: this): boolean {
		return false
		// return $option -> getName() === $this -> getName()
		//     && $option -> getShortcut() === $this -> getShortcut()
		//     && $option -> getDefault() === $this -> getDefault()
		//     && $option -> isArray() === $this -> isArray()
		//     && $option -> isValueRequired() === $this -> isValueRequired()
		//     && $option -> isValueOptional() === $this -> isValueOptional()
		//     ;
	}
}
