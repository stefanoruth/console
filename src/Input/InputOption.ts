import { trimStart } from 'lodash'

export class InputOption {
	static readonly VALUE_NONE = 1
	static readonly VALUE_REQUIRED = 2
	static readonly VALUE_OPTIONAL = 4
	static readonly VALUE_IS_ARRAY = 8

	protected name: string
	protected shortcut: string | null
	protected mode: number
	protected description: string
	protected defaultValue: any

	constructor(
		name: string,
		shortcut: string | string[] | null,
		mode?: number,
		description: string = '',
		defaultValue?: any
	) {
		if (name.indexOf('--') === 0) {
			name = name.substr(2)
		}

		if (name.length === 0) {
			throw new Error('An option name cannot be empty.')
		}

		if (typeof shortcut === 'string' && shortcut.length === 0) {
			shortcut = null
		}

		if (shortcut !== null) {
			if (shortcut instanceof Array) {
				shortcut = shortcut.join('|')
			}

			shortcut = trimStart(shortcut, '-')
				.split(/{(\|)-?}/)
				.filter(item => item.length > 0)
				.join('|')

			if (shortcut.length === 0) {
				throw new Error('An option shortcut cannot be empty.')
			}
		}

		if (typeof mode === 'undefined') {
			mode = InputOption.VALUE_NONE
		} else if (mode > 15 || mode < 1) {
			throw new Error(`'Option mode "${mode}" is not valid.'`)
		}

		this.name = name
		this.shortcut = shortcut
		this.mode = mode
		this.description = description

		// if (this.isArray() && !this.acceptValue()) {
		// 	throw new Error('Impossible to have an option mode VALUE_IS_ARRAY if the option does not accept a value.')
		// }

		this.setDefault(defaultValue)
	}

	/**
	 * Returns the option shortcut.
	 */
	getShortcut(): string | null {
		return this.shortcut
	}

	/**
	 * Returns the option name.
	 */
	getName(): string {
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
		return InputOption.VALUE_REQUIRED === (InputOption.VALUE_REQUIRED & this.mode)
	}

	/**
	 * Returns true if the option takes an optional value.
	 */
	isValueOptional(): boolean {
		return InputOption.VALUE_OPTIONAL === (InputOption.VALUE_OPTIONAL & this.mode)
	}

	/**
	 * Returns true if the option can take multiple values.
	 */
	isArray(): boolean {
		return InputOption.VALUE_IS_ARRAY === (InputOption.VALUE_IS_ARRAY & this.mode)
	}

	/**
	 * Sets the default value.
	 */
	setDefault(defaultValue?: any) {
		// if (self:: VALUE_NONE === (self:: VALUE_NONE & $this -> mode) && null !== $default) {
		//     throw new LogicException('Cannot set a default value when using InputOption::VALUE_NONE mode.');
		// }
		// if ($this -> isArray()) {
		//     if (null === $default) {
		//         $default = [];
		//     } elseif(!\is_array($default)) {
		//         throw new LogicException('A default value for an array option must be an array.');
		//     }
		// }

		this.defaultValue = this.acceptValue() ? defaultValue : false
	}

	/**
	 * Returns the default value.
	 */
	getDefault(): any {
		return this.defaultValue
	}

	/**
	 * Returns the description text.
	 */
	getDescription() {
		return this.description
	}
}
